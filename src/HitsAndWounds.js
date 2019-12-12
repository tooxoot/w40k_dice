export class Roller {
  constructor(random) {
    this.random = random || Math.random
  }

  rollD6 = () => Math.ceil(this.random() * 6)

  rollHand = count => [...new Array(count)].map(this.rollD6)

  rerollIf = isTrueFor => hand =>
    hand.map(result => (isTrueFor(result) ? this.rollD6() : result))

  newHand = hand => this.rollHand(hand.length)

  dropIf = isTrueFor => hand => hand.filter(result => !isTrueFor(result))

  applyModifier = modifyer => hand => hand.map(result => result + modifyer)

  is = x => result => result === x
  isLessThan = x => result => result < x
  isGreaterThan = x => result => result > x

  count = isTrueFor => hand => hand.filter(isTrueFor).length

  doSequence = steps =>
    steps.reduce((hands, step) => [...hands, step(hands.slice(-1)[0])], [[]])

  toSubsequence = steps => [
    hand => [steps[0](hand), hand],
    ...steps
      .slice(1)
      .map(step => ([subResult, hand]) => [step(subResult), hand]),
    ([subResult, hand]) => [...subResult, ...hand]
  ]

  getSteps = ({
    initialSteps,
    rerollOnes,
    rerollFails,
    modifyer,
    explodeSixPlus,
    hasFailed
  }) => {
    if (rerollFails && explodeSixPlus)
      throw 'Error: Reroll Fails && Explode Sixes'
    let steps = initialSteps ? initialSteps : []

    if (rerollOnes) steps.push(this.rerollIf(this.is(1)))

    if (explodeSixPlus)
      steps.push(
        ...this.toSubsequence(
          this.getSteps({
            initialSteps: [this.count(this.is(6)), this.rollHand],
            rerollOnes,
            rerollFails,
            modifyer,
            explodeSixPlus: false,
            hasFailed: _ => false
          })
        )
      )

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
  }) =>
    this.getSteps({
      initialSteps: [_ => count, this.rollHand],
      rerollOnes,
      rerollFails,
      modifyer,
      explodeSixPlus,
      hasFailed: this.isLessThan(BF)
    })

  getWoundSteps = ({
    count,
    S,
    T,
    rerollOnes,
    rerollFails,
    modifyer = 0,
    explodeSixPlus
  }) =>
    this.getSteps({
      initialSteps: count ? [_ => count, this.rollHand] : [this.newHand],
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
}

const defaultRoller = new Roller()
export const getResult = (
  {
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
  },
  roller = defaultRoller
) => {
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
