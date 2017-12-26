import fetch from '../fetch';

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
