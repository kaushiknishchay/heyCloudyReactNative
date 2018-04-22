import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';

function getFileStat(path) {
  return RNFetchBlob.fs.stat(path);
  // .then((data12) => {
  //   console.log(data12);
  // });
}

function getFileData(path, type = 'utf8') {
  return RNFS.readFile(path, type);
  // .then(data11 => console.log(data11))
  // .catch(err => console.log(err));
}

const fileUtil = {
  getFileStat,
  getFileData,
};

export default fileUtil;
