export default class TextField extends PIXI.Text {

  constructor (txt, style) {
    super('', style)
    this._progress = 0
    this._origText = String(txt)
    this.anchor.set(0.5)
    this._changed = true
  }

  set progress(v) {
    this._changed = (this._changed || this._progress !== v)
    this._progress = v
  }

  get progress() {
    return this._progress
  }

  set text(v) {
    const newText = String(v)
    this._changed = (this._changed || this._origText !== newText)
    this._origText = newText
  }

  get text() {
    return this._origText
  }

  render(renderer) {
    super.render(renderer)
    if(!this._changed) {
      return
    }

    super.text = this._origText.substr(0, Math.round(this._progress*this._origText.length))
    this._changed = false
  }
}