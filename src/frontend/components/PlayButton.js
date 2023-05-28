import Button from "./Button"

export default class PlayButton extends Button {

  constructor() {
    super()
    this._mode = 'stop'

    this._stopIcon = new PIXI.Graphics()
    this._stopIcon.beginFill(0xff0000)
    this._stopIcon.moveTo(-8, -8)
    this._stopIcon.lineTo(8, -8)
    this._stopIcon.lineTo(8, 8)
    this._stopIcon.lineTo(-8, 8)
    this._stopIcon.lineTo(-8, -8)
    this.addChild(this._stopIcon)

    this._playIcon = new PIXI.Graphics()
    this._playIcon.beginFill(0xffffff)
    this._playIcon.moveTo(-5, -10)
    this._playIcon.lineTo(11, 0)
    this._playIcon.lineTo(-5, 10)
    this._playIcon.lineTo(-5, -10)
    this.addChild(this._playIcon)

    this.on('pointertap', (e) => {
      e.stopPropagation();
      if(this.mode === 'stop') {
        this.mode = 'play'
        this.emit('play')
      } else {
        this.mode = 'stop'
        this.emit('stop')
      }
    })
  }

  set mode(m) {
    if(m !== this._mode) {
      this._blink = true
    }
    this._mode = m
  }

  get mode() {
    return this._mode
  }

  render(renderer) {
    super.render(renderer)
    this._playIcon.visible  = (this.mode === 'stop')
    this._stopIcon.visible  = (this.mode === 'play')
  }



}