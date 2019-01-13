/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 21-07-2017
 * |
 * | File Name:     index.js
 * +===============================================
 */
const SerialPort = require('serialport')
const readline = require('readline')
const i1820 = require('@i1820/hub')

const HashtState = require('./hasht/state')

// broker-ip thing-id access-token
const client = new i1820.I1820Client('mqtt://platform.i1820.org', '5c363a21dc0c7ec7b188a623', '1FXa3RDneTFH7eI6CJlTlbdrIKr')
client.on('ready', () => {
  console.log('We are good to go')
})

const nrf = new SerialPort('/dev/ttyUSB0', {
  baudRate: 115200
})

nrf.on('error', (err) => {
  console.log(`serial port failed with ${err}`)
  process.exit(1)
})

const rl = readline.createInterface({
  input: nrf,
  output: nrf
})

rl.on('line', (input) => {
  if (!input) {
    return
  }

  let hs = new HashtState(input.toString())

  if (hs && hs.states) {
    let data = {}
    data[hs.states[0].name] = hs.states[0].value
    data[hs.states[1].name] = hs.states[1].value
    data[hs.states[2].name] = hs.states[2].value
    data[hs.states[3].name] = hs.states[3].value

    client.log(data)
  }
})
