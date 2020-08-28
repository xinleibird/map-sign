import { Dispatch } from 'redux';
import { addMapSignToDB, listMapSignsFromDB } from '../../api';
import { ICoordinates, IOpenedTips, ISignEntry } from '../../types';

export enum ACTION_TYPE {
  INIT_ENTRIES,
  ADD_ENTRY,
  DELETE_ENTRY,
  UPDATE_ENTRY,
  SET_OPENED_TIP,
  UPDATE_ADDED_LOCATION,
  SET_APP_INIT_LOADING,
  SET_APP_ALERT,
  SET_APP_USER_INFO,
}

export const initEntries = () => {
  return async (dispatch: Dispatch) => {
    const res = await listMapSignsFromDB();

    if (res.message === 'success') {
      const { data } = res;
      dispatch({ type: ACTION_TYPE.INIT_ENTRIES, entries: data, initFinish: true });
      dispatch({ type: ACTION_TYPE.SET_APP_INIT_LOADING, isLoading: false });
    } else if (res.message === 'too many request') {
      dispatch({ type: ACTION_TYPE.SET_APP_ALERT, alert: '页面刷新太频繁了！请稍后重试' });
    } else {
      console.error(res.message);
    }
  };
};

export const addEntry = (sign: ISignEntry) => {
  return async (dispatch: Dispatch) => {
    const res = await addMapSignToDB(sign);

    if (res.message === 'success') {
      const { data } = res;
      dispatch({ type: ACTION_TYPE.ADD_ENTRY, entry: data });
    } else {
      console.error(res.message);
    }
  };
};

export const setOpenedTip = (openedTipState: IOpenedTips) => {
  return {
    type: ACTION_TYPE.SET_OPENED_TIP,
    openedTipState,
  };
};

//

export const updateAddedLocation = (coordinates: ICoordinates | null) => {
  return {
    type: ACTION_TYPE.UPDATE_ADDED_LOCATION,
    coordinates: coordinates || [],
  };
};

//

export const setAppInitLoading = (isLoading: boolean) => {
  return {
    type: ACTION_TYPE.SET_APP_INIT_LOADING,
    isLoading,
  };
};

export const setAppAlert = (alert: string) => {
  return {
    type: ACTION_TYPE.SET_APP_ALERT,
    alert,
  };
};

export const setAppUserInfo = (userInfo: {
  login: string;
  avatar_url: string;
  name: string;
  html_url: string;
}) => {
  return {
    type: ACTION_TYPE.SET_APP_USER_INFO,
    userInfo,
  };
};
