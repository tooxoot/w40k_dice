import { getResult } from './HitsAndWounds'

let samplesize = 12000
let args = {
  count: samplesize,
  bs: 4,
  hitmod: 0,
  rerollHitsOfOne: false,
  rerollHitFails: false,
  explodeHits: false,
  doWounds: false,
  s: 4,
  t: 4,
  woundmod: 0,
  rerollWoundsOfOne: false,
  rerollWoundFails: false,
  explodeWounds: false
}
const tolerance = 0.001

let c = 0
Math.random = () => (c === 6 ? (c = 1) : ++c) / 6

describe('Hits', () => {
  test('simple bs = 4', () => {
    let count = getResult(args).slice(-1)[0].length
    let expected = samplesize / 2

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('simple bs = 6', () => {
    let count = getResult({
      ...args,
      bs: 6
    }).slice(-1)[0].length
    let expected = samplesize / 6

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('mod = +2', () => {
    let count = getResult({
      ...args,
      hitmod: 2
    }).slice(-1)[0].length
    let expected = samplesize * (5 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('mod = -2', () => {
    let count = getResult({
      ...args,
      hitmod: -2
    }).slice(-1)[0].length
    let expected = samplesize * (1 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('reroll ones', () => {
    let count = getResult({
      ...args,
      rerollHitsOfOne: true
    }).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('reroll fails', () => {
    let count = getResult({
      ...args,
      rerollHitFails: true
    }).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 2 / 2)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('explode', () => {
    let count = getResult({
      ...args,
      explodeHits: true
    }).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('reroll ones and fails', () => {
    let count = getResult({
      ...args,
      rerollHitsOfOne: true,
      rerollHitFails: true
    }).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)
    expected = expected + (samplesize - expected) / 2

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('reroll ones and explode', () => {
    let count = getResult({
      ...args,
      rerollHitsOfOne: true,
      explodeHits: true
    }).slice(-1)[0].length
    let expected = samplesize * (1 / 2 + 1 / 6 / 2)
    let allSixes = samplesize * (1 / 6 + 1 / 6 / 6)
    expected = expected + allSixes * (1 / 2 + 1 / 6 / 2)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })
})

describe('hits and wounds', () => {
  test('simple t = s = 4', () => {
    let count = getResult({
      ...args,
      doWounds: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (3 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('simple t = 3, s = 4', () => {
    let count = getResult({
      ...args,
      t: 3,
      doWounds: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (4 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('simple t = 1, s = 4', () => {
    let count = getResult({
      ...args,
      t: 1,
      doWounds: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (5 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('simple t = 7, s = 4', () => {
    let count = getResult({
      ...args,
      t: 7,
      doWounds: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (2 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('simple t = 16, s = 4', () => {
    let count = getResult({
      ...args,
      t: 16,
      doWounds: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('mod = +2', () => {
    let count = getResult({
      ...args,
      doWounds: true,
      woundmod: 2
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (5 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('mod = -2', () => {
    let count = getResult({
      ...args,
      doWounds: true,
      woundmod: -2
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 6)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('reroll ones', () => {
    let count = getResult({
      ...args,
      doWounds: true,
      rerollWoundsOfOne: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 6 / 2)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('reroll fails', () => {
    let count = getResult({
      ...args,
      doWounds: true,
      rerollWoundFails: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 2 / 2)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('explode', () => {
    let count = getResult({
      ...args,
      doWounds: true,
      explodeWounds: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 6 / 2)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('reroll ones and fails', () => {
    let count = getResult({
      ...args,
      doWounds: true,
      rerollWoundsOfOne: true,
      rerollWoundFails: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 6 / 2)
    expected = expected + (samplesize / 2 - expected) / 2

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })

  test('reroll ones and explode', () => {
    let count = getResult({
      ...args,
      doWounds: true,
      rerollWoundsOfOne: true,
      explodeWounds: true
    }).slice(-1)[0].length
    let expected = (samplesize / 2) * (1 / 2 + 1 / 6 / 2)
    let allSixes = (samplesize / 2) * (1 / 6 + 1 / 6 / 6)
    expected = expected + allSixes * (1 / 2 + 1 / 6 / 2)

    expect(Math.abs(count / expected - 1)).toBeLessThan(tolerance)
  })
})
