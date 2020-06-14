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
    console.log("filtrar type",userFilter.roles)
      const listaFiltrada = usersBackup.filter(function(user){
       
        let retornaUsuario = true
        if(userFilter.roles){
          retornaUsuario = retornaUsuario && user.roles.includes(userFilter.roles.toLowerCase());
        }

        if(userFilter.firstName){
          retornaUsuario = retornaUsuario && user.firstName.toUpperCase().includes(userFilter.firstName.toUpperCase());
        }

        if(userFilter.email){
          retornaUsuario = retornaUsuario && user.email.toUpperCase().includes(userFilter.email.toUpperCase());
        }
        return retornaUsuario ;
       
      })

      console.log("filtrouuuuuuu",listaFiltrada)

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
        }, 5000);
      }
  }

  //Deletar Usuário
  const deleteUsuario = (user) => {
    console.log("aqui o que tem", user)
    API.delete(`/user/${user.categories.id}`
    ).then(response => {
      setErrors([
        "Usuário " + user.categories.firstName + " foi deletado com sucesso."
      ])
      setErrorsStatus2(true)
      setTimeout(() => {
        setErrors([]);
      }, 1000);
      listUser();
    }).catch(erro => {
      console.log(erro);
    })
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

  const [errorsStatus2, setErrorsStatus2] = useState('');
  const erros = () => {
    if (errorsStatus == true) {
      return (
        <div>
          {errors.map(error => (
            <SnackbarContent
              style={{
                background: 'orange',
                textAlign: 'center'
              }}
              message={<h3>{error}</h3>} />
          ))}
        </div>)
    }else if (errorsStatus2 == true) {
      return (
        <div>
          {errors.map(error => (
            <SnackbarContent
              style={{
                background: 'green',
                textAlign: 'center'
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
                textAlign: 'center'
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
        <ModeratorCoordinatorTable users={users} deleteUsuario={deleteUsuario} />
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
