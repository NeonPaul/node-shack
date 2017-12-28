import fetch from '../fetch';
import { subscribe as swRegister } from '../../service-worker/register';

export const SUBSCRIBE = "subscribe notification";

export const subscribe = () => ({
  type: SUBSCRIBE
})

export const createSubscription = async (data) => (dispatch, getState) => {
  await fetch("/api/channels/", getState, {
    method: 'POST',
    body: { data }
  })

  dispatch(subscribe())
}

export const register = async () => (dispatch, getState) => {
  dispatch(createSubscription(await swRegister()))
}
