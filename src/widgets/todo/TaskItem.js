import TextField from "../../frontend/components/TextField";
import LineArt from "../../frontend/components/LineArt"

export default class TaskItem extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.id = ''
    this._completed = false
    this._checkProgress = 0
    this._lockTimer = 0

    this._titleLabel =  new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 13,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    });
    this._titleLabel.x = 60
    this._titleLabel.anchor.set(0, 0.5)
    this.addChild(this._titleLabel)

    this._checkBox = new LineArt()
    this._checkBox.x = 20
    this._checkBox.addSequence([
      -15, -15,
      15, -15,
      15, 15,
      -15, 15,
      -15, -15,
    ], 1, 0xffffff, 1, 0, 0.5)
    this._checkBox.addSequence([
      -13, 0,
      -3, 10,
      22, -15
    ], 2, 0xffffff, 1, 0.5, 1)
    this._checkBox.addSequence([
      -13, -5,
      -3, 5,
      22, -20
    ], 3, 0xffffff, 1, 0.5, 1)
    this.addChild(this._checkBox)

    this._clicker = new PIXI.Graphics()
    this._clicker.beginFill(0x000000, 0.00001)
    this._clicker.drawRect(-17, -17, 34, 34)
    this._clicker.x = 20
    this._clicker.interactive = true
    this._clicker.on('pointertap', () => {
      this._lockTimer = 0
      this.completed = !this.completed
      this._lockTimer = 500
      this.emit(this.completed ? 'complete' : 'uncomplete', this.id)
    })
    this.addChild(this._clicker)
  }

  get title() {
    return this._titleLabel.text
  }

  set title(v) {
    this._titleLabel.text = String(v).substring(0, 52)
  }

  get completed() {
    return this._completed
  }

  set completed(v) {
    if(this._lockTimer > 0) return
    this._completed = v
  }

  render(renderer) {
    if(this._lockTimer > 0) {
      this._lockTimer--
    }
    if(this._completed  && this._checkProgress < 1) {
      this._checkProgress += 0.15
    } else if(!this._completed  && this._checkProgress > 0) {
      this._checkProgress -= 0.15
    }
    this._titleLabel.progress = this.progress
    this._checkBox.progress = this.progress * (0.5 + 0.5*this._checkProgress)
    this._clicker.visible = this.progress > 0.5
    this._checkBox.alpha = 1 - 0.5*this._checkProgress 
    this._titleLabel.alpha = 1 - 0.5*this._checkProgress 

    super.render(renderer)
  }
}