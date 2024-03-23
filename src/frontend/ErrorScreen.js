import TextField from "./components/TextField"

export default class ErrorScreen extends PIXI.Container {

  constructor() {
    super()
    this.progress = 0
    this._titleField = new TextField("oops! something went wrong!", {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 22,
      fill: '#ff0000',
      align: 'center',
    })
    this._titleField.position.set(0, -40)
    this.addChild(this._titleField)

    this._messageField = new TextField("an unexpected error occurred", {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 15,
      fill: '#ffffff',
      align: 'center',
    })
    this._messageField.position.set(0, 0)
    this.addChild(this._messageField)
  }

  get message() {
    return this._messageField.text
  }

  set message(value) {
    this._messageField.text = value || "an unexpected error occurred"
  }

  render(renderer) {
    super.render(renderer)
    this._titleField.progress = this.progress
    this._messageField.progress = this.progress
  }

}