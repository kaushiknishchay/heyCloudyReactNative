import startFileUpload from './fileUpload';
import realm, { getAllPhotosRealm } from '../database/realm';
import fileUtil from '../utils/file';

export default function doFileUpload(callBack = () => {}) {
  const allPhotosRealm = getAllPhotosRealm();
  if (allPhotosRealm !== undefined && allPhotosRealm.length > 0) {
    const allPhotos = allPhotosRealm[0];
    try {
      // Get the folders to with backup property as true;
      const backupFolders = [...realm.objects('Folder')].map(obj => obj.data);

      if (allPhotos) {
        const backupPhotosList = allPhotos.getPhotosToBackup(backupFolders);

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
      // console.error('Failed to Upload Files', e);
    }
  }
}
