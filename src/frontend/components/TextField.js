export default class TextField extends PIXI.Text {

  constructor (txt, style) {
    super('', style)
    this._progress = 0
    this._origText = txt
    this.anchor.set(0.5)
  }

  set progress(v) {
    this._progress = v
  }

  get progress() {
    return this._progress
  }

  set text(v) {
    this._origText = String(v)
  }

  get text() {
    return this._origText
  }

  render(renderer) {
    super.render(renderer)

    super.text = this._origText.substr(0, Math.round(this._progress*this._origText.length))
  }
}