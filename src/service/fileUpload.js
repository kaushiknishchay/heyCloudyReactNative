import Upload from 'react-native-background-upload';
import realm from '../database/realm';

const commonOptions = {
  url: 'http://10.0.2.2:3000/upload_raw',
  // url: 'http://10.0.0.43:3000/upload_raw',
  method: 'POST',
  type: 'raw',
  // field: 'uploaded_media',
  // type: 'multipart',
  headers: {
    // 'content-type': 'application/x-www-form-urlencoded', // Customize content-type
  },
  // Below are commonOptions only supported on Android
  notification: {
    enabled: true,
  },
};

export default function startFileUpload(passedOptions) {
  // Upload.getFileInfo(passedOptions.path)
  const options = Object.assign({}, commonOptions, passedOptions);

  realm.write(() => {
    realm.delete(realm.objects('BackupInfo'));
  });

  Upload.startUpload(options).then((uploadId) => {
    // console.log(`Uploading file: ${passedOptions.path}`);
    // console.log(`Upload started with options: ${JSON.stringify(options)}`);
    Upload.addListener('progress', uploadId, (data) => {
      // console.log(`Progress: ${data.progress}%`);
    });

    Upload.addListener('error', uploadId, (data) => {
      // console.log(`Error: ${data.error}%`);
      realm.write(() => {
        realm.create('BackupInfo', {
          timestamp: new Date().toLocaleString(),
          successful: false,
          errorMessage: data.error,
        }, true);
      });
    });

    Upload.addListener('completed', uploadId, (data) => {
      // console.log('Completed!');
      realm.write(() => {
        const backupObj = realm.objects('BackupInfo');
        if (backupObj.length > 0) {
          backupObj[0].filesCount += 1;
        } else {
          realm.create('BackupInfo', {
            timestamp: new Date().toLocaleString(),
            successful: true,
            errorMessage: '',
            filesCount: 1,
          });
        }
      });
    });
  }).catch((err) => {
    // console.log('Upload error!', err);
  });
}
