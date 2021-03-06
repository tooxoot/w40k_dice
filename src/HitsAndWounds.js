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
    explodeSixes,
    keepSixes,
    hasFailed
  }) => {
    if (rerollFails && explodeSixes)
      throw 'Error: Reroll Fails && Explode Sixes'
    let steps = initialSteps ? initialSteps : []

    if (rerollOnes) steps.push(this.rerollIf(this.is(1)))

    if (explodeSixes)
      steps.push(
        ...this.toSubsequence(
          this.getSteps({
            initialSteps: [this.count(this.is(6)), this.rollHand],
            rerollOnes,
            rerollFails,
            modifyer: 0,
            explodeSixes: false,
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
    bs,
    rerollOnes,
    rerollFails,
    modifyer,
    keepSixes,
    explodeSixes
  }) =>
    this.getSteps({
      initialSteps: [_ => count, this.rollHand],
      rerollOnes,
      rerollFails,
      modifyer,
      keepSixes,
      explodeSixes,
      hasFailed: this.isLessThan(bs)
    })

  getWoundSteps = (
    {
      count,
      s,
      t,
      rerollOnes,
      rerollFails,
      modifyer = 0,
      keepSixes,
      explodeSixes
    },
    aos = false
  ) =>
    this.getSteps({
      initialSteps: count ? [_ => count, this.rollHand] : [this.newHand],
      rerollOnes,
      rerollFails,
      modifyer,
      keepSixes,
      explodeSixes,
      hasFailed: aos
        ? this.isLessThan(s)
        : s >= 2 * t
        ? this.isLessThan(2)
        : s > t
        ? this.isLessThan(3)
        : s === t
        ? this.isLessThan(4)
        : !(2 * s <= t)
        ? this.isLessThan(5)
        : this.isLessThan(6)
    })
}

const defaultRoller = new Roller()
/**
 * @param {{
 *  aos: boolean,
 *  hits?:{count, bs, modifyer, rerollOnes, rerollFails, keepSixes, explodeSixes},
 *  wounds?:{count, s, t, modifyer, rerollOnes, rerollFails, keepSixes, explodeSixes}
 * }} opt
 * @param {Roller} roller
 */
export const getResult = (opt, roller = defaultRoller) => {
  const { aos, hits, wounds } = opt

  if (!hits & !wounds)
    throw {
      Error: 'Wrong arguments - Neither hits nor wounds are defined'
    }

  const checkedTypes = []

  checkedTypes.push(['aos', aos, 'boolean'])

  if (hits)
    checkedTypes.push(
      ['hits.count', hits.count, 'number', v => v > -1],
      ['hits.bs', hits.bs, 'number', v => v > 0 && v < 7],
      ['hits.modifyer', hits.modifyer, 'number'],
      ['hits.rerollOnes', hits.rerollOnes, 'boolean'],
      ['hits.rerollFails', hits.rerollFails, 'boolean'],
      ['hits.keepSixes', hits.keepSixes, 'boolean'],
      ['hits.explodeSixes', hits.explodeSixes, 'boolean']
    )

  if (!hits)
    checkedTypes.push(['wounds.count', wounds.count, 'number', v => v > -1])

  if (wounds)
    checkedTypes.push(
      ['wounds.s', wounds.s, 'number', v => v > 0],
      ['wounds.modifyer', wounds.modifyer, 'number'],
      ['wounds.rerollOnes', wounds.rerollOnes, 'boolean'],
      ['wounds.rerollFails', wounds.rerollFails, 'boolean'],
      ['wounds.keepSixes', wounds.keepSixes, 'boolean'],
      ['wounds.explodeSixes', wounds.explodeSixes, 'boolean']
    )

  if (wounds && !aos)
    checkedTypes.push(['wounds.t', wounds.t, 'number', v => v > 0])

  checkedTypes.forEach(([name, arg, type, assertion]) => {
    if (typeof arg !== type) {
      throw {
        Error: `Wrong argument type of ${name}`,
        assertion: [arg, type, String(assertion)]
      }
    }

    if (type === 'nummber' && !Number.isSafeInteger(arg)) {
      throw {
        Error: `Unsafe integer argument on ${name}`,
        assertion: [arg, type, String(assertion)]
      }
    }

    if (assertion && !assertion(arg)) {
      throw {
        Error: `Argument failed assertion on ${name}`,
        assertion: [arg, type, String(assertion)]
      }
    }
  })

  let steps = hits ? roller.getHitSteps(hits) : []

  if (wounds) {
    steps = [
      ...steps,
      ...roller.getWoundSteps({ ...wounds, count: !hits && wounds.count }, aos)
    ]
  }

  return roller.doSequence(steps)
}
