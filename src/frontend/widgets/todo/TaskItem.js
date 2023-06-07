import TextField from "../../components/TextField";

export default class TaskItem extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0
    this.id = ''
    this._completed = false

    this._titleLabel =  new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 11,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'left',
    });
    this._titleLabel.anchor.set(0, 0.5)
    this.addChild(this._titleLabel)
  }

  get title() {
    return this._titleLabel.text
  }

  set title(v) {
    this._titleLabel.text = v
  }

  get completed() {
    return this._completed
  }

  set completed(v) {
    this._completed = v
    this._titleLabel.alpha = v ? 0.3 : 1
  }

  render(renderer) {
    this._titleLabel.progress = this.progress
    super.render(renderer)
  }
}