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

  var title = data.title || 'Meditation+';
  var body = data.message || '';
  var icon = './assets/icon/android-chrome-192x192.png';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon
    })
  );
});
