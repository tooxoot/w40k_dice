import React from 'react'
import './App.css'
import { getResult } from './HitsAndWounds'

class Log extends React.Component {
  constructor(hands) {
    super(hands)
    this.state = {
      expanded: false
    }
  }

  componentDidUpdate() {
    if (!this.state.expanded) {
      return
    }
    this.refs['content'].scrollIntoView()
  }

  render() {
    return (
      <div className='log'>
        <div
          className={`log-label ${this.state.expanded ? 'log-expanded' : ''}`}
          onClick={() => this.setState({ expanded: !this.state.expanded })}
        >
          Show Log: {this.state.expanded ? <>&#11023;</> : <>&#11022;</>}
        </div>
        <div
          className={`log-content ${this.state.expanded ? 'log-expanded' : ''}`}
          ref={'content'}
        >
          {this.props.hands.map((hand, idx) => (
            <div key={idx}>{JSON.stringify(hand)}</div>
          ))}
        </div>
      </div>
    )
  }
}

const Table = ({ hand }) => (
  <div className='result-table'>
    <div className='head'>&lt; 1</div>
    <div className='head'>1</div>
    <div className='head'>2</div>
    <div className='head'>3</div>
    <div className='head'>4</div>
    <div className='head'>5</div>
    <div className='head'>6</div>
    <div className='head'>&gt; 6</div>
    <div>{hand.filter(x => x < 1).length}</div>
    <div>{hand.filter(x => x === 1).length}</div>
    <div>{hand.filter(x => x === 2).length}</div>
    <div>{hand.filter(x => x === 3).length}</div>
    <div>{hand.filter(x => x === 4).length}</div>
    <div>{hand.filter(x => x === 5).length}</div>
    <div>{hand.filter(x => x === 6).length}</div>
    <div>{hand.filter(x => x > 6).length}</div>
  </div>
)

const Total = ({ hand }) => <div className='total'>{hand.length}</div>

const Check = ({ text, checked, onChange }) => (
  <div className='check'>
    <input
      type='checkbox'
      checked={checked}
      onChange={e => onChange(e.target.checked)}
    />
    {text ? <div>{text}</div> : ''}
  </div>
)

const Slider = ({ text, value, min, max, onChange }) => (
  <>
    <div className='slider-label'>{text}:</div>
    <div className='slider-value'>{value}</div>
    <button
      className='slider-button slider-decrement'
      onClick={_ => onChange(value - 1)}
    >
      -
    </button>
    <input
      className='slider-range'
      type='range'
      onChange={e => onChange(Number(e.target.value))}
      {...{ value, min, max }}
    />
    <button
      className='slider-button slider-increment'
      onClick={_ => onChange(value + 1)}
    >
      +
    </button>
  </>
)

class App extends React.Component {
  constructor({ aos = false }) {
    super()
    this.state = {
      hands: undefined,
      hits: {
        count: 20,
        bs: 4,
        modifyer: 0,
        rerollOnes: false,
        rerollFails: false,
        keepSixes: false,
        explodeSixes: false
      },
      doWounds: false,
      wounds: {
        count: 0,
        s: 4,
        t: 4,
        modifyer: 0,
        rerollOnes: false,
        rerollFails: false,
        keepSixes: false,
        explodeSixes: false
      },
      aos
    }

    this.ref = React.createRef()
  }

  roll = () =>
    this.setState({
      hands: getResult({
        hits: this.state.hits,
        wounds: this.state.doWounds && this.state.wounds,
        aos: this.state.doWounds && this.state.aos
      })
    })

  postroll() {
    this.setState({
      hands: getResult({
        wounds: this.state.wounds,
        aos: this.state.aos
      })
    })
  }

  wigglePostRoll = () =>
    !this.state.doWounds &&
    this.ref.current &&
    this.ref.current.classList.toggle('wiggle')

  setHits = (hits, callback) =>
    this.setState({ hits: { ...this.state.hits, ...hits } }, callback)
  setWounds = (wounds, callback) =>
    this.setState({ wounds: { ...this.state.wounds, ...wounds } }, callback)

  render() {
    return (
      <div className='app'>
        <Table hand={this.state.hands ? this.state.hands.slice(-2)[0] : []} />
        <Total hand={this.state.hands ? this.state.hands.slice(-1)[0] : []} />
        <button
          className='roll red'
          onClick={() => {
            this.roll()
            this.wigglePostRoll()
          }}
        >
          ROLL
        </button>
        {/* HITS */}
        <>
          <h3 className='hit-title'>Hits:</h3>
          <Slider
            text='Count'
            value={this.state.hits.count}
            min={1}
            max={100}
            onChange={count => this.setHits({ count })}
          />
          <Slider
            text={this.state.aos ? 'To Hit' : 'BS'}
            value={this.state.bs}
            min={1}
            max={6}
            onChange={bs => this.setHits({ bs })}
          />
          <Slider
            text='Modifier'
            value={this.state.hits.modifyer}
            min={-3}
            max={3}
            onChange={modifyer => this.setHits({ modifyer })}
          />
          <div className='check-row'>
            <Check
              text='Reroll Ones'
              checked={this.state.hits.rerollOnes}
              onChange={rerollOnes => this.setHits({ rerollOnes })}
            />
            <Check
              text='Reroll Fails'
              checked={this.state.hits.rerollFails}
              onChange={rerollFails => this.setHits({ rerollFails })}
            />
            <Check
              text='Keep 6'
              checked={this.state.hits.keepSixes}
              onChange={keepSixes => this.setHits({ keepSixes })}
            />
            <Check
              text='Explode on 6'
              checked={this.state.hits.explodeSixes}
              onChange={explodeSixes => this.setHits({ explodeSixes })}
            />
          </div>
        </>
        {/* WOUNDS */}
        <>
          <h3 className='wound-title'>
            Wounds:
            <Check
              text=''
              checked={this.state.doWounds}
              onChange={doWounds => this.setState({ doWounds })}
            />
            <button
              ref={this.ref}
              className='postroll red'
              onAnimationEnd={() => this.ref.current.classList.toggle('wiggle')}
              onClick={() =>
                this.setWounds(
                  {
                    count: this.state.hands.slice(-1)[0].length
                  },
                  this.postroll
                )
              }
              disabled={!(this.state.hands && !this.state.doWounds)}
            >
              Roll Wounds using Result
            </button>
          </h3>
          {this.state.aos ? (
            <Slider
              text='To Wound'
              value={this.state.wounds.s}
              min={1}
              max={6}
              onChange={s => this.setWounds({ s })}
            />
          ) : (
            <>
              <Slider
                text='S'
                value={this.state.wounds.s}
                min={1}
                max={10}
                onChange={s => this.setWounds({ s })}
              />
              <Slider
                text='T'
                value={this.state.wounds.t}
                min={1}
                max={10}
                onChange={t => this.setWounds({ t })}
              />
            </>
          )}
          <Slider
            text='Modifier'
            value={this.state.wounds.modifyer}
            min={-3}
            max={3}
            onChange={modifyer => this.setWounds({ modifyer })}
          />
          <div className='check-row'>
            <Check
              text='Reroll Ones'
              checked={this.state.wounds.rerollOnes}
              onChange={rerollOnes => this.setWounds({ rerollOnes })}
            />
            <Check
              text='Reroll Fails'
              checked={this.state.wounds.rerollFails}
              onChange={rerollFails => this.setWounds({ rerollFails })}
            />
            <Check
              text='Keep 6'
              checked={this.state.wounds.keepSixes}
              onChange={keepSixes => this.setWounds({ keepSixes })}
            />
            <Check
              text='Explode on 6'
              checked={this.state.wounds.explodeSixes}
              onChange={explodeSixes => this.setWounds({ explodeSixes })}
            />
          </div>
          <Log hands={this.state.hands || [[]]} />
        </>
      </div>
    )
  }
}

export default App
