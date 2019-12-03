/**
 * Websocket封装类，带心跳检测机制
 * Example:
 *  const websocket = new WebSocketClass('websocket_address', callbackFunc, 'websocketName')
 *  websocket.connect()
 */

class WebSocketClass {
  /**
   * @description: 初始化实例属性，保存参数
   * @param {String} url ws的接口
   * @param {Function} msgCallback 服务器信息的回调传数据给函数
   * @param {String} name 可选值 用于区分ws，用于debugger
   */
  constructor(url, msgCallback, name = 'default') {
    this.url = url
    this.msgCallback = msgCallback
    this.name = name
    this.ws = null  // websocket对象
    this.status = null // websocket是否关闭
  }
  
  /**
   * @description: 初始化 连接websocket或重连webSocket时调用
   * @param {*} data 可选值 要传的数据
   */
  connect(data) {
    // 新建 WebSocket 实例
    this.ws = new WebSocket(this.url)
    this.ws.onopen = event => {
      // 连接ws成功回调
      this.status = 'open'
      console.log(`%c${this.name} Websocket is connected...`, `color: #67C23A`)
      this.heartCheck()
      if (!data) {
        // 有要传的数据,就发给后端
        return this.ws.send(data)
      }
    }
    // 监听服务器端返回的信息
    this.ws.onmessage = event => {
      // 把数据传给回调函数，并执行回调
      if (event.data === 'pong') {
        console.log(`%cWebsocket is connecting...`, `color: #67C23A`)
        this.pingPong = 'pong' // 服务器端返回pong,修改pingPong的状态
        return
      }
      return this.msgCallback(event)
    }
    // ws关闭回调
    this.ws.onclose = event => {
      this.closeHandle() // 判断是否关闭
    }
    // ws出错回调
    this.onerror = event => {
      this.closeHandle() // 判断是否关闭
    }
  }
  
  heartCheck() {
    // 心跳机制的时间可以自己与后端约定
    this.pingPong = 'ping' // ws的心跳机制状态值
    this.pingInterval = setInterval(() => {
      if (this.ws.readyState === 1) {
        // 检查ws为链接状态 才可发送
        this.ws.send('ping') // 客户端发送ping
      }
    }, 60000)
    this.pongInterval = setInterval(() => {
      this.pingPong = false
      if (this.pingPong === 'ping') {
        this.closeHandle('pingPong没有改变为pong') // 没有返回pong 重启webSocket
      }
      // 重置为ping 若下一次 ping 发送失败 或者pong返回失败(pingPong不会改成pong)，将重启
      this.pingPong = 'ping'
    }, 60000)
  }
  
  // 发送信息给服务器
  sendHandle(data) {
    console.log(`${this.name}发送消息给服务器:`, data)
    return this.ws.send(data)
  }
  
  closeHandle(e = 'err') {
    // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
    if (this.status !== 'close') {
      console.log(`${this.name}断开，重连websocket`, e)
      if (!this.pingInterval && !this.pongInterval) {
        // 清除定时器
        clearInterval(this.pingInterval)
        clearInterval(this.pongInterval)
      }
      this.connect() // 重连
    } else {
      console.log(`${this.name}websocket手动关闭`)
    }
  }
  
  // 手动关闭WebSocket
  closeMyself() {
    console.log(`关闭${this.name}`)
    this.status = 'close'
    return this.ws.close()
  }
}

export default WebSocketClass
