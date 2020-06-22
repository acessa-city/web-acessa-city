import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';

import { DenunciationsToolbar, DenunciationsTable } from './components';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  Backdrop
} from '@material-ui/core';

import API from '../../../utils/API';
import firebase from 'firebase/app'
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

const DenunciationListCoordinator = () => {
  const classes = useStyles();

  const [denunciations, setDenunciations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [denunciationsSlect, setDenunciationsSelect] = useState([]);
  const [coodenadores, setCoordenadores] = useState([]);
  const [statusProgressDenunciation, setStatusProgressDenunciation] = useState('96afa0df-8ad9-4a44-a726-70582b7bd010');
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');





  //Enviar coodenador
  //Alt    
  const envioCoordenador = (update) => {

    API.post(`/report/${update.reportId}/coordinator-update`, update
    ).then(response => {
      const newCoodenador = response.data;
      const param = {
        userId: user.id,
        reportStatusId: '96afa0df-8ad9-4a44-a726-70582b7bd010',
        description: 'Aprovação de Moderador'
      }
      API.post(`/report/${update.reportId}/status-update`, param

      ).then(responseStatus => {

        listDenunciations(user.cityHall.city.id);
        setMensagem('Denuncia enviada para o coodenador com sucesso!');
        setOpenDialog(true);

      }).catch(erro => {

      })
      console.log(newCoodenador)
      //setDenunciations(  [...denunciations, newDenunciation])
    }).catch(erro => {
      console.log(erro);
    })
  }


    //Negar denuncia
    const envioDeny = (deny) => {
     

      const denyJson = {
        userId: user.id,
        reportId: deny.reportId,
        reportStatusId: deny.reportStatusId,
        description: deny.description,
      }

      console.log("deny" + JSON.stringify(denyJson))
 
      API.post(`/report/${deny.reportId}/status-update`, denyJson
  
      ).then(response => {
        listDenunciations(user.cityHall.city.id);
        setErrors(["Denúncia negada com sucesso!"])
        setErrorsStatus2(true)
        setTimeout(() => {
          setErrors([]);
        }, 2000);
  
      }).catch(erro => {
        console.log(erro);
      })
    }
  

  const [user, setUser] = useState({
    userId: ''
  })

  // Listar coordenadores
  const listCoodenador = (userId) => {
    console.log("testttttttt" + userId);
    API.get(`/user/${userId}/coordinators`
    ).then(response => {
      const listCoodenadores = response.data;
      console.log("cooodenadorrr" + JSON.stringify(listCoodenadores))
      setCoordenadores(listCoodenadores);
    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }


  // Listar os dados  na tela
  const listDenunciations = (cityId) => {
    setOpenValidador(true)

   if(finish){
     console.log("entreii aqui")
   }


    API.get('/report?status=96afa0df-8ad9-4a44-a726-70582b7bd010&city=' + cityId
    ).then(response => {
      setOpenValidador(false)
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
    let stringFiltro = 'city='+user.cityHall.city.id;
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
    if (filtro.creationDate) {
      stringFiltro += '&date=' + filtro.creationDate
    }    
    if (!filtro.status) {
      stringFiltro += '&status=' + '96afa0df-8ad9-4a44-a726-70582b7bd010'
    }

   setOpenValidador(true)
    API.get(`/report?${stringFiltro}`,
    ).then(response => {

      setStatusProgressDenunciation(filtro.status);

      if (response.data.length > 0) {
        setOpenValidador(false)
        const filterDenunciation = response.data;
        setDenunciations(filterDenunciation)

      } else {
        setOpenValidador(false)
        const filterDenunciation = response.data;
        setDenunciations(filterDenunciation)
        setErrors(["Nenhum resultado encontrado!"])
        setErrorsStatus(true)
        setTimeout(() => {
          setErrors([]);
        }, 2000);
        
      }

    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);

    })
  }

  //filtrar Aprovados
  const filterAprove = (aprove) => {
  
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

  /////Envio de em progresso
  const envioProgress = (progress) => {

    //console.log("user", user.userId);
    // console.log("progress", JSON.stringify(progress))
    var dataformatada = moment(progress.data).format('MM/DD/YYYY');

    const progressJson = {
      reportId: progress.denunciationsId,
      userId: user.id,
      description: progress.description,
      startDate: dataformatada
    }
    console.log("progress", JSON.stringify(progressJson))
    API.post(`/report/start-progress`, progressJson
    ).then(response => {
      listDenunciations(user.cityHall.city.id);
      setErrors(["Denúncia está em progresso!"])
      setErrorsStatus2(true)
      setTimeout(() => {
        setErrors([]);
      }, 2000);

    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }


  const filterLimpar = (filtroAprovadas)=>{

    setDenunciations(filtroAprovadas)

  }


  ///Lista de categorias
  ///Listar os dados  na tela co comentarios

  const listCategory = () => {
    API.get('/category'
    ).then(response => {
      const listCategory2 = response.data;
      setCategories(listCategory2);
    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }

  const[finish, setFinish] = useState(false);
  //encerrar dnunucias
  const envioFinish = (finish) => {

    var endDate = moment(finish.endDate).format('MM/DD/YYYY');

    const endJson = {
      reportId: finish.reportId,
      userId: user.userId,
      description: finish.description,
      endDate: endDate
    }

    API.post(`/report/end-progress`, endJson
    ).then(response => {
      listDenunciations(user.cityHall.city.id);
      setErrors(["Denúncia Encerrada com sucesso!"])
      setFinish(true)
      setErrorsStatus2(true)
      setTimeout(() => {
        setErrors([]);
      }, 2000);

    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
  }

  useEffect(() => {
    setOpenValidador(true)    
    currentUser().then(result => {
      setUser(result)        
      listDenunciations(result.cityHall.city.id);
      listCategory();
      setOpenValidador(false)
    })    
  }, []);

  const getCity = () =>{
    return user.cityHall.city.id
  }

  /////Errros///////
  const handleSnackClick = () => {
    setErrors([]);
  }
  const [errors, setErrors] = useState([]);
  const [errorsStatus, setErrorsStatus] = useState('');
  const [errorsStatus2, setErrorsStatus2] = useState('');
  const [openValidador, setOpenValidador] = React.useState(false);
  const handleCloseValidador = () => {
    setOpenValidador(false);
  };

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
      <DenunciationsToolbar  cityId={getCity} denunciationsSlect={denunciationsSlect} categories={categories} filter={filter} filterAprove={filterAprove} filterLimpar={filterLimpar}/>
      <div className={classes.content}>
        <DenunciationsTable statusProgressDenunciation={statusProgressDenunciation} denunciations={denunciations} coodenadores={coodenadores} envioCoordenador={envioCoordenador} envioDeny={envioDeny} envioProgress={envioProgress} envioFinish={envioFinish} />
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

      <Snackbar open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
      <Backdrop
        style={{ zIndex: 99999999 }}
        className={classes.backdrop} open={openValidador} onClick={handleCloseValidador}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default DenunciationListCoordinator;
