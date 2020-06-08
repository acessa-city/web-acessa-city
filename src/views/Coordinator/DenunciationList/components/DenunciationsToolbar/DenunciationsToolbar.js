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
  TableContainer
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import SearchIcon from '@material-ui/icons/Search';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

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

  const classes = useStyles();

  


  const handleData = (sender) => {
    setDenunciationData({
      ...denunciationData,
      data: sender
    })
  }

  const handleStreet = (sender) => {
    setDenunciationStreet({
      ...denunciationStreet,
      street: sender
    })
  }
  const handleNeighborhood = (sender) => {
    setDenunciationNeighborhood({
      ...denunciationNeighborhood,
      neighborhood: sender
    })
  }


  const submit = (event) => {
    event.preventDefault();
    //Filtro geral
    const filtro = {
      category: denunciationCategory,
      setDenunciationData: denunciationStreet.street,
      neighborhood: denunciationNeighborhood.neighborhood,
      creationDate: denunciationData.data,
      status: reportStatusValue
    }
    props.filter(filtro);

  }



  const submitLimpar = (event) => {
    event.preventDefault();

    setReportStatusValue('');
    setDenunciationCategory('');
    setDenunciationStreet({});
    setDenunciationNeighborhood('');
    setDenunciationData('');
  }


  const [progressStatus, setProgressStatus] = React.useState(true);

  //Filtro denúncias em progresso
  const submitEmProgresso = (event) => {
    event.preventDefault();

    const filtroAprove = {
      id: 'c37d9588-1875-44dd-8cf1-6781de7533c3',
      statusProgress: false,
    }
    props.filterAprove(filtroAprove);
    setProgressStatus(false)
    setMensagem('Denúncias em progresso!');
    setOpenDialog(true);

  }

  const submitEmProgresso2 = (event) => {
    event.preventDefault();

    const filtroAprove = {
      id: '96afa0df-8ad9-4a44-a726-70582b7bd010',
      statusProgress: true,
    }
    props.filterAprove(filtroAprove);
    setProgressStatus(true)
    setMensagem('Denúncias não aprovadas!');
    setOpenDialog(true);
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
                value={denunciationCategory}
                onChange={e => setDenunciationCategory(e.target.value)}
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
                value={reportStatusValue}
                onChange={e => setReportStatusValue(e.target.value)}
              >
                <option aria-label="None" value="" />                
                  
                    <option value={'96afa0df-8ad9-4a44-a726-70582b7bd010'}>Aprovadas</option>
                    <option value={'52ccae2e-af86-4fcc-82ea-9234088dbedf'}>Negadas</option>
                    <option value={'c37d9588-1875-44dd-8cf1-6781de7533c3'}>Em progresso</option>
              </Select>
            </FormControl>

          </Grid>

          {/* <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel>Rua:</InputLabel>
              <Select native label="Endereço" value={denunciationStreet} onChange={e => setDenunciationStreet(e.target.value)}>
                <option aria-label="None" value="" />
                {denunciationsSlect.map(denunciationStreet => {
                  return (
                    <option value={denunciationStreet.street}>{denunciationStreet.street}</option>
                  )
                })
                }
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel>Bairro:</InputLabel>
              <Select native label="Bairro" value={denunciationNeighborhood} onChange={e => setDenunciationNeighborhood(e.target.value)}>
                <option aria-label="None" value="" />
                {denunciationsSlect.map(denunciationNeighborhood => {
                  return (
                    <option value={denunciationNeighborhood.neighborhood}>{denunciationNeighborhood.neighborhood}</option>
                  )
                })
                }
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={2}>
            <div>
              <TextField
                fullWidth
                id="standard-rua"
                label="Rua"
                value={denunciationStreet.street}
                onChange={e => handleStreet(e.target.value)}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={2}>
            <div>
              <TextField
                fullWidth
                id="standard-bairro"
                label="Bairro"
                value={denunciationNeighborhood.neighborhood}
                onChange={e => handleNeighborhood(e.target.value)}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              onChange={e => handleData(e.target.value)}
              id="date"
              label="Data"
              type="date"
              className={classes.textField}
              value={denunciationData.data}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={submit} variant="contained" color="secondary">Filtrar</Button>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={submitLimpar}  variant="contained" >Limpar</Button>
            </FormControl>
          </Grid>
        </Grid>

      </div >

      <Dialog open={openDialog} onClose={e => setOpenDialog(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          {mensagem}
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div >
  );
};

DenunciationsToolbar.propTypes = {
  className: PropTypes.string
};

export default DenunciationsToolbar;


