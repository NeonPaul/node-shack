import notification from './subscription'
import Api from '../store/api'

export const notifications = notification(process.env.VAPID_PUBLIC)
export const api = Api('/api')
