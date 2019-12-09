import React from 'react'
import './App.css'
import { getResult } from './HitsAndWounds'

const Table = ({ hand }) => (
  <div className="result-table">
    <div className="head">&lt; 1</div>
    <div className="head">1</div>
    <div className="head">2</div>
    <div className="head">3</div>
    <div className="head">4</div>
    <div className="head">5</div>
    <div className="head">6</div>
    <div className="head">&gt; 6</div>
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

const Total = ({ hand }) => <div className="total">{hand.length}</div>

const Check = ({ text, checked, onChange }) => (
  <div className="check">
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
    />
    {text ? <div>{text}</div> : ''}
  </div>
)

const Slider = ({ text, value, min, max, onChange }) => (
  <>
    <div className="slider-label">{text}:</div>
    <div className="slider-value">{value}</div>
    <button
      className="slider-button slider-decrement"
      onClick={_ => onChange(value - 1)}
    >
      -
    </button>
    <input
      className="slider-range"
      type="range"
      onChange={e => onChange(Number(e.target.value))}
      {...{ value, min, max }}
    />
    <button
      className="slider-button slider-increment"
      onClick={_ => onChange(value + 1)}
    >
      +
    </button>
  </>
)

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      hands: [[], []],
      count: 20,
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
  }

  roll = () =>
    this.setState({
      hands: getResult({
        count: this.state.count,
        bs: this.state.bs,
        hitmod: this.state.hitmod,
        rerollHitsOfOne: this.state.rerollHitsOfOne,
        rerollHitFails: this.state.rerollHitFails,
        explodeHits: this.state.explodeHits,
        doWounds: this.state.doWounds,
        s: this.state.s,
        t: this.state.t,
        woundmod: this.state.woundmod,
        rerollWoundsOfOne: this.state.rerollWoundsOfOne,
        rerollWoundFails: this.state.rerollWoundFails,
        explodeWounds: this.state.explodeWounds
      })
    })

  render() {
    return (
      <div className="app">
        <Table hand={this.state.hands.slice(-2)[0]} />
        <Total hand={this.state.hands.slice(-1)[0]} />
        {/* HITS */}
        <button className="roll" onClick={this.roll}>
          ROLL
        </button>
        <h3 className="hit-title">Hits:</h3>
        <Slider
          text="Count"
          value={this.state.count}
          min={1}
          max={100}
          onChange={count => this.setState({ count })}
        />
        <Slider
          text="BS"
          value={this.state.bs}
          min={1}
          max={6}
          onChange={bs => this.setState({ bs })}
        />
        <Slider
          text="Modifier"
          value={this.state.hitmod}
          min={-3}
          max={3}
          onChange={hitmod => this.setState({ hitmod })}
        />
        <div className="check-row">
          <Check
            text="Reroll Ones"
            checked={this.state.rerollHitsOfOne}
            onChange={rerollHitsOfOne => this.setState({ rerollHitsOfOne })}
          />
          <Check
            text="Reroll Fails"
            checked={this.state.rerollHitFails}
            onChange={rerollHitFails => this.setState({ rerollHitFails })}
          />
          <Check
            text="Explode on 6"
            checked={this.state.explodeHits}
            onChange={explodeHits => this.setState({ explodeHits })}
          />
        </div>
        {/* WOUNDS */}
        <h3 className="wound-title">
          Wounds:
          <Check
            text=""
            checked={this.state.doWounds}
            onChange={doWounds => this.setState({ doWounds })}
          />
        </h3>
        <Slider
          text="S"
          value={this.state.s}
          min={0}
          max={10}
          onChange={s => this.setState({ s })}
        />
        <Slider
          text="T"
          value={this.state.t}
          min={0}
          max={10}
          onChange={t => this.setState({ t })}
        />
        <Slider
          text="Modifier"
          value={this.state.woundmod}
          min={0}
          max={10}
          onChange={woundmod => this.setState({ woundmod })}
        />
        <div className="check-row">
          <Check
            text="Reroll Ones"
            checked={this.state.rerollWoundsOfOne}
            onChange={rerollWoundsOfOne => this.setState({ rerollWoundsOfOne })}
          />
          <Check
            text="Reroll Fails"
            checked={this.state.rerollWoundFails}
            onChange={rerollWoundFails => this.setState({ rerollWoundFails })}
          />
          <Check
            text="Explode on 6"
            checked={this.state.explodeWounds}
            onChange={explodeWounds => this.setState({ explodeWounds })}
          />
        </div>
      </div>
    )
  }
}

export default App
