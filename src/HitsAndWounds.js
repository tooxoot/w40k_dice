export const rollD6 = () => Math.ceil(Math.random() * 6)

export const rollHand = count => _hand => [...new Array(count)].map(rollD6)
export const rerollIf = isTrueFor => hand =>
  hand.map(result => (isTrueFor(result) ? rollD6() : result))
export const newHand = hand => rollHand(hand.length)()
export const dropIf = isTrueFor => hand =>
  hand.filter(result => !isTrueFor(result))
export const applyModifier = modifyer => hand =>
  hand.map(result => result + modifyer)

export const is = x => result => result === x
export const isLessThan = x => result => result < x
export const isGreaterThan = x => result => result > x

export const doSequence = steps =>
  steps.reduce((hands, step) => [...hands, step(hands.slice(-1)[0])], [[]])

export const count = isTrueFor => hand => hand.filter(isTrueFor).length
export const getCounts = hand =>
  [
    count(isLessThan(1)),
    count(is(1)),
    count(is(2)),
    count(is(3)),
    count(is(4)),
    count(is(5)),
    count(is(6)),
    count(isGreaterThan(6))
  ].map(f => f(hand))

export const getSteps = ({
  rerollOnes,
  rerollFails,
  modifyer,
  explodeSixPlus,
  hasFailed
}) => {
  if (rerollFails && explodeSixPlus)
    throw 'Error: Reroll Fails && Explode Sixes'
  const steps = []

  if (rerollOnes) steps.push(rerollIf(is(1)))

  if (explodeSixPlus)
    steps.push(hand => {
      let count6 = count(is(6))(hand)
      let newRolls = rollHand(count6)()
      if (rerollOnes) newRolls = rerollIf(is(1))(newRolls)
      return [...hand, ...newRolls]
    })

  steps.push(applyModifier(modifyer))
  if (rerollFails && hasFailed) steps.push(rerollIf(hasFailed))
  steps.push(dropIf(hasFailed))
  return steps
}

export const getHitSteps = ({
  count,
  BF,
  rerollOnes,
  rerollFails,
  modifyer,
  explodeSixPlus
}) => [
  rollHand(count),
  ...getSteps({
    rerollOnes,
    rerollFails,
    modifyer,
    explodeSixPlus,
    hasFailed: isLessThan(BF)
  })
]

export const getWoundSteps = ({
  count,
  S,
  T,
  rerollOnes,
  rerollFails,
  modifyer = 0,
  explodeSixPlus
}) => [
  count ? rollHand(count) : newHand,
  ...getSteps({
    rerollOnes,
    rerollFails,
    modifyer,
    explodeSixPlus,
    hasFailed:
      S >= 2 * T
        ? isLessThan(2)
        : S > T
        ? isLessThan(3)
        : S === T
        ? isLessThan(4)
        : !(2 * S <= T)
        ? isLessThan(5)
        : isLessThan(6)
  })
]

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

  let steps = getHitSteps({
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
      ...getWoundSteps({
        S: s,
        T: t,
        rerollOnes: rerollWoundsOfOne,
        rerollFails: rerollWoundFails,
        modifyer: woundmod,
        explodeSixPlus: explodeWounds
      })
    ]
  }

  return doSequence(steps)
}
