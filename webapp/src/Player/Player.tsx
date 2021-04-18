import React from 'react';
import {
  Paper,
  IconButton,
  Slider
} from '@material-ui/core';
import './Player.css';
import { Logo } from '../Logo/Logo';
import { Song } from '../models';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import config from '../config';

export interface PlayerProps {
  song: Song;
}

export const Player = ({ song }: PlayerProps) => {
  const audioRef: any = React.useRef();
  const [mute, setMute] = React.useState<boolean>(false);
  const [playing, setPlaying] = React.useState<boolean>(false);
  const [volumen, setVolumen] = React.useState<number>(100);
  const [lastVolumen, setLastVolumen] = React.useState<number>(100);

  const onPlay = () => {
    audioRef.current.play();
    setPlaying(true);
  }

  const onVolumeChange = (event: any, newVol: number | number[]) => {
    audioRef.current.volume = newVol as number / 100;
    setVolumen(newVol as number);

    if (newVol === 0) {
      setMute(true);
    }
    else if (mute) {
      setMute(false);
    }
  }

  const onMute = () => {
    const newMute: boolean = !mute;

    if (newMute) {
      audioRef.current.volume = 0;
      setLastVolumen(volumen);
      setVolumen(0);      
    } else {
      audioRef.current.volume = lastVolumen / 100;
      setVolumen(lastVolumen);
    }

    setMute(newMute);
  }

  return (
    <Paper className='player'>
      {
        !song &&
        <div>Radio is on vacations... we'll comeback soon!</div>
      }

      {
        song &&
        <React.Fragment>
          <div className='logo'>
            <Logo  />
          </div>
          <div className='info'>
            <ul>
              <li>Title: { song.title }</li>
              <li>Artist: { song.artist }</li>
              <li>Album: { song.album }</li>
              <li>Year: { song.date }</li>
            </ul>
          </div> 

          <div className='audio'>
            <IconButton
              className='playButton'
              color='primary'
              edge="end"
              disabled={!song || playing}
              onClick={onPlay}
            >
              <PlayCircleOutlineIcon />
            </IconButton>

            <IconButton
              className='muteButton'
              color='primary'
              edge="end"
              disabled={!song}
              onClick={onMute}
            >
              {
                !mute && <VolumeUpIcon />
              }
              {
                mute && <VolumeOffIcon />
              }
            </IconButton>

            <Slider className='slider' value={volumen} onChange={onVolumeChange} />

            <audio ref={audioRef} src={`http://${config[process.env].mpd}`}></audio>
          </div>
        </React.Fragment>
      }
    </Paper>
  )
}