import realm, { getAllPhotosRealm } from '../database/realm';
import fileUtil from '../utils/file';
import isServerAvailable from '../utils/network';
import startFileUpload from './fileUpload';


export default function doFileUpload(callBack = () => {}) {
  isServerAvailable()
    .then(() => {
      const allPhotosRealm = getAllPhotosRealm();
      if (allPhotosRealm !== undefined && allPhotosRealm.length > 0) {
        const allPhotos = allPhotosRealm[0];
        try {
          // Get the folders to with backup property as true;
          const backupFolders = [...realm.objects('Folder').filtered('backedUp == true')]
            .reduce((acc, obj) => `${acc === '' ? '' : `${acc} OR `} group_name=="${obj.data.name}"`, '');

          if (allPhotos) {
            const backupPhotosList = allPhotos.edges.filtered(backupFolders);
            backupPhotosList.forEach((obj, currentIndex) => {
              const { uri } = obj.image;
              fileUtil.getFileStat(uri)
                .then((stats) => {
                  startFileUpload({
                    path: `${stats.path}`,
                    headers: {
                      'content-type': obj.type,
                      filePath: stats.path,
                      fileName: stats.filename,
                    },
                  }, currentIndex, backupPhotosList.length, callBack);
                });
            });
          }
        } catch (e) {
          realm.write(() => {
            realm.create('BackupInfo', {
              timestamp: new Date().toLocaleString(),
              successful: false,
              errorMessage: 'Error while uploading files',
              errorFilesCount: 1,
            }, true);
          });
          callBack();
        }
      }
    })
    .catch((e) => {
      const allPhotosRealm = getAllPhotosRealm();
      let fileCount = 1;

      if (allPhotosRealm !== undefined && allPhotosRealm.length > 0) {
        const backupFolders = [...realm.objects('Folder').filtered('backedUp == true')]
          .reduce((acc, obj) => `${acc === '' ? '' : `${acc} OR `} group_name=="${obj.data.name}"`, '');

        const allPhotos = allPhotosRealm[0].edges.filtered(backupFolders);
        if (allPhotos) {
          fileCount = allPhotos.length;
        }
      }

      realm.write(() => {
        realm.delete(realm.objects('BackupInfo'));

        realm.create('BackupInfo', {
          timestamp: new Date().toLocaleString(),
          successful: false,
          errorMessage: 'Server is not reachable',
          errorFilesCount: fileCount,
        });
      });
      callBack();
    });
}
