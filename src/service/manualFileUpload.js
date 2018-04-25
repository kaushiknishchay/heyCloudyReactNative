import startFileUpload from './fileUpload';
import realm, { getAllPhotosRealm } from '../database/realm';
import fileUtil from '../utils/file';

export default function doFileUpload() {
  console.log('aa');
  const allPhotosRealm = getAllPhotosRealm();
  if (allPhotosRealm !== undefined && allPhotosRealm.length > 0) {
    const allPhotos = allPhotosRealm[0];
    try {
      // Get the folders to with backup property as true;
      const backupFolders = [...realm.objects('Folder')].map(obj => obj.data);

      if (allPhotos) {
        const abc = allPhotos.getPhotosToBackup(backupFolders);
        abc.forEach(async (obj) => {
          const { uri } = obj.image;
          await fileUtil.getFileStat(uri)
            .then((stats) => {
              startFileUpload({
                path: `${stats.path}`,
                headers: {
                  'content-type': obj.type, // server requires a content-type header
                  filePath: stats.path,
                  fileName: stats.filename,
                },
              });
            });
        });
      }
    } catch (e) {
      // console.error('Failed to Upload Files', e);
    }
  }
}
