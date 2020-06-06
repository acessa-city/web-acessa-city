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

  const [reportStatus, setReportStatus] = useState([]);
  const [denunciations, setDenunciations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [denunciationsSlect, setDenunciationsSelect] = useState([]);
  const [coodenadores, setCoordenadores] = useState([]);
  const [statusProgressDenunciation, setStatusProgressDenunciation] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');


  const [user, setUser] = useState({
    userId: ''
  })


  React.useEffect(() => {

  }, [])


  // Listar os dados  na tela
  const listDenunciations = () => {
    /*Passar o ID do usuário PRIMEIRO GET DE DENUNCIAS*/
    API.get('/report?userId=8d4e6519-f440-4272-9c88-45d04f7f447e'
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
    API.get(`/report?userId=8d4e6519-f440-4272-9c88-45d04f7f447e${stringFiltro}`,
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

  // Atualizar os dados na tela
  useEffect(() => {
    listStatus();
    listDenunciations();
    listCategory();
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
    </div>
  );
};

export default HistoricReport;
