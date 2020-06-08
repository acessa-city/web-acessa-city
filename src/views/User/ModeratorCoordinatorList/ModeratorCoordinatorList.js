import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { SnackbarProvider, useSnackbar } from 'notistack';
import moment from 'moment';

import { ModeratorCoordinatorToolbar, ModeratorCoordinatorTable } from './components';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Backdrop,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';

import API from '../../../utils/API';
import currentUser from 'utils/AppUser';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModeratorCoordinatorList = () => {
  const classes = useStyles();

  ////Modal de errro

  const [errors, setErrors] = useState([]);
  const [errorsStatus, setErrorsStatus] = useState('');
  const [users, setUsers] = useState([]);
  const [usersBackup, setUsersBackup] = useState([]);
  const [openValidador, setOpenValidador] = React.useState(false);
  const handleCloseValidador = () => {
    setOpenValidador(false);
  };


  const handleSnackClick = () => {
    setErrors([]);
  }

  // CHAMAR API DE USUARIOS
  const listUser = () => {
    currentUser().then((result) => {
      
      setOpenValidador(true)
      API.get(`/city-hall/${result.cityHallId}/users`)
        .then(response => {
          setOpenValidador(false)
          const userList = response.data;
          setUsers(userList)
          setUsersBackup(userList)
        })
        .catch((aError) => {
          if (aError.response.status == 400) {
            setOpenValidador(false)
            console.log(aError.response.data.errors)
            setErrors(aError.response.data.errors)

            setTimeout(() => {
              setErrors([]);
            }, 10000);
          }
          else if (aError.response.status == 500) {
            setErrors([
              "Erro no servidor"
            ])

            setTimeout(() => {
              setErrors([]);
            }, 10000);
          }
          setErrorsStatus(false)
          setOpenValidador(false)
        })

    })
  }

  // FILTRAR USUÀRIOS
  const filter = (userFilter) =>{
    setOpenValidador(true)
      const listaFiltrada = usersBackup.filter(function(user){
       
        let retornaUsuario = true
        if(userFilter.roles){
          retornaUsuario = user.roles[0] == userFilter.roles
        }

        if(userFilter.firstName){
          retornaUsuario = retornaUsuario && user.firstName.toUpperCase().includes(userFilter.firstName.toUpperCase());
        }

        if(userFilter.email){
          retornaUsuario = retornaUsuario && user.email.toUpperCase().includes(userFilter.email.toUpperCase());
        }
        return retornaUsuario ;
       
      })

      if (listaFiltrada.length > 0) {
        setUsers(listaFiltrada);
        setOpenValidador(false)
      } else {
        console.log("não encontreiii")
        setOpenValidador(false)
        setUsers(listaFiltrada);
        setErrors(["Nenhum resultado encontrado!"])
        setErrorsStatus(true)
        setTimeout(() => {
          setErrors([]);
        }, 10000);
      }
  }


  const limpar = () =>{  
    setUsers(usersBackup)
  }

  const onCreateUser = (user) =>{
      if(user){
        listUser();
      }
  }

  // Atualizar os dados na tela
  React.useEffect(() => {
    listUser();
  }, []);


  const erros = () => {
    if (errorsStatus == true) {
      return (
        <div>
          {errors.map(error => (
            <SnackbarContent
              style={{
                background: 'green',
              }}
              message={<h3>{error}</h3>} />
          ))}
        </div>)
    } else {
      return (
        <div>
          {errors.map(error => (
            <SnackbarContent autoHideDuration={1}
              style={{
                background: 'red',
              }}
              message={<h3>{error}</h3>}
            />
          ))}
        </div>)
    }
  }

  return (
    <div className={classes.root}>
      {/* <DenunciationsToolbar save={save} /> */}
      <ModeratorCoordinatorToolbar  filter={filter} onClearFilter={limpar} onCreateUser={onCreateUser}/>
      <div className={classes.content}>
        <ModeratorCoordinatorTable users={users} />
      </div>

      <Snackbar open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
      <Backdrop className={classes.backdrop} open={openValidador} onClick={handleCloseValidador}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>
  );
};

export default ModeratorCoordinatorList;
