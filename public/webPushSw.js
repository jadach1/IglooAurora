self.addEventListener("push", function(event) {
  const pushData = JSON.parse(event.data.text())
  const title = pushData.device.customName
  const options = {
    body: pushData.content,
  }

  const notification = self.registration.showNotification(title, options)
  event.waitUntil(notification)
})
