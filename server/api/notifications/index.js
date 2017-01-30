'use strict';

import request from 'request-promise';
import config from '../../config/environment';

/**
 * Add a user to our notification group
 */
export function addIdToGroup(id) {
  const options = {
      method: 'POST',
      uri: 'https://android.googleapis.com/gcm/notification',
      body: {
         operation: 'create',
         notification_key_name: config.notifications.groupName,
         registration_ids: [id]
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key='  + config.notifications.authorization,
        'project_id':  config.notifications.projectId
      },
      json: true
  };

  request(options)
    .then(function(body) {
      console.log('good!', JSON.stringify(body));
    })
    .catch(function(err) {
      console.log('bad!', JSON.stringify(err));
    });

  return false;
}

/**
 * Remove user from our notification group
 */
export function removeIdFromGroup(id) {
  const options = {
      method: 'POST',
      uri: 'https://android.googleapis.com/gcm/notification',
      body: {
         operation: 'remove',
         notification_key_name: config.notifications.groupName,
         registration_ids: [id]
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key='  + config.notifications.authorization,
        'project_id':  config.notifications.projectId
      },
      json: true
  };

  request(options)
    .then(function(body) {
      console.log('good!', JSON.stringify(body));
    })
    .catch(function(err) {
      console.log('bad!', JSON.stringify(err));
    });

  return false;
}

/**
 * Send notification to our group of users
 */
export function sendToGroup() {
  const options = {
      method: 'POST',
      uri: 'https://fcm.googleapis.com/fcm/send',
      body: {
        to: config.notifications.groupId
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key='  + config.notifications.authorization,
        'project_id':  config.notifications.projectId
      },
      json: true
  };

  request(options)
    .then(function(body) {
      console.log('good!', JSON.stringify(body));
    })
    .catch(function(err) {
      console.log('bad!', JSON.stringify(err));
    });

  return false;
}
