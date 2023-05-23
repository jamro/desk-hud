export default class PlayButton extends PIXI.Container {

  constructor() {
    super()

    this._mode = 'stop'
    this._blink = false

    this._clicker = new PIXI.Graphics()
    this._clicker.lineStyle({
      color: 0xcccccc,
      width: 2
    })
    this._clicker.beginFill(0x000000, 0.75)
    this._clicker.drawCircle(0, 0, 30)
    this.addChild(this._clicker)

    this._stopIcon = new PIXI.Graphics()
    this._stopIcon.beginFill(0xff0000)
    this._stopIcon.moveTo(-10, -10)
    this._stopIcon.lineTo(10, -10)
    this._stopIcon.lineTo(10, 10)
    this._stopIcon.lineTo(-10, 10)
    this._stopIcon.lineTo(-10, -10)
    this.addChild(this._stopIcon)

    this._playIcon = new PIXI.Graphics()
    this._playIcon.beginFill(0xffffff)
    this._playIcon.moveTo(-8, -13)
    this._playIcon.lineTo(14, 0)
    this._playIcon.lineTo(-8, 13)
    this._playIcon.lineTo(-8, -13)
    this.addChild(this._playIcon)

    this.interactive = true

    this.on('pointertap', (e) => {
      e.stopPropagation();
      if(this.mode === 'stop') {
        this.mode = 'play'
        this.emit('play')
      } else {
        this.mode = 'stop'
        this.emit('stop')
      }
      this._blink = true
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

    const targetClickerScale = this._blink ? 1.2 : 1
    const clickerScale = this._clicker.scale.x + (targetClickerScale - this._clicker.scale.x )/5
    this._clicker.scale.set(clickerScale)
    if(this._clicker.scale.x >= 1.18) {
      this._blink = false
    }

  }



}