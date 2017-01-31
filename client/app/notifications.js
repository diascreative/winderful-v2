'use strict';

if ('Notification' in window) {
  var notificationToggle = document.getElementById('notifications');

  if (Notification.permission === 'granted') {
    notificationToggle.setAttribute('checked', 'checked');
  }

  notificationToggle.addEventListener('change', e => {
    const input = e.target;

    if (input.checked) {
      subscribePush();
    } else {
      unsubscribePush();
    }
  });

  notificationToggle.style.display = 'block';
}

function saveSubscriptionID(id) {
  var request = new XMLHttpRequest();
  request.open('POST', '/api/notifications/' + id, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
}

function deleteSubscriptionID(id) {
  var request = new XMLHttpRequest();
  request.open('DELETE', '/api/notifications/' + id, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
}

function subscribePush() {
  navigator.serviceWorker.ready.then(function(registration) {
    //To subscribe `push notification` from push manager
    registration.pushManager.subscribe({
      userVisibleOnly: true
    })
    .then(function(subscription) {
      const url = subscription.endpoint.split('/');
      const id = url[url.length - 1];
      saveSubscriptionID(id);
    })
    .catch(function(error) {
      console.error('Push notification subscription error: ', error);
    });
  });
}

// Unsubscribe the user from push notifications
function unsubscribePush() {
  navigator.serviceWorker.ready
  .then(function(registration) {
    //Get `push subscription`
    registration.pushManager.getSubscription()
    .then(function(subscription) {
      //If no `push subscription`, then return
      if (!subscription) {
        console.log('Unable to unregister push notification.');
        return;
      }

      //Unsubscribe `push notification`
      subscription.unsubscribe()
        .then(function() {
          const url = subscription.endpoint.split('/');
          const id = url[url.length - 1];
          deleteSubscriptionID(id);
        })
        .catch(function(error) {
          console.error(error);
        });
    })
    .catch(function(error) {
      console.error('Failed to unsubscribe push notification.', error);
    });
  });
}
