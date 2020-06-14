import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { CategoryTable } from './components';
import { CategoryToolbar } from './components';

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
} from '@material-ui/core';

import API from '../../../utils/API';
import firebase from 'firebase/app'

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

const CategoryList = () => {
  const classes = useStyles();


  const [categories, setCategories] = useState([]);
  const [categoriesSlect, setCategoriesSelect] = useState([]);


  //Fitrar categoria
  const filter = (id) => {
    //console.log("id categoria", id);
    API.get(`/category/${id.category}`
    ).then(response => {
      const filterCategory = response.data;
      const categorias = [];
      categorias.push(filterCategory);
      setCategories(categorias)
    }).catch(erro => {
      console.log(erro);
    })
  }


  ///Lista de categorias
  ///Listar os dados  na tela co comentarios
  const listCategory = () => {
    setOpenValidador(true)
    API.get('/category'
    ).then(response => {
      setOpenValidador(false)
      const listCategory2 = response.data;
      setCategories(listCategory2);
      setCategoriesSelect(listCategory2)
    }).catch(erro => {
      console.log(erro);
    })
  }

  const filterLimpar = (categorias) => {
    setCategories(categorias)
  }

  const editCategory = (edit) => {
    const newCategory = {
      id: edit.categories.id,
      name: edit.categories.name
    }
    API.put(`/category/${edit.categories.id}`, newCategory
    ).then(response => {
      setErrors([
        "Categoria alterada com sucesso!"
      ])
      setErrorsStatus(true)
      setTimeout(() => {
        setErrors([]);
      }, 1000);
      listCategory();
    }).catch(erro => {
      console.log(erro);
    })
  }

  ///Cadastrar categoria
  const newCategory = (name) => {
    API.post('/category/', name
    ).then(response => {
      setErrors([
        "Categoria criada com sucesso!"
      ])
      setErrorsStatus(true)
      setTimeout(() => {
        setErrors([]);
      }, 1000);
      listCategory();
    }).catch(erro => {
      console.log(erro);
    })

  }

  const deleteCategory = (category) => {
    console.log("aqui o que tem",category)
  API.delete(`/category/${category.categories.id}`, category
  ).then(response => {
    setErrors([
      "Categoria deletada com sucesso!"
    ])
    setErrorsStatus(true)
    setTimeout(() => {
      setErrors([]);
    }, 1000);
    listCategory();
  }).catch(erro => {
    console.log(erro);
  })

}


// Atualizar os dados na tela
useEffect(() => {
  listCategory();
}, []);



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
    <CategoryToolbar categoriesSlect={categoriesSlect} filter={filter} filterLimpar={filterLimpar} newCategory={newCategory} />
    <div className={classes.content}>
      <CategoryTable categories={categories} editCategory={editCategory} deleteCategory={deleteCategory}/>
    </div>
    <Snackbar open={errors.length} onClick={handleSnackClick} >
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

export default CategoryList;
