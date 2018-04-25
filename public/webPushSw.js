self.addEventListener("push", function(event) {
  console.log("[Service Worker] Push Received.")
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)

  const pushData = JSON.parse(event.data.text())
  const title = pushData.content
  const options = {
    body: pushData.content,
  }

  const notification = self.registration.showNotification(title, options)
  event.waitUntil(notification)
})
