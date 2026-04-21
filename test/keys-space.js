var EventEmitter = require('events').EventEmitter;
var keys = require('../lib/keys');
var assert = require('assert');

var stream = new EventEmitter();
keys.emitKeypressEvents(stream);

var events = [];
stream.on('keypress', function(ch, key) {
  events.push(key);
});

stream.emit('data', '\x00');
assert.strictEqual(events.length, 1);
assert.strictEqual(events[0].name, 'space');
assert.strictEqual(events[0].ctrl, true);

stream.emit('data', '\x1b[ ');
assert.strictEqual(events.length, 2);
assert.strictEqual(events[1].name, 'space');

console.log('keys-space test passed');