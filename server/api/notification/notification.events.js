/**
 * Notification model events
 */

'use strict';

import {EventEmitter} from 'events';
var Notification = require('../../sqldb').Notification;
var NotificationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
NotificationEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Notification.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    NotificationEvents.emit(event + ':' + doc._id, doc);
    NotificationEvents.emit(event, doc);
    done(null);
  }
}

export default NotificationEvents;
