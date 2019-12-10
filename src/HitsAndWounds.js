export class Roller {
  random = Math.random
  rollD6 = () => Math.ceil(this.random() * 6)

  rollHand = count => _hand => [...new Array(count)].map(this.rollD6)

  rerollIf = isTrueFor => hand =>
    hand.map(result => (isTrueFor(result) ? this.rollD6() : result))

  newHand = hand => this.rollHand(hand.length)()

  dropIf = isTrueFor => hand => hand.filter(result => !isTrueFor(result))

  applyModifier = modifyer => hand => hand.map(result => result + modifyer)

  is = x => result => result === x
  isLessThan = x => result => result < x
  isGreaterThan = x => result => result > x

  count = isTrueFor => hand => hand.filter(isTrueFor).length

  doSequence = steps =>
    steps.reduce((hands, step) => [...hands, step(hands.slice(-1)[0])], [[]])

  getSteps = ({
    rerollOnes,
    rerollFails,
    modifyer,
    explodeSixPlus,
    hasFailed
  }) => {
    if (rerollFails && explodeSixPlus)
      throw 'Error: Reroll Fails && Explode Sixes'
    const steps = []

    if (rerollOnes) steps.push(this.rerollIf(this.is(1)))

    if (explodeSixPlus)
      steps.push(hand => {
        let count6 = this.count(this.is(6))(hand)
        let newRolls = this.rollHand(count6)()
        if (rerollOnes) newRolls = this.rerollIf(this.is(1))(newRolls)
        return [...hand, ...newRolls]
      })

    steps.push(this.applyModifier(modifyer))
    if (rerollFails && hasFailed) steps.push(this.rerollIf(hasFailed))
    steps.push(this.dropIf(hasFailed))
    return steps
  }

  getHitSteps = ({
    count,
    BF,
    rerollOnes,
    rerollFails,
    modifyer,
    explodeSixPlus
  }) => [
    this.rollHand(count),
    ...this.getSteps({
      rerollOnes,
      rerollFails,
      modifyer,
      explodeSixPlus,
      hasFailed: this.isLessThan(BF)
    })
  ]

  getWoundSteps = ({
    count,
    S,
    T,
    rerollOnes,
    rerollFails,
    modifyer = 0,
    explodeSixPlus
  }) => [
    count ? this.rollHand(count) : this.newHand,
    ...this.getSteps({
      rerollOnes,
      rerollFails,
      modifyer,
      explodeSixPlus,
      hasFailed:
        S >= 2 * T
          ? this.isLessThan(2)
          : S > T
          ? this.isLessThan(3)
          : S === T
          ? this.isLessThan(4)
          : !(2 * S <= T)
          ? this.isLessThan(5)
          : this.isLessThan(6)
    })
  ]
}

export const getResult = ({
  count,
  bs,
  hitmod,
  rerollHitsOfOne,
  rerollHitFails,
  explodeHits,
  doWounds,
  s,
  t,
  woundmod,
  rerollWoundsOfOne,
  rerollWoundFails,
  explodeWounds
}) => {
  const inputTypes = [
    [count, 'number', v => v > 0],
    [bs, 'number', v => v > 0 && v < 7],
    [hitmod, 'number'],
    [rerollHitsOfOne, 'boolean'],
    [rerollHitFails, 'boolean'],
    [explodeHits, 'boolean'],
    [doWounds, 'boolean'],
    [s, 'number', v => v > 0],
    [t, 'number', v => v > 0],
    [woundmod, 'number'],
    [rerollWoundsOfOne, 'boolean'],
    [rerollWoundFails, 'boolean'],
    [explodeWounds, 'boolean']
  ]

  inputTypes.forEach(([arg, type, assertion]) => {
    if (typeof arg !== type) {
      throw {
        Error: `DiecRoller: Wrong argument type`,
        inputTypes
      }
    }

    if (type === 'nummber' && !Number.isSafeInteger(arg)) {
      throw { Error: `DiecRoller: Unsafe integer argument`, inputTypes }
    }

    if (assertion && !assertion(arg)) {
      throw { Error: `DiecRoller: Argument failed assertion`, inputTypes }
    }
  })

  let roller = new Roller()

  let steps = roller.getHitSteps({
    count: count,
    BF: bs,
    rerollOnes: rerollHitsOfOne,
    rerollFails: rerollHitFails,
    modifyer: hitmod,
    explodeSixPlus: explodeHits
  })

  if (doWounds) {
    steps = [
      ...steps,
      ...roller.getWoundSteps({
        S: s,
        T: t,
        rerollOnes: rerollWoundsOfOne,
        rerollFails: rerollWoundFails,
        modifyer: woundmod,
        explodeSixPlus: explodeWounds
      })
    ]
  }

  return roller.doSequence(steps)
}
