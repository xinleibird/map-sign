import { Action, combineReducers } from 'redux';
import { ICoordinates, IOpenedTips, ISignEntry } from '../../types';
import { ACTION_TYPE } from './actions';

interface IEntriesState {
  entries: ISignEntry[];
  openedTips: { [id: string]: string };
  addedCoordinates: ICoordinates | [];
}

export const signs = (
  state: IEntriesState = {
    entries: [],
    openedTips: {},
    addedCoordinates: [],
  },
  action: Action & {
    entry: ISignEntry;
    entries: ISignEntry[];
    openedTipState: IOpenedTips;
    coordinates: ICoordinates;
  }
) => {
  switch (action.type) {
    case ACTION_TYPE.INIT_ENTRIES:
      return {
        entries: action.entries ? [...action.entries] : [],
        openedTips: state.openedTips,
        addedCoordinates: state.addedCoordinates,
      };

    case ACTION_TYPE.SET_OPENED_TIP:
      return {
        entries: state.entries,
        openedTips: { ...action.openedTipState },
        addedCoordinates: state.addedCoordinates,
      };

    case ACTION_TYPE.ADD_ENTRY:
      return {
        entries: [...state.entries, action.entry],
        openedTips: state.openedTips,
        addedCoordinates: state.addedCoordinates,
      };

    case ACTION_TYPE.UPDATE_ENTRY: {
      const odd = state.entries.map((e) => {
        if (e._id === action.entry._id) {
          return action.entry;
        }
        return e;
      });
      return {
        entries: [...odd],
        openedTips: state.openedTips,
        addedCoordinates: state.addedCoordinates,
      };
    }

    case ACTION_TYPE.DELETE_ENTRY: {
      const odd = state.entries.map((e) => {
        if (e._id === action.entry._id) {
          return action.entry;
        }
        return e;
      });

      return {
        entries: [...odd],
        openedTips: state.openedTips,
        addedCoordinates: state.addedCoordinates,
      };
    }

    case ACTION_TYPE.UPDATE_ADDED_LOCATION:
      return {
        entries: state.entries,
        openedTips: state.openedTips,
        addedCoordinates: [...action.coordinates],
      };

    default:
      return state;
  }
};

interface IUserInfo {
  login: string;
  avatar_url: string;
  name: string;
  html_url: string;
}

interface IAlertType {
  title: string;
  description: string;
  active?: string;
  action?: () => void;
}
interface IAppState {
  isLoading: boolean;
  alert: IAlertType | null;
  userInfo: IUserInfo;
}

export const app = (
  state: IAppState = {
    isLoading: true,
    alert: null,
    userInfo: { login: '', avatar_url: '', name: '', html_url: '' },
  },
  action: Action & { isLoading: boolean; alert: IAlertType; userInfo: IUserInfo }
) => {
  switch (action.type) {
    case ACTION_TYPE.SET_APP_LOADING:
      return { isLoading: action.isLoading, alert: state.alert, userInfo: state.userInfo };

    case ACTION_TYPE.SET_APP_ALERT:
      return {
        isLoading: state.isLoading,
        alert: action.alert,
        userInfo: state.userInfo,
      };

    case ACTION_TYPE.SET_APP_USER_INFO:
      return {
        isLoading: state.isLoading,
        alert: action.alert,
        userInfo: { ...action.userInfo },
      };

    default:
      return state;
  }
};

export default combineReducers({ app, signs });
