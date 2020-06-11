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


  const [categories, setCategories] = useState([]);
  const [categoriesSlect, setCategoriesSelect] = useState([]);


 //Fitrar Denuncias
  const filter = (id) =>{
    
    API.get(`/category/${id.category}`
    ).then(response => {
      const filterCategory = response.data;
      setCategories(filterCategory)
       }).catch(erro => {
        console.log(erro);
      })
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
      })
  }
  
  const filterLimpar =(categorias) => {

    console.log("Filtro limpar", categorias)
     setCategories(categorias)
  }


  // Atualizar os dados na tela
  useEffect(() => {
      listCategory();
    },[]);


  return (
    <div className={classes.root}>
      {/* <DenunciationsToolbar save={save} /> */}
       <CategoryToolbar categoriesSlect={categoriesSlect}  filter={filter} filterLimpar={filterLimpar}/>
      <div className={classes.content}>
        <CategoryTable categories={categories} />
      </div>
    </div>
  );
};

export default CategoryList;
