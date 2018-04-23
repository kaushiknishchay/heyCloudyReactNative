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

function reduceFolderArray(edgesArray) {
  return edgesArray
    .reduce((acc, o) => {
      acc[o.group_name] = (acc[o.group_name] || 0) + 1;
      return acc;
    }, {});
}

function transformFolderArray(folderArray) {
  return Object.keys(folderArray)
    .map((key, index) => ({
      id: index, name: key, count: folderArray[key], backedUp: false,
    }));
}

const fileUtil = {
  getFileStat,
  getFileData,
  reduceFolderArray,
  transformFolderArray,
};

export default fileUtil;
