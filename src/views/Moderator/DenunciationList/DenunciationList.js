import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { DenunciationsToolbar, DenunciationsTable } from './components';

import {
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Button
}from '@material-ui/core';

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

const DenunciationList = () => {
  const classes = useStyles();

  const [denunciations, setDenunciations] = useState([]);
  const [denunciationsSlect, setDenunciationsSelect] = useState([]);
  const [coodenadores, setCoordenadores] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');



   //Enviar coodenador 
  const envioCoordenador = (update) => {
      
    API.post(`/report/${update.reportId}/coordinator-update`,update
    ).then(response => {
        const newCoodenador = response.data;
        const param = {
              userId: user.id,
              reportStatusId: '96afa0df-8ad9-4a44-a726-70582b7bd010',
              description: 'Aprovação de Moderador'
        }
        API.post(`/report/${update.reportId}/status-update`, param

        ).then(responseStatus => {
            
          listDenunciations();
          setMensagem('Denuncia enviada para o coodenador com sucesso!');
          setOpenDialog(true);

        }).catch(erro =>{

        })
        console.log(newCoodenador)
       //setDenunciations(  [...denunciations, newDenunciation])
       }).catch(erro => {
        console.log(erro);
      })
  }


    //Negar denuncia
    const envioDeny = (deny) => {

         deny.userId = user.id;
         console.log("deny" + JSON.stringify(deny))
      API.post(`/report/${deny.denunciationsId}/status-update`, deny

      ).then(response => {
        listDenunciations();
        setMensagem('Denúncia negada!');
        setOpenDialog(true);
      
         }).catch(erro => {
          console.log(erro);
        })
    }

    const [user, setUser] = useState({
    })  
  

    function onChange(firebaseUser) {
      if (firebaseUser) {
        firebaseUser.getIdTokenResult().then((token) => {
          const claims = token.claims;
            setUser({
                ...user,
                id: claims.app_user_id
            })
            listCoodenador(claims.app_user_id);
        })
      } else {
          // No user is signed in.
      }
  }
  
    React.useEffect(() => {        
      const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
      return () => unsubscribe()
    }, [])   
  

  
    // Listar coordenadores
    const listCoodenador = (userId) => {
       console.log("testttttttt"+ userId);
      API.get(`/user/${userId}/coordinators`
      ).then(response => {
         const listCoodenadores = response.data;
         console.log("cooodenadorrr" +  JSON.stringify(listCoodenadores))
         setCoordenadores(listCoodenadores);
         }).catch(erro => {
          console.log(erro);
          setMensagem('Ocorreu um erro', erro);
          setOpenDialog(true);
        })
    }


  // Listar os dados  na tela
  const listDenunciations = () => {
    API.get('/report?status=48cf5f0f-40c9-4a79-9627-6fd22018f72c'
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
  const filter = (filtro) =>{
    API.get(`/report?category=${filtro.category}&street=${filtro.street}&neighborhood=${filtro.neighborhood}&creationDate=${filtro.creationDate}&status=${filtro.status}`,
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



  // Atualizar os dados na tela
  useEffect(() => {
      listDenunciations();
    },[]);


  return (
    <div className={classes.root}>
      {/* <DenunciationsToolbar save={save} /> */}
       <DenunciationsToolbar denunciationsSlect={denunciationsSlect}  filter={filter}/>
      <div className={classes.content}>
        <DenunciationsTable denunciations={denunciations} coodenadores={coodenadores} envioCoordenador={envioCoordenador}  envioDeny={envioDeny}/>
      </div>
      <Dialog open={openDialog} onClose={ e => setOpenDialog(false)}>
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

export default DenunciationList;
