import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
  Input,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CardHeader,
  TablePagination,
  Box,
  Paper,
  Rows,
  TableContainer,
  Divider
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SearchIcon from '@material-ui/icons/Search';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import API from '../../../../../utils/API';
import AddIcon from '@material-ui/icons/Add';

// import { SearchInput } from 'components';  //chamar botão de pesquisa

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    overflow: 'scroll'

  }, paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    marginRight: 10,
    marginTop: 10,
  },
  //FIM modal
  Card: {
    marginTop: 50
  }

}));


const CategoryToolbar = props => {
  const { className, categoriesSlect, ...rest } = props;

  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [denunciationCategory, setDenunciationCategory] = useState('');
  const [denunciationStreet, setDenunciationStreet] = useState('');
  const [denunciationNeighborhood, setDenunciationNeighborhood] = useState('');
  const [denunciationData, setDenunciationData] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const classes = useStyles();


  ////cadastrar
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [values2, setValues2] = useState({
    name: '',
  });

  const handleChangecadastrar = (event) => {
    setValues2({
      ...values2,
      [event.target.name]: event.target.value
    });
  };

  const submit2 = (event) => {
    event.preventDefault();

    const cadastrar = {
      name: values2.name
    }
    props.newCategory(cadastrar);
    setOpen(false);
    limparForm2();

  }

  const limparForm2 = () => {
    setValues2({
      name: '',
    })
  }


  //filtrar
  const [values, setValues] = useState({
    category: '',
  });

  const handleChangeFilter = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };


  const submit = (event) => {
    event.preventDefault();
    //Filtro geral
    if (values.category == '') {

      API.get('/category'
      ).then(response => {

        const listCategory = response.data;
        props.filterLimpar(listCategory);
      }).catch(erro => {
        console.log(erro);
        setMensagem('Ocorreu um erro', erro);
        setOpenDialog(true);
      })

    } else {
      const filtro = {
        category: values.category
      }
      props.filter(filtro);
    }
  }


  const filterLimpar = (event) => {
    event.preventDefault();

    API.get('/category'
    ).then(response => {

      const listCategory = response.data;
      props.filterLimpar(listCategory);
    }).catch(erro => {
      console.log(erro);
      setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true);
    })
    limparForm();
  }

  const limparForm = () => {
    setValues({
      category: '',
    })
  }

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.root}>

        <Grid container spacing={1}>

          {/* <Grid item xs={12} sm={2}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="age-native-simple">Categoria</InputLabel>
              <Select
                native
                value={values.category}
                onChange={handleChangeFilter}
                inputProps={{
                  name: 'category',
                }}
              >
                <option aria-label="None" value="" />
                {categoriesSlect.map(category => {
                  return (
                    <option value={category.id}>{category.name}</option>
                  )
                })
                }
              </Select>
            </FormControl>
          </Grid> */}

          <Grid item xs={12} sm={3}>
            <div>
              <TextField
                fullWidth
                id="Categoria"
                label="Categoria"
                value={values.category}
                onChange={handleChangeFilter}
                inputProps={{
                  name: 'category',
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={submit} variant="contained" color="secondary">Filtrar</Button>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={filterLimpar} variant="contained" >Limpar</Button>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <div
              style={{
                float: 'right',
              }}
            >
              <FormControl margin="dense">
                <Button
                  onClick={handleOpen}
                  style={{
                    background: '#1b5e20',
                  }}
                  variant="contained" color="secondary">  <AddIcon />Cadastrar</Button>
              </FormControl>
            </div>
          </Grid>
        </Grid>

      </div >

      {open &&

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}

        >
          {/* Modal da Dereita */}
          <Fade
           style={{
            overflow: 'scroll',
            height: '50%'
          }}
          
          in={open}>
            <div className={classes.paper}>
              <div style={{
                textAlign: 'right'
              }}>

                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <Card className={classes.root}
                style={{
                  textAlign: 'center',
                  width: 500,
                  maxHeight: 500,
                }}>

                <CardContent>
                  <div>
                    <CardHeader title="Categoria" />
                    <div>
                      <TextField
                        fullWidth
                        helperText="Informe a categoria"
                        label="Titulo da categoria"
                        margin="dense"
                        name="name"
                        onChange={handleChangecadastrar}
                        required
                        value={values2.name}
                        variant="outlined"
                      />
                    </div>
                  </div>
                </CardContent>
                <Divider />
                <CardActions>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    xl={12}
                    xs={12}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ background: '#1b5e20', float: 'right' }}
                      onClick={submit2}
                    >

                      Cadastrar
                             </Button>
                  </Grid>
                </CardActions>
              </Card>
            </div>
          </Fade>
        </Modal>
        // {/* FIM Abri Modal envio coordenador  */}
      }
    </div >
  );
};

CategoryToolbar.propTypes = {
  className: PropTypes.string
};

export default CategoryToolbar;




