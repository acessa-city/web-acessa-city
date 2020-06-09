import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { CategoryTable } from './components';
import { CategoryToolbar } from './components';

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

const CategoryList = () => {
  const classes = useStyles();

  const [denunciations, setDenunciations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesSlect, setCategoriesSelect] = useState([]);
  const [coodenadores, setCoordenadores] = useState([]);
  const [statusProgressDenunciation, setStatusProgressDenunciation] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');


 
  

   //Enviar coodenador
   //Alt    
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
    API.get('/category'
    ).then(response => {
       const listDenunciations2 = response.data;
       console.log(listDenunciations2);
       setDenunciations(listDenunciations2);
       }).catch(erro => {
        console.log(erro);
        setMensagem('Ocorreu um erro', erro);
        setOpenDialog(true);
      })
  }

 //Fitrar Denuncias
  const filter = (id) =>{
    
    API.get(`/category/${id.category}`
    ).then(response => {
      const filterCategory = response.data;
      setCategories(filterCategory)
       }).catch(erro => {
        console.log(erro);
        setMensagem('Ocorreu um erro', erro);
        setOpenDialog(true);
      })
  }

  //filtrar Aprovados
  const filterAprove = (aprove) =>{
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

  /////Envio de em progresso
  const envioProgress = (progress) =>{
  
  console.log("Progresso" + JSON.stringify(progress))
  }


  ///Lista de categorias
   ///Listar os dados  na tela co comentarios

   const listCategory = () => {
    API.get('/category'
    ).then(response => {
       const listCategory2 = response.data;
       setCategories(listCategory2);
       setCategoriesSelect(listCategory2)
       }).catch(erro => {
        console.log(erro);
        setMensagem('Ocorreu um erro', erro);
        setOpenDialog(true);
      })
  }
  
  const filterLimpar =(categorias) => {

    console.log("Filtro limpar", categorias)
     setCategories(categorias)
  }




  //encerrar dnunucias
  const enviorEncerrar =(encerrar) => {
    console.log("filtro aqui ecerrado" + JSON.stringify(encerrar))
  }


  // Atualizar os dados na tela
  useEffect(() => {
      listDenunciations();
      listCategory();
    },[]);


  return (
    <div className={classes.root}>
      {/* <DenunciationsToolbar save={save} /> */}
       <CategoryToolbar categoriesSlect={categoriesSlect}  filter={filter} filterLimpar={filterLimpar}/>
      <div className={classes.content}>
        <CategoryTable categories={categories} />
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

export default CategoryList;
