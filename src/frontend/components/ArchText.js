export default class ArchText extends PIXI.Container {

  constructor(fontSize=10) {
    super()
    this.progress = 0
    this.size = 1
    this.text = ""
    this._fontSize = fontSize
    this._chars = []
    this.fontSize=10
    this.radius = 100
    this.alignOffset = 0.5
    this.positionOffset = 0
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
  }

}