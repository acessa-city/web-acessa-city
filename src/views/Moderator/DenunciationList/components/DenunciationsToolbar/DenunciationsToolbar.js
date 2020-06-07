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
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SearchIcon from '@material-ui/icons/Search';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import API from '../../../../../utils/API';

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

  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },

}));


const DenunciationsToolbar = props => {
  const { className, denunciationsSlect, categories, ...rest } = props;

  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [reportStatusValue, setReportStatusValue] = useState('');
  const [denunciationCategory, setDenunciationCategory] = useState('');
  const [denunciationStreet, setDenunciationStreet] = useState('');
  const [denunciationNeighborhood, setDenunciationNeighborhood] = useState('');
  const [denunciationData, setDenunciationData] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [openValidador, setOpenValidador] = React.useState(false);
  const handleCloseValidador = () => {
    setOpenValidador(false);
  };

  const classes = useStyles();


  const [values, setValues] = useState({
    category: '',
    status: '',
    street: '',
    neighborhood: '',
    date: ''
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
    const filtro = {
      category: values.category,
      street: values.street,
      neighborhood: values.neighborhood,
      creationDate: values.date,
      status: values.status
    }
    props.filter(filtro);

  }


  const filterLimpar = (event) => {
    event.preventDefault();
    setOpenValidador(true)
    API.get('/report?status=48cf5f0f-40c9-4a79-9627-6fd22018f72c'
    ).then(response => {
      const listDenunciationsAprovadas = response.data;
      props.filterLimpar(listDenunciationsAprovadas);
      setOpenValidador(false)
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
      status: '',
      street: '',
      neighborhood: '',
      date: ''
    })
  }

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.root}>

        <Grid container spacing={1}>

          <Grid item xs={12} sm={2}>
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
                {categories.map(denunciationCategory => {
                  return (
                    <option value={denunciationCategory.id}>{denunciationCategory.name}</option>
                  )
                })
                }
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="age-native-simple">Status</InputLabel>
              <Select
                native
                value={values.status}
                onChange={handleChangeFilter}
                inputProps={{
                  name: 'status',
                }}
              >
                <option aria-label="None" value="" />

                <option value={'48cf5f0f-40c9-4a79-9627-6fd22018f72c'}>Em análise</option>
                <option value={'52ccae2e-af86-4fcc-82ea-9234088dbedf'}>Negadas</option>
              </Select>
            </FormControl>

          </Grid>

          <Grid item xs={12} sm={2}>
            <div>
              <TextField
                fullWidth
                id="standard-rua"
                label="Rua"
                value={values.street}
                onChange={handleChangeFilter}
                inputProps={{
                  name: 'street',
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={2}>
            <div>
              <TextField
                fullWidth
                id="standard-bairro"
                label="Bairro"
                value={values.neighborhood}
                onChange={handleChangeFilter}
                inputProps={{
                  name: 'neighborhood',
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              onChange={handleChangeFilter}
              id="date"
              label="Data"
              type="date"
              className={classes.textField}
              value={values.date}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                name: 'date',
              }}
            />
          </Grid>

          <Grid item xs={12} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={submit} variant="contained" color="primary">Filtrar</Button>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={filterLimpar} variant="contained" >Limpar</Button>
            </FormControl>
          </Grid>
        </Grid>

      </div >
      <Backdrop
        style={{ zIndex: 99999999 }}
        className={classes.backdrop} open={openValidador} onClick={handleCloseValidador}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div >
  );
};

DenunciationsToolbar.propTypes = {
  className: PropTypes.string
};

export default DenunciationsToolbar;
