import { io } from 'socket.io-client';
import { Store } from '../Store';
import config from '../config';


class SocketService {
  private socket;

  public constructor() {
    this.socket = io(`http://${config.host}`);

    this.socket.on('change', function(song: any) {
      Store.dispatch({
        type: 'change', data: song
      })
    });
  }

  public queueSong(file: string) {
    this.socket.emit('queueSong', file);
  }

  public queueAlbum(album: string) {
    this.socket.emit('queueAlbum', album);
  }
}

export const socketService = new SocketService();