import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';

const initialState = fromJS({
  backupInfo: {},
});

const backupApp = (state = initialState, action) => {
  switch (action.type) {
    case 'BACKUP_INFO_UPDATE':
      return state.merge({ backupInfo: action.payload });
    default:
      return state;
  }
};

export default combineReducers({
  backupApp,
});

