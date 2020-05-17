import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { ProfileContent } from './components';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';

import API from '../../../utils/API';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const ProfileCoodinator = () => {
  const classes = useStyles();

  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const envioPassword = (password) => {
    console.log("senha recuperada:" , JSON.stringify(password));
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <ProfileContent envioPassword={envioPassword} />
      </div>
      <Dialog open={openDialog} onClose={e => setOpenDialog(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          {mensagem}
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfileCoodinator;
