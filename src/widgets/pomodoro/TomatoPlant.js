import LineArt from "../../frontend/components/LineArt"
import TextField from "../../frontend/components/TextField"

export default class TomatoPlant extends PIXI.Container {
  constructor() {
    super()
    this.progress = 0

    this._ground = new LineArt()
    this._ground.addLine(-20, 0, 20, 0)
    this.addChild(this._ground)
    this._trunk = new LineArt()
    this._fruits = []
    this._leaves = []
    this.addChild(this._trunk)
    const trunkSeq = []

    for(let y=0; y < 120; y += 10) {
      const x = (15*(1-y/130))*Math.sin(y*0.1)
      trunkSeq.push(x)
      trunkSeq.push(-y)
      if(y > 5 && y % 10 === 0 && y < 105) {
        const leafIndex = this._leaves.length
        this._leaves[leafIndex] = new PIXI.Graphics()
        this._leaves[leafIndex].beginFill(0xffffff)
        this._leaves[leafIndex].moveTo(-3, 0)
        this._leaves[leafIndex].lineTo(3, 2)
        this._leaves[leafIndex].lineTo(17, 0)
        this._leaves[leafIndex].lineTo(3, -5)
        this._leaves[leafIndex].lineTo(-3, 0)
        this._leaves[leafIndex].x = x
        this._leaves[leafIndex].y = -y - 7
        this._leaves[leafIndex].rotation = (leafIndex % 2 !== 0 ? -0.5 : 3.5)
        this.addChildAt(this._leaves[leafIndex], 0)
        
      }
      if(y > 0 && y <=100 && y % 10 === 0) {
        const branchIndex = Math.floor(y/10)-1
        const branchLen = 13 + (1-y/130)*7
        const side = (branchIndex % 2 === 0) ? -1 : 1

        this._fruits[branchIndex] = new PIXI.Graphics()
        this._fruits[branchIndex].beginFill(0xff0000)
        this._fruits[branchIndex].drawCircle(0, 0, 7)
        this._fruits[branchIndex].endFill()
        this._fruits[branchIndex].lineStyle({width: 1, color: 0xffffff})
        this._fruits[branchIndex].moveTo(0, -7)
        this._fruits[branchIndex].lineTo(4, -3)
        this._fruits[branchIndex].moveTo(0, -7)
        this._fruits[branchIndex].lineTo(-3, -3)
        this._fruits[branchIndex].x = x+side*branchLen*0.5
        this._fruits[branchIndex].y = -y+3
        this.addChild(this._fruits[branchIndex])
      }
    }
    this._trunk.addSequence(trunkSeq)

    this._dayLabel = new TextField('', {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 10,
      fill: '#ff0000',
      stroke: "#ff0000",
      strokeThickness: 1.5,
      align: 'center',
    });
    this.addChild(this._dayLabel)
    this._dayLabel.y = 10
    this._valueLabel = new TextField(``, {
      fontFamily: 'MajorMonoDisplay-Regular',
      fontSize: 14,
      fill: '#ffffff',
      stroke: "#ffffff",
      strokeThickness: 0.5,
      align: 'center',
    });
    this.addChild(this._valueLabel)
    this._valueLabel.y = 25
  }

  get label() {
    return this._dayLabel.text
  }

  set label(v) {
    this._dayLabel.text = v
  }

  render(renderer) {
    this._ground.progress = this.progress
    this._dayLabel.progress = this.progress
    this._valueLabel.progress = this.progress
    this._valueLabel.text = this.value
    this._trunk.progress = this.progress * Math.min(1, (this.value+1)/11)
    for(let i=0; i < this._fruits.length; i++) {
      this._fruits[i].scale.set(Math.max(0, Math.min(1, (this.value*this.progress - i)/0.8)))
    }
    for(let i=0; i < this._leaves.length; i++) {
      this._leaves[i].scale.set(Math.max(0, Math.min(1, (this.value*this.progress - i)/0.8)))
    }
    super.render(renderer)
  }
}