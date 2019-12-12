import { getResult, Roller } from './HitsAndWounds'

let samplesize = 6 ** 5
let args = {
  count: samplesize,
  bs: 4,
  hitmod: 0,
  rerollHitsOfOne: false,
  rerollHitFails: false,
  keepHitSixes: false,
  explodeHits: false,
  doWounds: false,
  s: 4,
  t: 4,
  woundmod: 0,
  rerollWoundsOfOne: false,
  rerollWoundFails: false,
  keepWoundSixes: false,
  explodeWounds: false
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
    let count = getResult(args, roller).slice(-1)[0].length
    let expected = samplesize / 2

    expect(count).toBe(expected)
  })

  test('simple bs = 5', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        bs: 6
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
        ...args,
        hitmod: 2
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
        ...args,
        hitmod: -2
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
        ...args,
        rerollHitsOfOne: true
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
        ...args,
        rerollHitFails: true
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
        ...args,
        explodeHits: true
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
        ...args,
        rerollHitsOfOne: true,
        rerollHitFails: true
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
        ...args,
        rerollHitsOfOne: true,
        explodeHits: true
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
        ...args,
        keepHitSixes: true
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
        ...args,
        bs: 6,
        hitmod: 2,
        keepHitSixes: true
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
        ...args,
        bs: 5,
        hitmod: -2,
        keepHitSixes: true
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
        ...args,
        bs: 5,
        hitmod: -2,
        rerollHitsOfOne: true,
        keepHitSixes: true
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
        ...args,
        bs: 5,
        hitmod: -2,
        explodeHits: true,
        keepHitSixes: true
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
        ...args,
        bs: 5,
        hitmod: -2,
        rerollHitsOfOne: true,
        explodeHits: true,
        keepHitSixes: true
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

describe('hits and wounds', () => {
  test('simple t = s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (3 / 6)

    expect(count).toBe(expected)
  })

  test('simple t = 3, s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 3,
        doWounds: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (4 / 6)

    expect(count).toBe(expected)
  })

  test('simple t = 1, s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 1,
        doWounds: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (5 / 6)

    expect(count).toBe(expected)
  })

  test('simple t = 7, s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 7,
        doWounds: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (2 / 6)

    expect(count).toBe(expected)
  })

  test('simple t = 16, s = 4', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 16,
        doWounds: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 6)

    expect(count).toBe(expected)
  })

  test('mod = +2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true,
        woundmod: 2
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (5 / 6)

    expect(count).toBe(expected)
  })

  test('mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true,
        woundmod: -2
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 6)

    expect(count).toBe(expected)
  })

  test('reroll ones', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true,
        rerollWoundsOfOne: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('reroll fails', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true,
        rerollWoundFails: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 2 / 2)

    expect(count).toBe(expected)
  })

  test('explode', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true,
        explodeWounds: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('reroll ones and fails', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true,
        rerollWoundsOfOne: true,
        rerollWoundFails: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 6 / 2)
    expected = expected + (samplesize / 2 - expected) / 2

    expect(count).toBe(expected)
  })

  test('reroll ones and explode', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true,
        rerollWoundsOfOne: true,
        explodeWounds: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 6 / 2)
    let allSixes = (samplesize / 2) * (1 / 6 + 1 / 6 / 6)
    expected = expected + allSixes * (1 / 2 + 1 / 6 / 2)

    expect(count).toBe(expected)
  })

  test('keep', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        doWounds: true,
        keepWoundSixes: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2)

    expect(count).toBe(expected)
  })

  test('keep, mod = +2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 8,
        woundmod: 2,
        doWounds: true,
        keepWoundSixes: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (3 / 6)

    expect(count).toBe(expected)
  })

  test('keep, mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 5,
        woundmod: -2,
        doWounds: true,
        keepWoundSixes: true
      },
      roller
    ).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 6)

    expect(count).toBe(expected)
  })

  test('reroll ones and keep, mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 5,
        woundmod: -2,
        rerollWoundsOfOne: true,
        doWounds: true,
        keepWoundSixes: true
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize / 2 / 6 + samplesize / 2 / 6 / 6

    expect(count).toBe(expected)
  })

  test('explode and keep, mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 5,
        woundmod: -2,
        explodeWounds: true,
        doWounds: true,
        keepWoundSixes: true
      },
      roller
    ).slice(-1)[0].length
    let expected = samplesize / 2 / 6 + samplesize / 2 / 6 / 6

    expect(count).toBe(expected)
  })

  test('rerollOnes and explode and keep, mod = -2', () => {
    let roller = new Roller(mockRandom())
    let count = getResult(
      {
        ...args,
        t: 5,
        woundmod: -2,
        rerollWoundsOfOne: true,
        explodeWounds: true,
        doWounds: true,
        keepWoundSixes: true
      },
      roller
    ).slice(-1)[0].length
    let expected =
      samplesize / 2 / 6 +
      samplesize / 2 / 6 / 6 +
      samplesize / 2 / 6 / 6 +
      samplesize / 2 / 6 / 6 / 6 +
      samplesize / 2 / 6 / 6 / 6 +
      samplesize / 2 / 6 / 6 / 6 / 6

    expect(count).toBe(expected)
  })
})
