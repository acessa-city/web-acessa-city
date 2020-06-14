import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { SnackbarProvider, useSnackbar } from 'notistack';
import moment from 'moment';

import { PrefecturesToolbar, PrefecturesTable } from './components';

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
// import currentUser from 'utils/AppUser';

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

const PrefecturesList = () => {
  const classes = useStyles();

  ////Modal de errro

  const [errors, setErrors] = useState([]);
  const [errorsStatus, setErrorsStatus] = useState('');
  const [prefectures, setPrefectures] = useState([]);
  const [prefecturesBackup, setPrefecturesBackup] = useState([]);
  const [openValidador, setOpenValidador] = React.useState(false);
  const handleCloseValidador = () => {
    setOpenValidador(false);
  };


  const handleSnackClick = () => {
    setErrors([]);
  }

  // CHAMAR API DE USUARIOS
  const listPrefectures = () => {
    setOpenValidador(true)
    API.get('/city-hall')
      .then(response => {
        setOpenValidador(false)
        const PrefecturesList = response.data;
        setPrefectures(PrefecturesList)
        setPrefecturesBackup(PrefecturesList)
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
  }

  // FILTRAR USUÀRIOS
  const filter = (prefectureFilter) => {

    //console.log("filtro", prefectureFilter.name)


    const listaFiltrada = prefecturesBackup.filter(function (prefecture) {

      let retornaPrefeitura = true
      if (prefectureFilter.name) {
        retornaPrefeitura = prefecture.name.toUpperCase().includes(prefectureFilter.name.toUpperCase());
      }

      if (prefectureFilter.cnpj) {
        retornaPrefeitura = retornaPrefeitura && prefecture.cnpj.toUpperCase().includes(prefectureFilter.cnpj.toUpperCase());
      }

      if (prefectureFilter.email) {
        retornaPrefeitura = retornaPrefeitura && prefecture.email.toUpperCase().includes(prefectureFilter.email.toUpperCase());
      }
      return retornaPrefeitura;
    })
    setOpenValidador(true)
    if (listaFiltrada == '') {
      setOpenValidador(false)
      setErrors(["Nenhum resultado encontrado!"])
      setPrefectures(listaFiltrada);
      setErrorsStatus(true)
      setTimeout(() => {
        setErrors([]);
      }, 2000);

    } else {
      setOpenValidador(false)
      setPrefectures(listaFiltrada);
    }

  }


  const limpar = () => {
    setPrefectures(prefecturesBackup)
  }

  const onCreatePrefecture = (prefecture) => {
    if (prefecture) {
      listPrefectures();
    }
  }

  ////Fechar Modal de Atualização
  const fimModal = (value) => {
    setOpenValidador(false)
    setErrors([
      "A prefeitura " + value.name + " foi altera com sucesso."
    ]);
    setErrorsStatus2(true)
    setTimeout(() => {
      setErrors([]);
    }, 2000);
    listPrefectures();
  }


  /////Deletar prefeitura
  const deletePrefecture = (userDelete) => {
    console.log("PREFEITURA AQUII II I I I I:", userDelete)
    setOpenValidador(true)
    API.delete(`/city-hall/${userDelete.categories.id}`)
      .then(response => {
        setOpenValidador(false)
        setErrors([
          "A prefeitura foi deletada com sucesso."
        ]);
        setErrorsStatus2(true)
        setTimeout(() => {
          setErrors([]);
        }, 2000);
        listPrefectures();
      }).catch(erro => {
        setOpenValidador(false)
        setErrors([
          "Não conseguimos deletar essa prefeitura."
        ]);
        setErrorsStatus(false)
        setTimeout(() => {
          setErrors([]);
        }, 2000);
      })
  }

  // Atualizar os dados na tela
  React.useEffect(() => {
    listPrefectures();
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
    } else if (errorsStatus2 == true) {
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


      <PrefecturesToolbar filter={filter} onClearFilter={limpar} onCreatePrefecture={onCreatePrefecture} />
      <div className={classes.content}>
        <PrefecturesTable prefectures={prefectures} fimModal={fimModal} deletePrefecture={deletePrefecture} />
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

export default PrefecturesList;