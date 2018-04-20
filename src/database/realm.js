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

class AllPhotos extends Realm.Object {
  getAllNodes() {
    return this.edges;
  }

  transformFolders() {
    return Object.keys(this.getAllFolders())
      .map(key => ({ name: key, count: this.getAllFolders()[key], backedUp: false }));
  }

  getAllFolders() {
    return this.edges
      // .map(item => item.group_name)
      .reduce((acc, o) => {
        acc[o.group_name] = (acc[o.group_name] || 0) + 1;
        return acc;
      }, {});
  }
}

AllPhotos.schema = {
  name: 'AllPhotos',
  properties: {
    edges: 'Node[]',
  },
};

export default new Realm({
  schema: [
    Folder, AllFoldersList, AllPhotos, Node, Image],
  schemaVersion: 5,
});
