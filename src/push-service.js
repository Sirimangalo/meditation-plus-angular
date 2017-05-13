/**
 * Register an event listener for incoming push messages from the server.
 */
self.addEventListener('push', function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  var data = {};
  if (event.data) {
    data = event.data.json();
  }

  var title = 'Meditation+';

  if (data.title) {
    title = data.title;
    delete data.title;
  }

  data.icon = data.icon || './assets/icon/android-chrome-192x192.png';

  event.waitUntil(
    self.registration.showNotification(title, data)
  );
});


// copied from:
// https://www.ajaxtown.com/article/web-push-notification-with-service-worker
self.addEventListener('notificationclick', function(event) {
  // close the notification
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {

    // To open the app after click notification
    event.waitUntil(
      clients.matchAll({
        type: 'window'
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if ('focus' in client) {
            return client.focus();
          }
        }

        if (clientList.length === 0) {
          if (clients.openWindow) {
            return clients.openWindow(urlAction);
          }
        }
      })
    );
  }
});
