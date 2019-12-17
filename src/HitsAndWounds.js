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
  isNot = x => result => result !== x
  isLessThan = x => result => result < x
  isGreaterThan = x => result => result > x

  count = isTrueFor => hand => hand.filter(isTrueFor).length

  and = (conditionA, conditionB) => arg => conditionA(arg) && conditionB(arg)

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
    keepSixes,
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
            modifyer: 0,
            explodeSixPlus: false,
            keepHitSixes: false,
            hasFailed: _ => false
          })
        )
      )

    steps.push(this.applyModifier(modifyer))
    if (rerollFails && hasFailed) steps.push(this.rerollIf(hasFailed))
    steps.push(
      keepSixes
        ? this.dropIf(this.and(hasFailed, this.isNot(6 + modifyer)))
        : this.dropIf(hasFailed)
    )

    return steps
  }

  getHitSteps = ({
    count,
    BF,
    rerollOnes,
    rerollFails,
    modifyer,
    keepSixes,
    explodeSixPlus
  }) =>
    this.getSteps({
      initialSteps: [_ => count, this.rollHand],
      rerollOnes,
      rerollFails,
      modifyer,
      keepSixes,
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
    keepSixes,
    explodeSixPlus
  }) =>
    this.getSteps({
      initialSteps: count ? [_ => count, this.rollHand] : [this.newHand],
      rerollOnes,
      rerollFails,
      modifyer,
      keepSixes,
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
    doHits,
    hitCount,
    bs,
    hitmod,
    rerollHitsOfOne,
    rerollHitFails,
    keepHitSixes,
    explodeHits,
    doWounds,
    woundCount,
    s,
    t,
    woundmod,
    rerollWoundsOfOne,
    rerollWoundFails,
    keepWoundSixes,
    explodeWounds
  },
  roller = defaultRoller
) => {
  const inputTypes = [
    ['doHits', doHits, 'boolean'],
    ['hitCount', hitCount, 'number', v => v > 0],
    ['bs', bs, 'number', v => v > 0 && v < 7],
    ['hitmod', hitmod, 'number'],
    ['rerollHitsOfOne', rerollHitsOfOne, 'boolean'],
    ['rerollHitFails', rerollHitFails, 'boolean'],
    ['keepWoundSixes', keepWoundSixes, 'boolean'],
    ['explodeHits', explodeHits, 'boolean'],
    ['woundCount', woundCount, 'number', v => v > 0],
    ['doWounds', doWounds, 'boolean'],
    ['s', s, 'number', v => v > 0],
    ['t', t, 'number', v => v > 0],
    ['woundmod', woundmod, 'number'],
    ['rerollWoundsOfOne', rerollWoundsOfOne, 'boolean'],
    ['rerollWoundFails', rerollWoundFails, 'boolean'],
    ['keepHitSixes', keepHitSixes, 'boolean'],
    ['explodeWounds', explodeWounds, 'boolean']
  ]
  inputTypes.forEach(([name, arg, type, assertion]) => {
    if (typeof arg !== type) {
      throw {
        Error: `DiecRoller: Wrong argument type of ${name}`,
        inputTypes
      }
    }

    if (type === 'nummber' && !Number.isSafeInteger(arg)) {
      throw {
        Error: `DiecRoller: Unsafe integer argument on ${name}`,
        inputTypes
      }
    }

    if (assertion && !assertion(arg)) {
      throw {
        Error: `DiecRoller: Argument failed assertion on ${name}`,
        inputTypes
      }
    }
  })

  let steps = doHits
    ? roller.getHitSteps({
        count: hitCount,
        BF: bs,
        rerollOnes: rerollHitsOfOne,
        rerollFails: rerollHitFails,
        modifyer: hitmod,
        keepSixes: keepHitSixes,
        explodeSixPlus: explodeHits
      })
    : []

  if (doWounds) {
    steps = [
      ...steps,
      ...roller.getWoundSteps({
        count: !doHits && woundCount,
        S: s,
        T: t,
        rerollOnes: rerollWoundsOfOne,
        rerollFails: rerollWoundFails,
        modifyer: woundmod,
        keepSixes: keepWoundSixes,
        explodeSixPlus: explodeWounds
      })
    ]
  }

  return roller.doSequence(steps)
}
