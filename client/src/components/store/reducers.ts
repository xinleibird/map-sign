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
        openedTips: { ...state.openedTips, ...action.openedTipState },
        addedCoordinates: state.addedCoordinates,
      };

    case ACTION_TYPE.ADD_ENTRY:
      return {
        entries: [...state.entries, action.entry],
        openedTips: state.openedTips,
        addedCoordinates: state.addedCoordinates,
      };

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

export default combineReducers({ signs });
