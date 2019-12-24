import { getResult, Roller } from './HitsAndWounds'

let samplesize = 6 ** 5

let hits = {
  count: samplesize,
  bs: 4,
  modifyer: 0,
  rerollOnes: false,
  rerollFails: false,
  keepSixes: false,
  explodeSixes: false
}

let wounds = {
  count: samplesize,
  s: 4,
  t: 4,
  modifyer: 0,
  rerollOnes: false,
  rerollFails: false,
  keepSixes: false,
  explodeSixes: false
}

const mockRandom = () => {
  let c = 0
  return () => (c === 6 ? (c = 1) : ++c) / 6
}

test('Roller constructor', () => {
  const o = {}
  expect(new Roller(o).random).toBe(o)
  expect(new Roller().random).toBe(Math.random)
})

describe('Hits', () => {
  test('simple bs = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult({ hits }, roller).slice(-1)[0].length
    let expected = samplesize / 2

    expect(count).toBe(expected)
  })

  test('simple bs = 5', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, bs: 6 }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize / 6

    expect(count).toBe(expected)
  })

  test('mod = +2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, modifyer: 2 }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (5 / 6)

    expect(count).toBe(expected)
  })

  test('mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, modifyer: -2 }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 6)

    expect(count).toBe(expected)
  })

  test('reroll ones', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, rerollOnes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('reroll fails', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, rerollFails: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 2 / 2)

    expect(count).toBe(expected)
  })

  test('explode', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, explodeSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('reroll ones and fails', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, rerollOnes: true, rerollFails: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)
    expected = expected + (samplesize - expected) / 2

    expect(count).toBe(expected)
  })

  test('reroll ones and explode', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, rerollOnes: true, explodeSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)
    let allSixes = samplesize * (1 / 6 + 1 / 6 / 6)
    expected = expected + allSixes * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('keep, bs = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, keepSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2)

    expect(count).toBe(expected)
  })

  test('keep, mod = +2, bs = 6', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, bs: 6, modifyer: 2, keepSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (3 / 6)

    expect(count).toBe(expected)
  })

  test('keep, mod = -2, bs = 5', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: { ...hits, bs: 5, modifyer: -2, keepSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 6)

    expect(count).toBe(expected)
  })

  test('reroll ones and keep, mod = -2, bs = 5', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: {
          ...hits,
          bs: 5,
          modifyer: -2,
          rerollOnes: true,
          keepSixes: true
        }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize / 6 + samplesize / 6 / 6

    expect(count).toBe(expected)
  })

  test('explode and keep, mod = -2, bs = 5', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: {
          ...hits,
          bs: 5,
          modifyer: -2,
          explodeSixes: true,
          keepSixes: true
        }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize / 6 + samplesize / 6 / 6

    expect(count).toBe(expected)
  })

  test('rerollOnes and explode and keep, mod = -2, bs = 5', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits: {
          ...hits,
          bs: 5,
          modifyer: -2,
          rerollOnes: true,
          explodeSixes: true,
          keepSixes: true
        }
      },
      roller
    ).slice(-1)[0].length
    let expected =
      samplesize / 6 +
      samplesize / 6 / 6 +
      samplesize / 6 / 6 +
      samplesize / 6 / 6 / 6 +
      samplesize / 6 / 6 / 6 +
      samplesize / 6 / 6 / 6 / 6

    expect(count).toBe(expected)
  })
})

describe('Wounds', () => {
  test('simple t = s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult({ wounds }, roller).slice(-1)[0].length
    let expected = samplesize * (3 / 6)

    expect(count).toBe(expected)
  })

  test('simple t = 3, s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, t: 3 }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (4 / 6)

    expect(count).toBe(expected)
  })

  test('simple t = 1, s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, t: 1 }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (5 / 6)

    expect(count).toBe(expected)
  })

  test('simple t = 7, s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, t: 7 }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (2 / 6)

    expect(count).toBe(expected)
  })

  test('simple t = 16, s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, t: 16 }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 6)

    expect(count).toBe(expected)
  })

  test('mod = +2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: {
          ...wounds,
          modifyer: 2
        }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (5 / 6)

    expect(count).toBe(expected)
  })

  test('mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, modifyer: -2 }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 6)

    expect(count).toBe(expected)
  })

  test('reroll ones', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, rerollOnes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('reroll fails', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, rerollFails: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 2 / 2)

    expect(count).toBe(expected)
  })

  test('explode', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, explodeSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('reroll ones and fails', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, rerollOnes: true, rerollFails: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)
    expected = expected + (samplesize - expected) / 2

    expect(count).toBe(expected)
  })

  test('reroll ones and explode', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, rerollOnes: true, explodeSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)
    let allSixes = samplesize * (1 / 6 + 1 / 6 / 6)
    expected = expected + allSixes * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('keep', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, keepSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 2)

    expect(count).toBe(expected)
  })

  test('keep, mod = +2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: { ...wounds, t: 8, modifyer: 2, keepSixes: true }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (3 / 6)

    expect(count).toBe(expected)
  })

  test('keep, mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: {
          ...wounds,
          t: 5,
          modifyer: -2,

          keepSixes: true
        }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize * (1 / 6)

    expect(count).toBe(expected)
  })

  test('reroll ones and keep, mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: {
          ...wounds,
          t: 5,
          modifyer: -2,
          rerollOnes: true,
          keepSixes: true
        }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize / 6 + samplesize / 6 / 6

    expect(count).toBe(expected)
  })

  test('explode and keep, mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: {
          ...wounds,
          t: 5,
          modifyer: -2,
          explodeSixes: true,
          keepSixes: true
        }
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize / 6 + samplesize / 6 / 6

    expect(count).toBe(expected)
  })

  test('rerollOnes and explode and keep, mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        wounds: {
          ...wounds,
          t: 5,
          modifyer: -2,
          rerollOnes: true,
          explodeSixes: true,
          keepSixes: true
        }
      },
      roller
    ).slice(-1)[0].length
    let expected =
      samplesize / 6 +
      samplesize / 6 / 6 +
      samplesize / 6 / 6 +
      samplesize / 6 / 6 / 6 +
      samplesize / 6 / 6 / 6 +
      samplesize / 6 / 6 / 6 / 6

    expect(count).toBe(expected)
  })
})

describe('Hits ands Wounds', () => {
  test('simple', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        hits,
        wounds
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize / 4

    expect(count).toBe(expected)
  })
})
