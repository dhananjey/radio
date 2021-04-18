import React, { useEffect } from 'react';
import './App.css';
import {
  Container,
  Paper,
  CircularProgress
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Player } from './Player/Player';
import { Search } from './Search/Search';
import { Login } from './Login/Login';
import { Song } from './models';
import { init } from './services/AppService';

export const App = (prop: any) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const song = useSelector((store: { song: Song }) => store.song);
  const storageUser: string | null = localStorage.getItem('RadioTincho.Usuario');
  const [username, setUsername] = React.useState<string | null>(storageUser);


  const onSaveUser = (username: string) => {
    localStorage.setItem('RadioTincho.Usuario', username);
    setUsername(username);
  }

  useEffect(() => {
    async function load() {
      await init();
      setIsLoading(false);
    }

    load();
  }, []);

  return (
    <Container className='app'>
      {
        isLoading &&
        <div className='loading'>
          <CircularProgress />
          <span>Actualizando la base de datos</span>
          <br/>
          <span>Puede demorar unos minutos...</span>
        </div>
      }

      {
        !isLoading &&
        <div className='main'>
          { !username && <Login onSaveUser={onSaveUser} /> }

          { username &&
            <div className='layout'>
              <Player song={song} />

              <Paper className='users'>
                <h3>Hola {username}!</h3>
                <p>
                  Bienvenido a Radio Tincho.
                  <br/> <br/>
                  Copate y agrega música ;)
                </p>
              </Paper>
            </div>
          }

          { username && <Search /> }
        </div>
      }
  </Container>
  );
}