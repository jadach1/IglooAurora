self.addEventListener("push", function(event) {
  console.log("[Service Worker] Push Received.")
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)

  const pushData = JSON.parse(event.data.text())
  const title = pushData.device.customName
  const options = {
    body: pushData.content,
    timestamp: pushData.date
  }

  const notification = self.registration.showNotification(title, options)
  event.waitUntil(notification)
})
