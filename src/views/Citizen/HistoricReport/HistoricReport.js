import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';

import { DenunciationsToolbar, DenunciationsTable } from './components';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';

import API from '../../../utils/API';
import firebase from 'firebase/app'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const HistoricReport = () => {
  const classes = useStyles();

  /*  const [user, setUser] = useState({
     userId:''
   }) */
  const [user, setUser] = useState([])
  const [reportStatus, setReportStatus] = useState([]);
  const [denunciations, setDenunciations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [denunciationsSlect, setDenunciationsSelect] = useState([]);
  const [coodenadores, setCoordenadores] = useState([]);
  const [statusProgressDenunciation, setStatusProgressDenunciation] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Listar os dados  na tela
  const listDenunciations = () => {
    API.get(`/report?userId=${user.userId}`
      /*  API.get(`/report?userId=1f6cc301-79a8-41bc-9e54-8bbe236efdb3` */
    ).then(response => {
      const listDenunciations2 = response.data;
      console.log(listDenunciations2);
      setDenunciations(listDenunciations2);
      setDenunciationsSelect(listDenunciations2);
    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }

  //Fitrar Denuncias
  const filter = (filtro) => {
    let stringFiltro = ''
    if (filtro.category) {
      stringFiltro += '&category=' + filtro.category
    }

    if (filtro.street) {
      stringFiltro += '&street=' + filtro.street
    }

    if (filtro.neighborhood) {
      stringFiltro += '&neighborhood=' + filtro.neighborhood
    }

    if (filtro.status) {
      stringFiltro += '&status=' + filtro.status
    }
    /* PASSAR O STATUS POR MEIO DE UMA VARIAVEL */
    console.log("filtro aqui" + JSON.stringify(filtro))
    /*Passar o ID do usuário*/
    API.get(`/report?userId=${user.userId}${stringFiltro}`,
    ).then(response => {
      const filterDenunciation = response.data;
      setDenunciations(filterDenunciation);
      setMensagem('Filtro realizado com sucesso!');
      setOpenDialog(true);
    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }

  //filtrar Aprovados
  const filterAprove = (aprove) => {
    setStatusProgressDenunciation(aprove.statusProgress) //manar status se é denuncian ão aprovadas ou aprovaas
    API.get(`/report?status=${aprove.id}`,
    ).then(response => {
      const filterAprove2 = response.data;
      setDenunciations(filterAprove2);
    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }

  ///Lista de categorias
  const listCategory = () => {
    API.get('/category'
    ).then(response => {
      const listCategory2 = response.data;
      setCategories(listCategory2);
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + JSON.stringify(categories));
    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }

  ///Lista de status
  const listStatus = () => {
    API.get('/report-status'
    ).then(response => {
      const reportStatus1 = response.data;
      setReportStatus(reportStatus1);
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + JSON.stringify(reportStatus));
    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }

  function onChange(firebaseUser) {
    if (firebaseUser) {
      firebaseUser.getIdTokenResult().then((token) => {
        const claims = token.claims;
        setUser({
          ...user,
          userId: claims.app_user_id
        })
      })
    } else {
      // No user is signed in.
    }
  }
  const monstrarId = () => {
    console.log("MEU ID"+ user.userId)
  }
  // Atualizar os dados na tela
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    listStatus();
    listCategory();
    listDenunciations(user.userId);
    monstrarId();
  }, []);



  return (
    <div className={classes.root}>
      {/* <DenunciationsToolbar save={save} /> */}
      <DenunciationsToolbar
        denunciationsSlect={denunciationsSlect}
        categories={categories}
        reportStatus={reportStatus}
        filter={filter}
        filterAprove={filterAprove}
      />
      <div className={classes.content}>
        <DenunciationsTable statusProgressDenunciation={statusProgressDenunciation} denunciations={denunciations} />
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
      <Button onClick={monstrarId}>Mostrar id</Button>
    </div>
  );
};

export default HistoricReport;
