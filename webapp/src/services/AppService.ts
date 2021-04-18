import axios from 'axios';
import { idbService } from './IDBService';
import { Stats } from '../models';
import config from '../config';

export async function init() {
  const localLastUpdate = localStorage.getItem('RadioTincho.lastupdate');
  const response = await axios.get(`http://${config.host}/api/stats`);
  const dbStats: Stats = response.data;
  
  //UDPATE DATBASE
  if (dbStats.db_update > (localLastUpdate || 0)) {
    localStorage.setItem('RadioTincho.lastupdate', dbStats.db_update.toString());
    const dbRequest = await axios.get(`http://${config.host}/api/database`);
    await idbService.open(dbRequest.data);
  }
  else {
    await idbService.refresh();
  }
}