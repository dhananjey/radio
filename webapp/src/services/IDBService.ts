import * as _ from 'lodash';

class IDBService {
  private data: any;
  private artists: any[];
  private genres: any[];

  constructor() {
    this.data = [];
    this.artists = [];
    this.genres = [];
  }

  public open(data: any) {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open('mpd-db', 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        db.createObjectStore('songs', { keyPath: 'id', autoIncrement: true });      
      };

      request.onsuccess = () => {
        let transaction = request.result.transaction("songs", "readwrite");
        let songs = transaction.objectStore("songs");

        for(const item of data) {
          if (!item.directory) {
            songs.add(item);
          }
        }

        transaction.addEventListener('complete', event => {
          this.data = data;
          this.artists = _.uniq(this.data.map((r: any) => r.artist || 'Desconocido')).sort()
          this.genres = _.uniq(this.data.map((r: any) => r.genre || 'Desconocido')).sort();          
          resolve(true);
        });        
      }

      request.onerror = (e: Event) => reject(e);
    });
  }

  public refresh() {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open('mpd-db', 1);

      request.onsuccess = () => {
        const db = request.result;
        let transaction = db.transaction("songs");
        let songs = transaction.objectStore("songs");
        let request2 = songs.getAll();
  
        request2.onsuccess = () => {
          if (request.result !== undefined) {
            this.data = request2.result;
            this.artists = _.uniq(this.data.map((r: any) => r.artist || 'Desconocido')).sort()
            this.genres = _.uniq(this.data.map((r: any) => r.genre || 'Desconocido')).sort();
          }
  
          resolve(true);
        };        
      };

      request.onerror = (e: Event) => reject(e);
    });
  }

  public getArtists() {
    return this.artists;
  }

  public getGenres() {
    return this.genres;
  }

  public getByArtist = (name: string) => {
    return _.sortBy(this.data.filter((r: any) => r.artist === name), 'date');
  }

  public getByGenre(name: string) {
    return _.sortBy(this.data.filter((r: any) => r.genre === name), 'date');
  }
}

export const idbService = new IDBService();