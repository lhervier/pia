export class ApplicationDb {
  protected serverUrl: string;
  public pia_id: number;
  public reference_to: string;
  public created_at: Date;
  public updated_at: Date;
  protected dbVersion: number;
  protected tableName: string;
  protected objectStore: IDBObjectStore;

  constructor(dbVersion: number, tableName: string) {
    this.dbVersion = dbVersion;
    this.tableName = tableName;
    if (localStorage.getItem('server_url')) {
      this.serverUrl = localStorage.getItem('server_url');
    } else {
      this.serverUrl = null;
    }
  }

  async initDb() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.tableName, this.dbVersion);
      request.onerror = (event: any) => {
        console.error('Error');
      };
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
      request.onupgradeneeded = (event: any) => {
        let objectStore = null;
        if (event.oldVersion !== 0) {
          objectStore =  event.target.transaction.objectStore(this.tableName);
        } else {
          objectStore = event.target.result.createObjectStore(this.tableName, { keyPath: 'id', autoIncrement: true });
        }
        if (objectStore) {
          if (event.oldVersion === 0) {
            // First DB init
            if (this.tableName === 'pia') {
              objectStore.createIndex('index1', 'status', { unique: false });
            } else if (this.tableName === 'comment') {
              objectStore.createIndex('index1', ['pia_id', 'reference_to'], { unique: false });
            } else if (this.tableName === 'evaluation') {
              objectStore.createIndex('index1', ['pia_id', 'reference_to'], { unique: false });
              objectStore.createIndex('index2', 'pia_id', { unique: false });
            } else if (this.tableName === 'answer') {
              objectStore.createIndex('index1', ['pia_id', 'reference_to'], { unique: false });
              objectStore.createIndex('index2', 'pia_id', { unique: false });
            } else if (this.tableName === 'measure') {
              objectStore.createIndex('index1', 'pia_id', { unique: false });
            } else if (this.tableName === 'attachment') {
              objectStore.createIndex('index1', 'pia_id', { unique: false });
            }
          }
          if (event.oldVersion !== this.dbVersion) {
            // Next DB versions
            if (this.dbVersion === 201708291502) {
              if (this.tableName === 'attachment') {
                objectStore.createIndex('index2', ['pia_id', 'pia_signed'], { unique: false });
              }
            }
            if (this.dbVersion === 201709122303) {
              if (this.tableName === 'comment') {
                objectStore.createIndex('index2', 'pia_id', { unique: false });
              }
            }
          }
        }
      };
    });
  }

  async getObjectStore() {
    const db: any = await this.initDb();
    db.onversionchange = function(event) {
      db.close();
      alert('A new version of this page is ready. Please reload!');
    };
    return new Promise((resolve, reject) => {
      this.objectStore = db.transaction(this.tableName, 'readwrite').objectStore(this.tableName);
      resolve();
    });
  }

  /**
   * Find all entries without conditions
   */
  async findAll() {
    const items = [];
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        fetch(this.getServerUrl(), {credentials: 'include'}).then(function(response) {
          return response.json();
        }).then(function(result: any) {
          resolve(result);
        }).catch (function (error) {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          this.objectStore.openCursor().onsuccess = (event: any) => {
            const cursor = event.target.result;
            if (cursor) {
              items.push(cursor.value);
              cursor.continue();
            } else {
              resolve(items);
            }
          }
        });
      }
    });
  }

  async find(id) {
    if (id) {
      return new Promise((resolve, reject) => {
        if (this.serverUrl) {
          fetch(this.getServerUrl() + '/' + id, {credentials: 'include'}).then(function(response) {
            return response.json();
          }).then(function(result: any) {
            resolve(result);
          }).catch (function (error) {
            console.error('Request failed', error);
          });
        } else {
          this.getObjectStore().then(() => {
            this.objectStore.get(id).onsuccess = (event: any) => {
              resolve(event.target.result);
            };
          });
        }
      });
    }
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        fetch(this.getServerUrl() + '/' + id, {
          method: 'DELETE',
          credentials: 'include'
        }).then(function(response) {
          return response;
        }).then(function(item) {
          resolve();
        }).catch (function (error) {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          this.objectStore.delete(id).onsuccess = (event: any) => {
            resolve();
          };
        });
      }
    });
  }

  protected getServerUrl() {
    if (this.tableName !== 'pia') {
      return this.serverUrl + '/pias/' + this.pia_id + '/' + this.tableName + 's' ;
    } else {
      return this.serverUrl + '/pias';
    }
  }
}
