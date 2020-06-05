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
    API.get('/report'
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

    console.log("filtro aqui" + JSON.stringify(filtro))
    API.get(`/report?status=96afa0df-8ad9-4a44-a726-70582b7bd010${stringFiltro}`,
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
    API.get('/category'
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
      filter={filter} 
      filterAprove={filterAprove}
      reportStatus={reportStatus}
       />
      <div className={classes.content}>
        <DenunciationsTable statusProgressDenunciation={statusProgressDenunciation} denunciations={denunciations}/>
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
