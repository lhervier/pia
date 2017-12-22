import { ApplicationDb } from '../../../application.db';

export class Comment extends ApplicationDb {
  public id: number;
  public description: string;
  public for_measure: boolean;

  constructor() {
    super(201709122303, 'comment');
  }

  async create() {
    this.created_at = new Date();
    const data = {
          description: this.description,
          pia_id: this.pia_id,
          reference_to: this.reference_to,
          for_measure: this.for_measure,
          created_at: this.created_at
        }
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        const formData = new FormData();
        for (const d in data) {
          if (data.hasOwnProperty(d) && data[d]) {
            formData.append('comment[' + d + ']', data[d]);
          }
        }
        fetch(this.getServerUrl(), {
          method: 'POST',
          body: formData,
          credentials: 'include'
        }).then((response) => {
          return response.json();
        }).then((result: any) => {
          resolve(result.id);
        }).catch((error) => {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          this.objectStore.add(data).onsuccess = (event: any) => {
            resolve(event.target.result);
          };
        });
      }
    });
  }

  async findAllByReference() {
    const items = [];
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        fetch(this.getServerUrl() + '?reference_to=' + this.reference_to, {credentials: 'include'}).then((response) => {
          return response.json();
        }).then((result: any) => {
          resolve(result);
        }).catch((error) => {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          const index1 = this.objectStore.index('index1');
          index1.openCursor(IDBKeyRange.only([this.pia_id, this.reference_to])).onsuccess = (event: any) => {
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

  async findAll() {
    const items = [];
    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        fetch(this.getServerUrl(), {credentials: 'include'}).then((response) => {
          return response.json();
        }).then((result: any) => {
          resolve(result);
        }).catch((error) => {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          const index1 = this.objectStore.index('index2');
          index1.openCursor(IDBKeyRange.only(this.pia_id)).onsuccess = (event: any) => {
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

  async get(id: number) {
    this.id = id;
    this.find(this.id).then((entry: any) => {
      this.pia_id = entry.pia_id;
      this.description = entry.description;
      this.reference_to = entry.reference_to;
      this.for_measure = entry.for_measure;
      this.created_at = new Date(entry.created_at);
      this.updated_at = new Date(entry.updated_at);
    });
  }
}
