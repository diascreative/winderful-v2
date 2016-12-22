/**
 * Output model events
 */

'use strict';

import {EventEmitter} from 'events';
var Output = require('../../sqldb').Output;
var OutputEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OutputEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Output.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    OutputEvents.emit(event + ':' + doc._id, doc);
    OutputEvents.emit(event, doc);
    done(null);
  }
}

export default OutputEvents;
