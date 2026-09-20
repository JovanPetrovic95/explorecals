self.addEventListener("push", (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch { payload = {}; }
  event.waitUntil(
    self.registration.showNotification(payload.title || "ExploreCals", {
      body: payload.body || "",
      data: { url: payload.url || "/app/notifications" },
      tag: payload.notificationId ? `notification-${payload.notificationId}` : undefined,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/app/notifications";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients[0];
      if (existing) {
        existing.postMessage({ type: "EXPLORECALS_PUSH_OPEN", url });
        return existing.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
