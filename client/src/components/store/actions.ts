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
}

export const initEntries = () => {
  return async (dispatch: Dispatch) => {
    const entries = await listMapSignsFromDB();
    dispatch({ type: ACTION_TYPE.INIT_ENTRIES, entries });
  };
};

export const addEntry = (sign: ISignEntry) => {
  return async (dispatch: Dispatch) => {
    const entry = await addMapSignToDB(sign);

    dispatch({ type: ACTION_TYPE.ADD_ENTRY, entry });
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
