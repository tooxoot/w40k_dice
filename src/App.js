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
      aos: localStorage.getItem('variant') === 'aos',
      hasUpdate: false
    }

    this.ref = React.createRef()

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.onmessage = () => {
        if (event.data === 'update-available') {
          this.setState({ hasUpdate: Boolean(event.data) })
        }
      }
    }
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
        <div className='bar'>
          <button
            className={`40k ${this.state.aos ? 'unselected' : ''}`}
            onClick={() => {
              this.setState({ aos: false })
              localStorage.setItem('variant', '40k')
            }}
          >
            <svg viewBox='0 630 2000 750' height='20px'>
              <path d='M830.805,913.588l-8.501,5.222l4.692,50.297c-16.745,18.744-35.845,39.556-52.76,58.148l0.662-93.712l-8.589,1.971    l-30.476,123.318l-69.634,40.684l52.472-165.183l-8.079-1.649l-90.259,179.566l-73.196-10.757l110.747-182.602l-10.362-5.948    l-146.96,173.869c-22.97-12.667-44.468-24.215-67.859-37.114l185.495-174.997l-9.156-14.116l-221.883,156.436l-77.28-57.082    L592.1,819.828l-4.727-17.602l-319.026,120.89l-72.116-68.413l387.614-96.748l3.34-19.125l-431.134,75.852l-65.132-71.629    l507.897-43.576l11.365-16.342l-548.898,26.62L1,630h761.297c0,4.45-1.357,9.642-0.197,13.455    C579.5,735.5,667,951,906.503,804.805l48.122,49.445l-82.063,208.002l-66.343-49.21c33.114-26.709,71.114-82.042,79.685-114.409    c2.194-8.286,0.276-12.107-6.568-12.73c-6.692-0.609-13.336,5.846-9.787,12.987c2.001,4.016,6.189,6.93,6.189,6.93    c-7.732,9.551-26.502,34.554-34.545,45.44L830.805,913.588z' />
              <path d='M1105.749,1216.276c-5.182,5.21-13.443,14.096-18.986,20.052c-11.495-25.948-22.211-52.254-33.762-78.329    c-1.864,1.504-4.885,5.101-6,6l30.308,80.01c-6.653,6.388-17.407,17.785-24.445,25.208c-10.01-28.807-18.991-58.806-28.864-87.218    l-6,5l24.805,93c-13.393,14.652-28.898,29.229-42.805,44.178L958.5,1280l27.5-93l-6-5c-9.986,28.848-20.409,58.096-30.672,87.745    l-21.826-24.065L958,1164l-6-6c-11.489,25.928-21.076,51.814-32.831,78.343l-19.645-21.39    c9.101-23.009,22.032-52.083,31.476-74.953l-50.801-58L1000,762.207L1123.904,1082L1073,1140L1105.749,1216.276z' />
              <polygon points='1114.248,1283.893 1092.333,1293 1099.209,1277.019 1085,1262.5 1110,1259.333 1135.827,1231.503     1128.333,1218.667 1131.732,1214.805 1085.056,1142.876 1121.228,1103.756 1169.325,1195.875 1176,1192 1183.871,1204.539     1208.667,1196.667 1215.5,1181.5 1226.314,1191.983 1249.404,1194.308 1232.312,1210.026 1229.646,1275.346 1210.39,1215.839     1180.469,1226.391 1194.598,1250.426 1206.5,1248 1202.333,1260.667 1228.988,1307.674 1233,1354.184 1220.943,1339.715     1172.132,1358.238 1201.465,1318.756 1178.792,1275.544 1164,1277.542 1172,1263.667 1159.23,1237.222 1132.419,1269.518     1163.535,1298   ' />
              <path d='M789.492,1329.581l26,26.419c-12.165-5.26-41.766-11.248-52.847-16.362v-31.307l53.019-75.506L793.5,1229.5    l-30.855,54.044l10.753-89.286l52.649,15.91l57.378-105.505l36.316,39.628l-63.554,80.857L900.25,1266l-85.758,52.331L861,1268    l-23-24.25L789.492,1329.581z' />
              <path d='M1009.553,758.954c18.057-13.335,35.766-26.463,53.581-39.444c1.1-0.801,3.175-0.925,4.574-0.545    c7.566,2.058,15.123,4.196,22.532,6.744c1.596,0.549,3.349,2.736,3.71,4.447c2.885,13.688,5.538,27.427,8.017,41.195    c0.347,1.927,0.083,4.783-1.119,6.046c-19.926,20.943-40.048,41.7-60.803,63.199    C1029.786,813.127,1019.768,786.305,1009.553,758.954z' />
              <path d='M900.385,779.173c-2.128-2.18-2.773-4.141-2.128-7.253c2.771-13.371,5.29-26.798,7.643-40.25    c0.578-3.305,1.797-5.021,5.18-5.889c6.933-1.778,13.681-4.285,20.623-6.019c1.954-0.488,4.797,0.001,6.421,1.17    c16.524,11.893,32.922,23.963,49.208,36.181c1.345,1.009,2.701,3.855,2.218,5.179c0,0-19.194,51.801-28.878,77.689    L900.385,779.173z' />
              <path d='M1110.703,767.741c-2.909-14.728-5.794-28.743-8.375-42.813c-0.667-3.639-2.149-5.474-5.811-6.576    c-23.345-7.024-46.585-14.397-69.93-21.425c-3.221-0.97-8.337-3.227-4.779-4.628c4.358-1.716,64.432-0.915,64.432-0.915    c4.234,0.101,7.415-0.864,10.357-4.117c1.367-1.511,4.379-2.427,6.508-2.216c23.293,2.302,46.551,4.949,69.838,7.313    c3.59,0.364,5.322,1.64,6.191,5.256c2.712,11.29,2.849,11.242-5.994,18.569L1110.703,767.741z' />
              <path d='M820.834,710.975c-5.455-5.085-1.397-11.288,1.189-16.419c1.529-3.034,3.008-2.954,5.402-2.954    c49.478,0.009,98.955-0.016,148.433,0.099c1.35,0.003,3.847,0.772,4.046,2.271c0.238,1.8-2.13,2.917-3.51,3.335    c-23.992,7.275-47.985,14.557-72.11,21.37c-4.44,1.254-5.886,3.418-6.602,7.482l-8.53,41.919L820.834,710.975z M864.963,724.215    c4.548,0.082,8.507-3.645,8.737-8.224c0.238-4.737-3.769-8.812-8.626-8.773c-4.666,0.037-8.459,3.818-8.457,8.428    C856.621,720.226,860.426,724.133,864.963,724.215z' />
              <path d='M1173.579,723.488c1.612-1.266,4.518-2.362,6.238-1.782c15.177,5.113,30.221,10.623,46.035,16.276    c-7.459,19.759-14.78,39.152-22.526,59.671c-3.961-9.943-7.589-18.58-10.808-27.366c-1.265-3.453-3.353-5.037-6.778-5.896    c-15.154-3.8-30.259-7.793-46.379-11.975L1173.579,723.488z' />
              <path d='M860.148,753.554c-15.615,4.066-30.438,8.057-45.342,11.72c-4.054,0.997-6.257,2.942-7.68,6.914    c-3.092,8.626-6.755,17.048-10.524,26.396c-7.652-20.229-14.947-39.517-22.457-59.373l47.934-18.578L860.148,753.554z' />
              <path d='M1168.195,913.588l8.501,5.222l-4.692,50.297c16.745,18.744,35.844,39.556,52.76,58.148l-0.662-93.712l8.589,1.971    l30.475,123.318l69.634,40.684l-52.472-165.183l8.079-1.649l90.259,179.566l73.196-10.757l-110.747-182.602l10.362-5.948    l146.96,173.869c22.97-12.667,44.468-24.215,67.859-37.114l-185.495-174.997l9.156-14.116l221.884,156.436l77.28-57.082    L1406.9,819.828l4.727-17.602l319.026,120.89l72.116-68.413l-387.614-96.748l-3.339-19.125l431.134,75.852l65.132-71.629    l-507.897-43.576l-11.365-16.342l548.898,26.62L1998,630h-761.297c0,4.45,1.357,9.642,0.197,13.455    C1419.5,735.5,1332,951,1092.498,804.805l-48.123,49.445l82.063,208.002l66.343-49.21    c-33.115-26.709-71.115-82.042-79.685-114.409c-2.194-8.286-0.276-12.107,6.568-12.73c6.692-0.609,13.336,5.846,9.787,12.987    c-2.001,4.016-6.189,6.93-6.189,6.93c7.732,9.551,26.502,34.554,34.545,45.44L1168.195,913.588z' />
            </svg>
          </button>
          <button
            className={`aos ${this.state.aos ? '' : 'unselected'}`}
            onClick={() => {
              this.setState({ aos: true })
              localStorage.setItem('variant', 'aos')
            }}
          >
            <svg height='20px' viewBox='0 0 230 115 '>
              <g transform='translate(-85,-35)'>
                <path d='M 150 150 a 50 50 0 0 1 100 0 l 10 0 a 60 60 0 0 0 -120 0 Z' />
                <path d='M 145 150 l -60 0 60 -10' />
                <path d='M 255 150 l 60 0 -60 -10' />
                <path d='M 200 95 l 10 0 -10 -60 -10 60' />

                <path
                  transform='rotate(-60,200,150) translate(200,95) scale(-0.35, 0.35) '
                  d='M 0 0 l -20 0 0 -70 20 0 -25 -70 60 90 -30 0 20 50 Z'
                />
                <path
                  transform='rotate(-30,200,150) translate(200,95) scale(-0.35, 0.35) '
                  d='M 0 0 l -20 0 0 -70 20 0 -25 -70 60 90 -30 0 20 50 Z'
                />

                <path
                  transform='rotate(60,200,150) translate(200,95) scale(0.35, 0.35) '
                  d='M 0 0 l -20 0 0 -70 20 0 -25 -70 60 90 -30 0 20 50 Z'
                />
                <path
                  transform='rotate(30,200,150) translate(200,95) scale(0.35, 0.35) '
                  d='M 0 0 l -20 0 0 -70 20 0 -25 -70 60 90 -30 0 20 50 Z'
                />
              </g>
            </svg>
          </button>
          {this.state.hasUpdate ? (
            <button className='update' onClick={() => location.reload(false)}>
              <span>!</span>
              <svg viewBox='0 0 489.7 489.7' width='20' height='20'>
                <path d='m469 227.77c-11.4 0-20.8 8.3-20.8 19.8-1 74.9-44.2 142.6-110.3 178.9-99.6 54.7-216 5.6-260.6-61l62.9 13.1c10.4 2.1 21.8-4.2 23.9-15.6 2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1 3.5-23.9 22.9l15.6 124.8c1 10.4 9.4 17.7 19.8 17.7 15.5 0 21.8-11.4 20.8-22.9l-7.3-60.9c101.1 121.3 229.4 104.4 306.8 69.3 80.1-42.7 131.1-124.8 132.1-215.4 0.1-11.4-8.3-20.8-19.7-20.8z' />
                <path d='m20.599 261.87c11.4 0 20.8-8.3 20.8-19.8 1-74.9 44.2-142.6 110.3-178.9 99.6-54.7 216-5.6 260.6 61l-62.9-13.1c-10.4-2.1-21.8 4.2-23.9 15.6-2.1 10.4 4.2 21.8 15.6 23.9l123.8 26c7.2 1.7 26.1-3.5 23.9-22.9l-15.6-124.8c-1-10.4-9.4-17.7-19.8-17.7-15.5 0-21.8 11.4-20.8 22.9l7.2 60.9c-101.1-121.2-229.4-104.4-306.8-69.2-80.1 42.6-131.1 124.8-132.2 215.3 0 11.5 8.4 20.8 19.8 20.8z' />
              </svg>
            </button>
          ) : (
            ''
          )}
        </div>
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
            value={this.state.hits.bs}
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
