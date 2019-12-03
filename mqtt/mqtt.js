const logger = require('../middlewares/Logger').getLogger('MQTT')
const { host, port } = require('../../config/mqtt.config').config
const mqttEventEmitter = require('../events/mqttEventEmitter')
const mqtt = require('mqtt')

class Mqtt {
  constructor () {
    this.client = null
    this.clientId = 'MQTT_' + Math.random().toString(16).substr(2, 8)
  }
  
  connect (protocol = 'mqtt') {
    this.client = mqtt.connect(`${protocol}://${host}:${port}`, {
      clientId: this.clientId
    })
  
    /*
     * Emitted on successful (re)connection (i.e. connack rc=0).
     */
    
    this.client.on('connect', () => {
      const clientId = this.clientId
      logger.info(`MQTT connected: ${clientId}`)
      this.subscribe('hhhhhh')
      this.publish('hhhhhh', JSON.stringify('hello mqtt'))
    })
  
    /*
     * Emitted when the client receives a publish packet.
     * · topic - topic of the received packet
     * · message - payload of the received packet, message is Buffer
     * · packet - received packet, as defined in mqtt-packet
     */
    
    this.client.on('message', (topic, message, packet) => {
      logger.info(`======== Topic ========: \n\t ${topic}`)
      logger.info(`======= Message =======: \n\t ${message.toString()}`)
      // console.log('Im packet: ', packet)
      mqttEventEmitter.emit('MQTT/message', message.toString())
      // this.end()
    })
  
    /*
     * Emitted after a disconnection.
     */
    
    this.client.on('close', () => {
      logger.info(`MQTT connect closed`)
    })
    
    /*
     * Emitted when the client cannot connect (i.e. connack rc != 0) or when a parsing error occurs.
     */
    
    this.client.on('error', err => {
      logger.info(`MQTT connect with ERR: \n\t ${err}`)
      this.end()
      process.exit(1)
    })
  }
  
  /**
   * Publish a message to a topic
   * @param topic -  is the topic to publish to, String
   * @param message -  is the message to publish, Buffer or String
   */
  publish (topic, message) {
    this.client.publish(topic, message)
  }
  
  /**
   * Subscribe to a topic or topics
   * @param topic - is a String topic to subscribe to or an Array of topics to subscribe to.
   *                It can also be an object, it has as object keys the topic name and as value the QoS,
   *                like {'test1': {qos: 0}, 'test2': {qos: 1}}.
   *                MQTT topic wildcard characters are supported (+ - for single level and # - for multi level)
   */
  subscribe (topic) {
    this.client.subscribe(topic, err => {
      if (err) {
        logger.info(`MQTT Subscribe with ERR: ${err}`)
      }
    })
  }
  
  /**
   * Unsubscribe from a topic or topics
   * @param topic - is a String topic or an array of topics to unsubscribe from
   */
  unsubscribe (topic) {
    this.client.unsubscribe(topic, err => {
      if (!err) {
        console.log('停止订阅消息', topic)
      }
    })
  }
  
  /**
   * Close the client, accepts the following options:
   * @param force - passing it to true will close the client right away, without waiting for the in-flight messages to be asked. This parameter is optional.
   */
  end (force = false) {
    this.client.end(force)
  }
}

module.exports = new Mqtt()
