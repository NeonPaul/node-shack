import api from "../../api";
import { getToken } from "..";
import { subscribe as swRegister } from "../../service-worker/register";

export const SUBSCRIBE = "subscribe notification";

export const subscribe = () => ({
  type: SUBSCRIBE
});

export const createSubscription = data => async (dispatch, getState) => {
  await api.notifications.create(getToken(getState()), data);

  dispatch(subscribe());
};

export const register = () => async (dispatch, getState) => {
  dispatch(createSubscription(await swRegister()));
};
