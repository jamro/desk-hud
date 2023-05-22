export default class ArchText extends PIXI.Container {

  constructor() {
    super()
    this._progress = 0
    this._size = 1
    this._text = ""
    this._fontSize = 10
    this._chars = []
    this._radius = 100
    this._alignOffset = 0.5
    this._positionOffset = 0
    this._updated = true
  }

  set progress(v) {
    this._updated = this._updated || (this._progress !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._progress = v
  }

  get progress() {
    return this._progress
  }

  set size(v) {
    this._updated = this._updated || (this._size !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._size = v
  }

  get size() {
    return this._size
  }

  set text(v) {
    this._updated = this._updated || (this._text !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._text = v
  }

  get text() {
    return this._text
  }

  set fontSize(v) {
    this._updated = this._updated || (this._fontSize !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._fontSize = v
  }

  get fontSize() {
    return this._fontSize
  }

  set radius(v) {
    this._updated = this._updated || (this._radius !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._radius = v
  }

  get radius() {
    return this._radius
  }

  set alignOffset(v) {
    this._updated = this._updated || (this._alignOffset !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._alignOffset = v
  }

  get alignOffset() {
    return this._alignOffset
  }

  set positionOffset(v) {
    this._updated = this._updated || (this._positionOffset !== v)
    if(this._updated) {
      this.cacheAsBitmap = false
    }
    this._positionOffset = v
  }

  get positionOffset() {
    return this._positionOffset
  }
  
  get startAngleRange() {
    const linearSpacing = this.fontSize*0.8
    const angularSpacing = Math.atan2(linearSpacing, this.radius)
    const startAngle = ((this._chars.length-1) * angularSpacing)*this.alignOffset+this.positionOffset
    return [
      -startAngle,
      -startAngle + angularSpacing*this.text.length-angularSpacing
    ]
  }

  render(r) {
    super.render(r)
    if(!this._updated) {
      return
    }    

    while(this._chars.length > this.text.length) {
      this.removeChild(this._chars.pop())
    }
    while(this._chars.length < this.text.length) {
      const char = new PIXI.Text('X', {
        fontFamily: 'MajorMonoDisplay-Regular',
        fontSize: this._fontSize,
        fill: '#ffffff',
        stroke: "#ffffff",
        strokeThickness: 0.5,
        align: 'center',
      });
      char.anchor.set(0.5)
      this._chars.push(char)
      this.addChild(char)
    }

    const linearSpacing = this.fontSize*0.8
    const angularSpacing = Math.atan2(linearSpacing, this.radius)
    const startAngle = ((this._chars.length-1) * angularSpacing)*this.alignOffset+this.positionOffset

    for(let i=0; i < this._chars.length; i++) {
      this._chars[i].text = this.text[i]
      this._chars[i].style.fontSize = this.fontSize
      this._chars[i].x = this.radius * Math.sin(angularSpacing*i-startAngle)
      this._chars[i].y = -this.radius * Math.cos(angularSpacing*i-startAngle)
      this._chars[i].rotation = Math.atan2(this._chars[i].y, this._chars[i].x) + Math.PI/2
      this._chars[i].visible = ((i/this._chars.length) < this.progress)
    }
    this._updated = false
  }

}