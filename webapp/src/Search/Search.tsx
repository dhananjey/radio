import './Search.css';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemSecondaryAction,
  IconButton,
  InputBase,
  Divider,
  Snackbar
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import * as _ from 'lodash';
import { idbService } from '../services/IDBService';
import { socketService } from '../services/SocketService';

export const Search = () => {
  const refAlbums: any = React.useRef();
  const refSongs: any = React.useRef();
  const [snackMsg, setSnackMsg] = React.useState<string>('');
  const [isSnackOpen, setIsSnackOpen] = React.useState<boolean>(false);
  const [artists, setArtists] = React.useState<any>([]);
  const [albums, setAlbums] = React.useState<any>([]);
  const [genres, setGenres] = React.useState<any>([]);
  const [songsAll, setSongsAll] = React.useState<any>([]);
  const [songs, setSongs] = React.useState<any>([]);
  const [searchBy, setSearchBy] = React.useState<string>('');
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [limit, setLimit] = React.useState<number>(40);

  React.useEffect(() => {
      const artists = idbService.getArtists();
      const genres = idbService.getGenres();
      setArtists(artists);
      setGenres(genres);
  }, []);

  React.useEffect(() => {
    if (songs.length > 0) {
      refSongs.current.scrollIntoView({block: "end", behavior: "smooth"});
    }
  }, [songs]);  
  
  React.useEffect(() => {
    if (albums.length > 0) {
      refAlbums.current.scrollIntoView({block: "end", behavior: "smooth"});
    }
  }, [albums]);

  const onSearchTypeChange = (evt: any) => {
    setLimit(40);
    setSearchBy(evt.target.value);
    setAlbums([]);
    setSongsAll([]);
    setSongs([]);
  }

  const onSearchChange = (evt: any) => {
    setSearchInput(evt.target.value)
  }

  const onSelect = async (type: string, name: string) => {
    let songs: any[];
    if (type === 'artist') {
      songs = await idbService.getByArtist(name) as any[];
    } else {
      songs = await idbService.getByGenre(name) as any[];
    }
    const albums: any[] = _.uniq(songs.map((s: any) => s.album));
    setAlbums(albums);
    setSongsAll(songs);
    setSongs([]);

    refAlbums.current.scrollIntoView({block: "end", behavior: "smooth"});
  }

  const onSelectAlbum = async (album: string) => {
    setSongs(songsAll.filter((s: any) => s.album === album));
  }  
  
  const onAlbumAdd = async (album: string) => {
    const song = songsAll.filter((s: any) => s.album === album)[0];
    setSnackMsg('Album agregado!');
    setIsSnackOpen(true);    
    socketService.queueAlbum(song.file.substring(0, song.file.lastIndexOf('/')));
  }

  const onSongAdd = (song: any) => {
    setSnackMsg('Canción agregada!');
    setIsSnackOpen(true);
    socketService.queueSong(song.file);
  }

  const onScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight;
    if (bottom) {
      setLimit(Math.min(limit + 40, artists.length));
    }
  }

  const onSearch = () => {
    const regexp = new RegExp(searchInput, 'gi');

    if (searchBy === 'artist') {
      setArtists(idbService.getArtists().filter((a: string) => a.search(regexp) !== -1));
    }
    else {
      setGenres(idbService.getGenres().filter((a: string) => a.search(regexp) !== -1));
    }
    setAlbums([]);
    setSongsAll([]);
    setSongs([]);    
  }

  const onClean = () => {
    setSearchInput('');
    if (searchBy === 'artist') {
      setArtists(idbService.getArtists());
    }
    else {
      setGenres(idbService.getGenres());
    }    
    setAlbums([]);
    setSongsAll([]);
    setSongs([]); 
  }

  const onCloseSnack = () => {
    setIsSnackOpen(false);
  }

  return (
    <div className='search'>
      <Snackbar
        anchorOrigin= {{
            horizontal: 'right',
            vertical:'bottom'
        }}
        open={isSnackOpen}
        autoHideDuration={6000} 
        onClose={onCloseSnack} 
        message={snackMsg}
      />

      <Paper className='form'>
        <FormControl variant="outlined" className='searchBy'>
          <InputLabel>Buscar por</InputLabel>
          <Select
              value={searchBy}
              onChange={onSearchTypeChange}
              label='Buscar por'
            >
              <MenuItem value={'artist'}>Artist</MenuItem>
              <MenuItem value={'genre'}>Genre</MenuItem>
          </Select>
        </FormControl>

        <div className='input'>
          <Divider orientation='vertical' />
          <InputBase
            className='inputBase'
            placeholder="Escribí para buscar..."
            value={searchInput}
            onChange={onSearchChange}
          />          
        </div>

        <div className='buttons'>
          <Divider orientation='vertical' />

          <div className='icons'>
            <IconButton
              title='Buscar'
              className='button'
              color='primary'
              edge="end"
              onClick={onSearch}
            >
              <SearchIcon />
            </IconButton>

            <IconButton
              title='Limpiar'
              className='button'
              color='primary'
              edge="end"
              onClick={onClean}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </Paper>

      <br   />

      <div className='data'>
        {
          searchBy === 'artist' &&
          <Paper className='artists' onScroll={onScroll}>
            <h4 className='subtitle'>Artists</h4>
            <List className='list'>
                {
                  artists.slice(0, limit).map((artist: any) => (
                  <ListItem button key={artist} onClick={() => onSelect('artist', artist)}>
                    <ListItemText primary={artist} />
                  </ListItem>
                  ))
                }
              </List>
          </Paper>
        }

        {
          searchBy === 'genre' &&
          <Paper className='genres' onScroll={onScroll}>
            <h4 className='subtitle'>Genres</h4>
            <List className='list'>
                {
                  genres.slice(0, limit).map((genre: any) => (
                    <ListItem button key={genre} onClick={() => onSelect('genre', genre)}>
                      <ListItemText primary={genre} />
                    </ListItem>
                  ))
                }
              </List>
          </Paper>
        }

        {
          albums.length > 0 &&
          <Paper className='albums' ref={refAlbums}>
            <h4 className='subtitle'>Albums</h4>
            <List className='list'>
                {
                  albums.map((album: any) => (
                  <ListItem button key={album} onClick={() => onSelectAlbum(album)}>
                    <ListItemText primary={album} />
                    <ListItemSecondaryAction onClick={() => onAlbumAdd(album)}>
                      <IconButton edge="end" aria-label="delete">
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  ))
                }
              </List>
          </Paper>
        }

        {
          songs.length > 0 &&
          <Paper className='songs' ref={refSongs}>
            <h4 className='subtitle'>Songs</h4>
            <List className='list'>
                {
                  songs.map((song: any) => (
                  <ListItem key={song.id}>
                    <ListItemText primary={song.title} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => onSongAdd(song)}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </ListItemSecondaryAction>                    
                  </ListItem>
                  ))
                }
              </List>
          </Paper>
        }
      </div>
    </div>
  )
}