import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import { getBackupInfo } from '../../database/realm';


function* backupInfoSet() {
  const response = yield call(getBackupInfo);

  yield put({
    type: 'BACKUP_INFO_UPDATE',
    payload: fromJS(response),
  });
}

function* backupInfoFetch() {
  yield takeEvery('BACKUP_INFO_FETCH', backupInfoSet);
}


export default function* rootSaga() {
  yield all([
    backupInfoFetch(),
  ]);
}
