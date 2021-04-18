import React from 'react';
import './Login.css';
import {
  Paper,
  IconButton,
  InputBase,
  Divider
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

export interface LoginProps {
  onSaveUser: (username: string) => void;
}

export const Login = ({ onSaveUser } : LoginProps) => {
  const [username, setUsername] = React.useState<string>('');

  const isBtnDisabled: boolean = username.length === 0;

  const onChange = (e: any) => {
    setUsername(e.target.value);
  }

  return (
    <div className='login'>
      <h2>Bienvenido!</h2>

      <Paper className="textfield">
        <InputBase
          className='input'
          placeholder="Por favor, ingresá tu usuario"
          value={username}
          onChange={onChange}
        />
        <Divider className='divider' orientation="vertical" />
        <IconButton
          className='button'
          color='primary'
          edge="end"
          disabled={isBtnDisabled}
          onClick={() => onSaveUser(username)}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </div>
  );
}