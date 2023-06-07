import Battery from "../../components/Battery"
import LineArt from "../../components/LineArt"
import RoomPreview from "../../components/RoomPreview"
import TextField from "../../components/TextField"
import DragButton from "./DragButton"

export default class CoversScreen extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0

    this.covers = null
    this.doors = null

    this._roomView = new RoomPreview()
    this._roomView.size = 3.4
    this._roomView.y = -30
    this.coversBattery = null
    this.doorsBattery = null
    this.addChild(this._roomView)

    this._dragButtons = [
      {x: -234, yMin: -68, yMax: 78},
      {x: -173, yMin: -58, yMax: 52},
      {x: -55, yMin: -50, yMax: 38},
      {x: 175, yMin: -58, yMax: 53},
      {x: 230, yMin: -65, yMax: 76},
    ].map(({x, yMin, yMax}, i) => {
      const btn = new DragButton(yMin, yMax)
      btn.x = x
      this.addChild(btn)
      btn.on('posChange', (newPos) => {
        this.emit('coverChange', `cover${i+1}`, newPos, i)
      })
      return btn
    })

    this._coverBatteryIcons = Array(5).fill(1).map((_, i) => {
      const bat = new Battery()
      bat.x = 30
      bat.y = -50 + 18*i
      this.addChild(bat)
      return bat
    })

    this._doorBatteryIcons = Array(3).fill(1).map((_, i) => {
      const bat = new Battery()
      bat.x = 90
      bat.y = -50 + 18*i
      this.addChild(bat)
      return bat
    })

    this._batteryLabel = new TextField('Cover     Door', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 8,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 0.5,
      align: 'left',
    })
    this._batteryLabel.x = 58
    this._batteryLabel.y = -70
    this.addChild(this._batteryLabel)

    this._lines = new LineArt()
    this.addChild(this._lines)
    this._lines.addSequence([
      10, -50,
      5, -50,
      5, -80,
      -138, -80,
      -235, -100,
      -235, -90,
    ], 1, 0x888888)
    this._lines.addSequence([
      10, -32,
      0, -32,
      0, -75,
      -138, -75,
      -175, -83,
      -175, -78,
    ], 1, 0x888888)
    this._lines.addSequence([
      10, -14,
      -20, -14
    ], 1, 0x888888)
    this._lines.addSequence([
      10, 4,
      5, 4,
      5, 35,
      8, 55,
      170, 55
    ], 1, 0x888888)
    this._lines.addSequence([
      10, 22,
      -5, 22,
      -5, 35,
      -11, 80,
      228, 80
    ], 1, 0x888888)

   
  }

  render(renderer) {
    this._roomView.progress = this.progress

    if(this.covers) {
      this._roomView.covers = this.covers
    }
    if(this.doors) {
      this._roomView.doors = this.doors
    }

    if(this.covers) {
      for(let i=0; i < this._dragButtons.length && i < this.covers.length; i++) {
        this._dragButtons[i].alpha = this.progress
        if(!this._dragButtons[i].dragging) {
          this._dragButtons[i].pos = this.covers[i]
        }
        this._dragButtons[i].visible = !this.doors[i]
      }
    } else {
      for(let i=0; i < this._dragButtons.length; i++) {
        this._dragButtons[i].visible = false
      }
    }


    for(let i=0; i < this._coverBatteryIcons.length; i++) {
      this._coverBatteryIcons[i].progress = this.progress
      if(this.coversBattery) {
        this._coverBatteryIcons[i].value = this.coversBattery[i]
      }
    }
    for(let i=0; i < this._doorBatteryIcons.length; i++) {
      this._doorBatteryIcons[i].progress = this.progress
      if(this.doorsBattery) {
        this._doorBatteryIcons[i].value = this.doorsBattery[i]
      }
    }
    this._batteryLabel.progress = this.progress
    this._lines.progress = this.progress
    super.render(renderer)
  }
}