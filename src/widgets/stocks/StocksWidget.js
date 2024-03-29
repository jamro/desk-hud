import Widget from '../../frontend/Widget.js'
import Icon from '../../frontend/components/Icon.js'
import TextField from '../../frontend/components/TextField.js'
import ScaleCircle from '../../frontend/circles/ScaleCircle.js'
import StocksHistoryScreen from './StocksHistoryScreen.js'

export default class StocksWidget extends Widget {
  constructor() {
    super('stocks', "Stocks")
    this.initState({
      symbol: '',
      current: null,
      past: null,
      change: 0,
      history: []
    })

    this.main.title = "Stock Market"
    this._historyScreen = new StocksHistoryScreen()
    this.main.getPage(0).addChild(this._historyScreen)

    this._trendIcon = new Icon()
    this.addChild(this._trendIcon)

    this._symbolLabel = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 25,
      fill: '#ffffff',
      align: 'center',
    })
    this.addChild(this._symbolLabel)

    this._priceLabel = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 18,
      fill: '#ffffff',
      align: 'center',
      stroke: "#ffffff",
      strokeThickness: 0.5,
    })
    this.addChild(this._priceLabel)

    this.changeScale = new ScaleCircle(-10, 10, '%', 11, Math.PI*1.5)
    this.changeScale.rotation = 0.25*Math.PI
    this.addChild(this.changeScale)
  }

  msg2state(msg) {
    const current = msg.intraDay.data[0].price;
    const past = msg.intraDay.data[0].day_open;
    
    return {
      symbol: msg.symbol,
      current,
      past,
      change: Number((current/past-1).toFixed(3)),
      history: msg.daily.data.map(d => d.close).reverse()
    }
  }

  render(renderer) {
    if(this.state.change > 0) {
      this._trendIcon.code = 0xe5d8
      this._trendIcon.color = 0xffffff
    } else if(this.state.change < 0) {
      this._trendIcon.code = 0xe5db
      this._trendIcon.color = 0xff0000
    } else {
      this._trendIcon.code = 0xe15b
      this._trendIcon.color = 0xffffff
    }

    this._trendIcon.scale.set(this.size)
    this._trendIcon.alpha = this.progress
    this._symbolLabel.progress = this.progress * this.dataLoadProgress
    this._symbolLabel.text = this.state.symbol.toLowerCase()
    this._symbolLabel.style.fontSize = 7 + 11*this.size
    if(this.state.current) {
      this._priceLabel.text = this.state.current.toFixed(2)
    }
    this._symbolLabel.y = -50*this.size
    this._priceLabel.progress = this.progress * this.dataLoadProgress
    this._priceLabel.y = 50*this.size
    this._priceLabel.style.fontSize = 7 + 8*this.size
    this.changeScale.progress = this.progress
    this.changeScale.size = this.size
    this.changeScale.value = 100*this.state.change
    this.changeScale.valueMin = 0
    this.changeScale.valueMax = 0
    if(this.state.change > 0) {
      this.changeScale.valueMax = 100*this.state.change
    } else {
      this.changeScale.valueMin = 100*this.state.change
    }
    this.changeScale.visible = this.size == 1
    this._historyScreen.progress = this.main.progress * this.dataLoadProgress
    this._historyScreen.data = this.state.history
    super.render(renderer)
  }
}