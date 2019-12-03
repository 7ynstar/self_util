const logger = require('../middlewares/Logger').getLogger('MQTT')
const EventEmitter = require('events')

class MqttEventEmitter extends EventEmitter {}

const mqttEventEmitter = new MqttEventEmitter()

module.exports = mqttEventEmitter
