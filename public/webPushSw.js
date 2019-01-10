self.addEventListener("push", function(event) {
  const pushData = JSON.parse(event.data.text())
  let title

  switch (pushData.type) {
    case "DEVICE_NOTIFICATION":
      title = pushData.device.name
      break

    case "SHARE_RECEIVED_NOTIFICATION":
      title = "Environment shared with you"
      break

    case "SHARE_ACCEPTED_NOTIFICATION":
      title = "You share was accepted"
      break

    case "CHANGE_OWNER_RECEIVED_NOTIFICATION":
      title = "Ownership transfer requested"
      break

    case "OWNER_CHANGE_ACCEPTED_NOTIFICATION":
      title = "Your ownership transfer was accepted"
      break

    default:
      break
  }

  const options = {
    body: pushData.content,
  }

  const notification = self.registration.showNotification(title, options)
  event.waitUntil(notification)
})
