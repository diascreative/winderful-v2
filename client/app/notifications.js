'use strict';

function subscribePush() {
  navigator.serviceWorker.ready.then(function(registration) {
    if (!registration.pushManager) {
      console.log('Your browser doesn\'t support push notification.');
      return false;
    }

    //To subscribe `push notification` from push manager
    registration.pushManager.subscribe({
      userVisibleOnly: true
    })
    .then(function(subscription) {
      console.info('Push notification subscribed.');
      console.log(subscription);
      //saveSubscriptionID(subscription);
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
          console.info('Push notification unsubscribed.');
          console.log(subscription);
          //deleteSubscriptionID(subscription);
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

document.getElementById('notifications')
  .addEventListener('change', e => {
    const input = e.target;

    if (input.checked) {
      subscribePush();
    } else {
      unsubscribePush();
    }
  });
