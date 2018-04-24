import Upload from 'react-native-background-upload';

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
  Upload.startUpload(options).then((uploadId) => {
    // console.log(`Uploading file: ${passedOptions.path}`);
    // console.log(`Upload started with options: ${JSON.stringify(options)}`);
    Upload.addListener('progress', uploadId, (data) => {
      // console.log(`Progress: ${data.progress}%`);
    });
    Upload.addListener('error', uploadId, (data) => {
      // console.log(`Error: ${data.error}%`);
    });
    Upload.addListener('completed', uploadId, (data) => {
      // console.log('Completed!');
    });
  }).catch((err) => {
    // console.log('Upload error!', err);
  });
}