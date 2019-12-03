/**
 * 画笔
 * @param ctx
 */
export function Pencil(ctx) {
  let tool = this
  this.started = false
  /**
   * mousedown事件
   * @param ev
   */
  this.mousedown = ev => {
    // 开始绘制
    ev.preventDefault()
    ctx.beginPath()
    ctx.moveTo(ev._x, ev._y)
    tool.started = true
  }
  /**
   * 如果已经开始绘制，监听鼠标移动，绘制连线
   * @param ev
   */
  this.mousemove = ev => {
    if (tool.started) {
      ctx.lineTo(ev._x, ev._y)
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 5
      ctx.stroke()
    }
  }
  /**
   * 绘制结束
   * @param ev
   */
  this.mouseup = ev => {
    if (tool.started) {
      tool.mousemove(ev)
      ctx.closePath()
      tool.started = false
    }
  }
}

/**
 * 处理鼠标移动位置相对于画布的位置
 * @param ev
 * @param tool
 */
export function evCanvas(ev, tool) {
  // 将canvasDOM节点的width属性设置为其csswidth属性的两倍
  // 同理将height属性也设置为cssheight属性的两倍
  // 整个 canvas 的坐标系范围就扩大为两倍
  // 所以事件选点的坐标也要相应放大两倍
  const RATE = 2
  if (ev.offsetX || ev.offsetY === 0) {
    ev._x = ev.offsetX * RATE
    ev._y = ev.offsetY * RATE
  }
  if (ev.type === 'mousedown') {
    console.log(ev);
  }
  /**
   * 执行三个事件监听函数 mousedown, mousemove, mouseup
   */
  let func = tool[ev.type]
  if (func) {
    func(ev)
  }
}
