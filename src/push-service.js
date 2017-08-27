/**
 * Handle push events
 */
self.addEventListener('push', function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  // extract notification data if possible
  var data = event.data ? event.data.json() : {};
  var title = 'title' in data ? data.title : 'Meditation+';

  // set a default icon if none was declared
  if (!('icon' in data)) {
    data.icon = './assets/icon/android-chrome-192x192.png';
  }

  // show notification
  event.waitUntil(
    self.registration.showNotification(title, data)
  );
});


/**
 * Click event for notifications
 */
self.addEventListener('notificationclick', function(event) {
  var target = event.notification;

  if (!target) {
    return;
  }

  // close the notification if not set as sticky
  if (!target.data || !target.data.sticky) {
    event.notification.close();
  }

  // open data link if possible
  if (target.data && target.data.url) {
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
            return clients.openWindow(target.data.url);
          }
        }
      })
    );
  }
});

/**
 * Closing event for notifications
 */
self.addEventListener('notificationclose', function(event) {
  var target = event.notification;

  // simulate 'sticky' notifications if option is set
  if (target && target.data && target.data.sticky) {
    event.waitUntil(
      self.registration.showNotification(target.title, target)
    );
  }
});
