import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

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

const DenunciationList = () => {
  const classes = useStyles();

  const [denunciations, setDenunciations] = useState([]);
  const [denunciationsSlect, setDenunciationsSelect] = useState([]);
  const [coodenadores, setCoordenadores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusDenunciation, setStatusDenunciation] = useState('48cf5f0f-40c9-4a79-9627-6fd22018f72c');
  const [mensagem, setMensagem] = useState('');


  //Enviar coodenador 
  const envioCoordenador = (update) => {
    console.log("Update", update);
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
        setErrors(["Denúncia Enviada para o coordenador com sucesso!"])
        setErrorsStatus2(true)
        setTimeout(() => {
          setErrors([]);
        }, 2000);

      }).catch((aError) => {
      })
      console.log(newCoodenador)
      //setDenunciations(  [...denunciations, newDenunciation])
    }).catch((aError) => {
     
    })
  }


  //Negar denuncia
  const envioDeny = (deny) => {

    deny.userId = user.id;
    console.log("deny" + JSON.stringify(deny))
    API.post(`/report/${deny.denunciationsId}/status-update`, deny

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
  })


  // function onChange(firebaseUser) {
  //   if (firebaseUser) {
  //     firebaseUser.getIdTokenResult().then((token) => {
  //       const claims = token.claims;
  //       setUser({
  //         ...user,
  //         id: claims.app_user_id
  //       })
  //       listCoodenador(claims.app_user_id);
  //     })
  //   } else {
  //     // No user is signed in.
  //   }
  // }

  // React.useEffect(() => {
  //   const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
  //   return () => unsubscribe()
  // }, [])




  // Listar coordenadores
  const listCoodenador = (userId) => {
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

  console.log("Aquiiisddsfsdfdffdf",coodenadores);


  // Listar os dados  na tela
  const listDenunciations = (cityId) => {
    setOpenValidador(true)
    API.get('/report?status=48cf5f0f-40c9-4a79-9627-6fd22018f72c&city=' + cityId
    ).then(response => {
      setOpenValidador(false)
      if (errorsStatus2 == true) {

      }
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
      stringFiltro += '&status=' + '48cf5f0f-40c9-4a79-9627-6fd22018f72c'
    }


    setOpenValidador(true)
    API.get(`/report?${stringFiltro}`,
    ).then(response => {

      setStatusDenunciation(filtro.status);

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
        }, 10000);

      }
    }).catch(erro => {
      console.log(erro);
    })

  }




  const filterLimpar = (filtroAprovadas) => {

    setDenunciations(filtroAprovadas)
    window.location.reload(true);

  }

  ///Lista de categorias
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

  // Atualizar os dados na tela
  useEffect(() => {
    setOpenValidador(true)
    currentUser().then(result => {
      setUser(result)      
      listDenunciations(result.cityHall.city.id);
      listCategory();
      listCoodenador(result.id);
      setOpenValidador(false)    
    })    
  }, []);

  const getCity = () =>{
    return user.cityHall.city.id
  }

  const atualizarTela =() =>{
    listDenunciations(user.cityHall.city.id);
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
      <DenunciationsToolbar cityId={getCity} denunciationsSlect={denunciationsSlect} categories={categories} filter={filter} filterLimpar={filterLimpar} />
      <div className={classes.content}>
        <DenunciationsTable statusDenunciation={statusDenunciation} denunciations={denunciations} coodenadores={coodenadores} envioCoordenador={envioCoordenador} envioDeny={envioDeny} atualizarTela={atualizarTela} />
      </div>

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

export default DenunciationList;
