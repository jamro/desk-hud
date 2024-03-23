import ErrorScreen from './ErrorScreen.js'
import DiamondButton from './components/DiamondButton.js'
import LineArt from './components/LineArt.js'
import TextField from './components/TextField.js'

export default class MainScreen extends PIXI.Container {

  constructor() {
    super()
    this._error - null
    this.progress = 0
    this.statusLeftText = null
    this.statusRightText = null

    this._frame = new LineArt()
    this._frame.addSequence([
      295, -90,
      295, 120,
      -295, 120,
      -295, -90,
      295, -90
    ], 1, 0xffffff, 0.1)

    this._frame.addLine(90, -120, -90, -120, 3, 0xffffff, 1, 0.5)
    this._frame.addSequence([
      455, -110,
      455, -120,
      280, -120,
      280, -100,
      300, -80,
      260, -80,
      245, -95,
      150, -95,
      125, -120,

      -125, -120,
      -150, -95,
      -245, -95,
      -260, -80,
      -300, -80,
      -280, -100,
      -280, -120,
    ])

    this._frame.addSequence([
      330, 0,
      300, 0,
      300, 110+10,
      260+5, 110+10,
      245+5, 95+10,
      150, 95+10,
      125, 120+10,

      -125+150, 120+10,
      -150+150, 95+10,
      -245, 95+10,
      -260, 80+10,
      -300, 80+10,
      -300, 100+15,
      -280, 100+15,
    ])

    this._frame.addSequence([
      125, -120,
      100, -95,
      90, -95,
      85, -100,

      -85, -100,
      -90, -95,
      -100, -95,
      -125, -120,
    ], 1, 0xffffff, 1, 0.4, 1)

    this._frame.addLine(-300, -60, -300, 60, 1, 0xffffff, 1, 0.5)

    this._frame.addSequence([
      330, -20,
      300, -20,
      300, -60, 
      350, -60, 
    ], 1, 0xffffff, 1, 0, 0.5)
    
    this.addChild(this._frame)

    this._errorScreen = new ErrorScreen()
    this.addChild(this._errorScreen )

    this._titleLabel = new TextField('>> widget <<', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize:11,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'center',
    });
    this._titleLabel.y = -111
    this.addChild(this._titleLabel)
    
    this._statusLeftLabel = new TextField('1234567890', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._statusLeftLabel.alpha = 0.4
    this._statusLeftLabel.x = -210
    this._statusLeftLabel.y = -111
    this.addChild(this._statusLeftLabel)

    this._statusRightLabel = new TextField('1234567890', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this._statusRightLabel.alpha = 0.4
    this._statusRightLabel.x = 210
    this._statusRightLabel.y = -111
    this.addChild(this._statusRightLabel)

    this._tabButtons = [];
    this._tabButtons[0] = new DiamondButton()
    this._tabButtons[0].x = 200
    this._tabButtons[0].y = 130
    this._tabButtons[1] = new DiamondButton()
    this._tabButtons[1].x = 75
    this._tabButtons[1].y = 103
    this._tabButtons[2] = new DiamondButton()
    this._tabButtons[2].x = -50
    this._tabButtons[2].y = 130
    this._tabButtons.forEach((button, i) => {
      this.addChild(button)
      button.on('activate', () => this.activateTab(i))
      button.visible = false
    })
    
    this._pages = [
      new PIXI.Container(),
      new PIXI.Container(),
      new PIXI.Container(),
    ]
    this._pages.forEach(p => p.y = 10)
    this._page = null
    this.activateTab(0)
  }

  setCustomErrorScreen(screen) {
    this.removeChild(this._errorScreen)
    this._errorScreen = screen
    this.addChild(this._errorScreen)
  }

  get error() {
    return this._error
  }

  set error(v) {
    this._error = v
    this._errorScreen.message = v
  }

  activateTab(index) {
    this._tabButtons.forEach((t, i) => t.active = (i === index))
    if(this._page) {
      this.removeChild(this._page)
    }
    this._page = this._pages[index]
    this.addChildAt(this._page, 0)
  }

  getPage(i) {
    return this._pages[i]
  }

  getTabButton(i) {
    return this._tabButtons[i]
  }

  get title() {
    return this._titleLabel.text
  }

  set title(v) {
    this._titleLabel.text = v
  }

  render(renderer) {
    super.render(renderer)

    this._frame.progress = this.progress
    this._titleLabel.progress = Math.max(0, 2*this.progress - 0.5)
    this._statusLeftLabel.progress = this.progress
    this._statusRightLabel.progress = this.progress

    this._statusLeftLabel.text = (this.statusLeftText !== null) ? this.statusLeftText : '0x'+(837231*Math.round(performance.now()*1000) % 0xffffffffff).toString(16).padStart(10, 'X')
    this._statusRightLabel.text = (this.statusRightText !== null) ? this.statusRightText : '0x'+(837231*Math.round(performance.now()*1000) % 0xffffffffff).toString(16).padStart(10, 'X')

    this._tabButtons.forEach(t => {
      t.progress = this.progress
    })

    this._pages.forEach(p => {
      p.visible = !this.error
    })
    this._errorScreen.progress = this.progress
    this._errorScreen.visible = this.error
    
  }

}