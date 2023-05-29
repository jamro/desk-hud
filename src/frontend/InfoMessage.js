
const CHARS='qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'

export default class InfoMessage extends PIXI.Container {
  constructor() {
    super()
    this._label = new PIXI.Text('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 15,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'center',
    });
    this._label.anchor.set(0, 0.5)
    this.addChild(this._label)
    this._text = ''
    this._clearTime = 0
  }

  set text(txt) {
    this._text = String(txt)
    this._clearTime = 100
  }

  render(renderer) {
    super.render(renderer)
    let labelText = this._label.text

    if(this._text === labelText) {
      if(this._clearTime > 0) {
        this._clearTime--
        return
      } else {
        this._text = ''
      }
    }

    const nextChar = (c, t) => {
      const MIN = 32
      const MAX = 126
      let targetCode = String(t).charCodeAt(0)
      let currentCode = String(c).charCodeAt(0)
      let distance = targetCode - currentCode
      let direction = distance > 0 ? +1 : -1
      distance = Math.abs(distance)
      direction *= (distance > 20) ? 10 : 1

      let nextCode = currentCode + direction
      if(nextCode > MAX) {
        nextCode = MIN
      }
      if(nextCode < MIN) {
        nextCode = MAX
      }
      return String.fromCharCode(nextCode)
    }


    if(this._text.length > this._label.text.length) {
      labelText += CHARS[Math.floor(Math.random()*CHARS.length)]
    } else if(this._text.length < labelText.length) {
      labelText = labelText.substring(0, this._label.text.length-1)
    }

    labelText = labelText.split('')
    for(let i=0; i < labelText.length; i++) {
      if(labelText[i] !== this._text[i]) {
        labelText[i] = nextChar(labelText[i], this._text[i])
      }
    }


    this._label.text = labelText.join('')


  }
}