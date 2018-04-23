import Realm from 'realm';


class Folder extends Realm.Object {
  get data() {
    return {
      id: this.id, name: this.name, count: this.count, backedUp: this.backedUp,
    };
  }
}

Folder.schema = {
  name: 'Folder',
  primaryKey: 'name',
  properties: {
    id: 'int',
    name: 'string',
    backedUp: { type: 'bool', default: false },
    count: { type: 'int', default: 0 },
  },
};

class AllFoldersList extends Realm.Object {
  getFolderList() {
    return [...this.items.values()].map(obj => obj.data);
  }

  getBackupEnabledFolders() {
    return [...this.items.values()].filter(obj => obj.data.backedUp === true);
  }

  getNameList() {
    return [...this.items.values()].map(obj => obj.name);
  }

  indexOf(name) {
    const list = this.getNameList();
    return list.indexOf(name);
  }

  toggleItem(item) {
    const idx = this.indexOf(item.name);
    if (idx > -1) {
      this.items[idx].backedUp = !this.items[idx].backedUp;
    }
  }
}

AllFoldersList.schema = {
  name: 'AllFoldersList',
  properties: {
    items: 'Folder[]',
  },
};

class Image extends Realm.Object {
}

Image.schema = {
  name: 'Image',
  properties: {
    uri: 'string',
    height: 'int',
    width: 'int',
    isStored: 'bool?',
    playableDuration: 'int?',
  },
};
class Node extends Realm.Object {
}

Node.schema = {
  name: 'Node',
  properties: {
    type: 'string?',
    group_name: 'string',
    image: 'Image',
    timestamp: 'int',
  },
};

class BackupInfo extends Realm.Object {
  getData() {
    return {
      timestamp: this.timestamp,
      filesCount: this.filesCount,
      successful: this.successful,
      errorMessage: this.errorMessage,
    };
  }
}

BackupInfo.schema = {
  name: 'BackupInfo',
  properties: {
    timestamp: 'date',
    filesCount: 'int',
    successful: 'bool',
    errorMessage: 'string',
  },
};

class AllPhotos extends Realm.Object {
  name = 'AllPhotos';

  getAllNodes() {
    return this.edges;
  }

  //
  // transformFolders() {
  //   const allFolders = this.getAllFolders();
  //   return Object.keys(allFolders)
  //     .map((key, index) => ({
  //       id: index, name: key, count: allFolders[key], backedUp: false,
  //     }));
  // }

  // getAllFolders() {
  //   return this.edges
  //     // .map(item => item.group_name)
  //     .reduce((acc, o) => {
  //       acc[o.group_name] = (acc[o.group_name] || 0) + 1;
  //       return acc;
  //     }, {});
  // }
}

AllPhotos.schema = {
  name: 'AllPhotos',
  properties: {
    edges: 'Node[]',
  },
};

// --------------------------------------------- //
// Realm Object and Methods to return its Object //
// --------------------------------------------- //

const realm = new Realm({
  schema: [
    Folder, AllFoldersList, AllPhotos, Node, Image, BackupInfo],
  schemaVersion: 5,
});


export const getAllFoldersRealm = () => realm.objects('AllFoldersList');

export const getAllFoldersFromDB = () => {
  if (getAllFoldersRealm().length > 0) return getAllFoldersRealm()[0];
  return undefined;
};

export const getAllPhotosRealm = () => realm.objects('AllPhotos');

export const getBackupInfo = () => {
  const backupObj = realm.objects('BackupInfo');
  if (backupObj.length > 0) { return backupObj[0].getData(); }
  return undefined;
};


export default realm;
