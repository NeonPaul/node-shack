import { fetch } from '../fetch'

const notifications = {
  create: (token, data) => fetch("/api/channels/", token, {
    method: 'POST',
    body: { data }
  })
}

export default { notifications };