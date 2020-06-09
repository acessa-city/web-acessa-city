import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';

import {
  Button,
  TextField,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Backdrop
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import CityHallCreate from '../../../../../views/AdminMaster/CityHallCreate';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  //modal
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    overflow: 'scroll'

  },
  paper: {
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

}));

const PrefecturesToolbar = props => {
  const { className, onClearFilter, onCreatePrefecture, ...rest } = props;

  const classes = useStyles();

  //Modal Cadastrar Usuários
  const [openModal, setOpenModal] = React.useState(false);


const[mudarCor, setMudarCor] = useState('');
  const handleOpen = () => {
    setOpenModal(true);
    setMudarCor(true)
  };

  const handleClose = () => {
    setOpenModal(false);
  };


  const [values, setValues] = useState({
    name: '',
    cnpj: '',
    email: '',
  });

  const handleChangeFilter = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const limparForm = (event) => {
    event.preventDefault();
    setValues({
      name: '',
      cnpj: '',
      email: '',
    })
    onClearFilter();
  }



  const handleClickFilter = (event) => {
    event.preventDefault();

    props.filter(values);

  }


  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.root}>

        <Grid container spacing={1}>


          <Grid item xs={12} sm={2}>
            <div>
              <TextField
                fullWidth
                id="standard-name"
                label="Nome"
                onChange={handleChangeFilter}
                required
                value={values.name}
                inputProps={{
                  name: 'name',
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={2}>
            <div>
              <TextField
                fullWidth
                id="standard-cnpj"
                label="CNPJ"
                onChange={handleChangeFilter}
                required
                value={values.cnpj}
                inputProps={{
                  name: 'cnpj',
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={2}>
            <div>
              <TextField
                fullWidth
                id="standard-email"
                label="Email"
                onChange={handleChangeFilter}
                required
                value={values.email}
                inputProps={{
                  name: 'email',
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={handleClickFilter} variant="contained" color="secondary">Filtrar</Button>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={limparForm} variant="contained" >Limpar</Button>
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
                    backgroundColor: '#1b5e20',
                    color: 'white'
                  }}
                  variant="contained" color="secondary"><AddIcon />Cadastrar</Button>
              </FormControl>
            </div>
          </Grid>
        </Grid>

        {/* // Modal CADASTRAR USUÀRIO*/}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
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
              <CityHallCreate mudarCor={mudarCor} onCreatePrefecture={onCreatePrefecture} />

            </div>
          </Fade>
        </Modal>

        {/* // FIM Modal CADASTRAR USUÀRIO*/}

      </div >
    </div >
  );
};

PrefecturesToolbar.propTypes = {
  className: PropTypes.string
};

export default PrefecturesToolbar;


