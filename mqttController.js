const logger = require('../middlewares/Logger').getLogger('MQTT')
const mqttEventEmitter = require('../events/mqttEventEmitter')
const mqttEventService = require('../services/mqtt')
const mqtt = require('../utils/mqtt')

mqttEventEmitter.on('MQTT/message', (data) => {
  logger.info(`EventEmitter 接收到 MQTT message event`)
  // 业务代码在这里
  logger.info('Controller 接收到数据：', data)
  mqttEventService.mqttMessage(result)
})

