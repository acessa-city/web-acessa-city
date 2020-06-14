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
  Backdrop,
  CardHeader,
  Card
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import CreateUser from '../../../../../views/User/CreateUser';
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

const CitizensToolbar = props => {
  const { className, onClearFilter, onCreateUser, ...rest } = props;

  const classes = useStyles();

  //Modal Cadastrar Usuários
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };


  const [values, setValues] = useState({
    type:'',
    firstName: '',
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
      type:'',
      firstName: '',
      email: '',
    })
    onClearFilter();
  }



  const handleClickFilter = (event) => {
    event.preventDefault();

    console.log("teste", values)
    props.filter(values);

  }


  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.root}>

        <Grid container spacing={1}>

          <Grid item xs={12} sm={2}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="age-native-simple">Tipo</InputLabel>
              <Select
                native
                value={values.type}
                onChange={handleChangeFilter}
                inputProps={{
                  name: 'type',
                }}
              >
                <option aria-label="None" value="" />
                <option value='admin'>Admin</option>
                <option value='user'>User</option>
           
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} xl={12} md={2} sm={2}>
            <div>
              <TextField
                fullWidth
                id="Nome"
                label="Nome"
                onChange={handleChangeFilter}
                required
                value={values.firstName}
                inputProps={{
                  name: 'firstName',
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12} xl={12} md={2} sm={2}>
            <div>
              <TextField
                fullWidth
                id="Email"
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
          <Grid item xs={12} xl={12} md={1} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={handleClickFilter} variant="contained" color="secondary">Filtrar</Button>
            </FormControl>
          </Grid>

          <Grid item xs={12} xl={12} md={1} sm={1}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={limparForm} variant="contained" >Limpar</Button>
            </FormControl>
          </Grid>


          <Grid item xs={12} xl={12} md={2} sm={2}>

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
          <Fade 
           style={{
            overflow: 'scroll',
            height: '70%'
          }}
          
          in={openModal}>
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
              {/* <div style={{padding:'0px 16px 0px 16px'}}>
                <Card style={{marginBottom: '-17px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}}>
                  <CardHeader
                    subheader="Criar Admin ou Usuário"
                    title="Criar novo usuário"
                  />
                </Card>
              </div> */}
              <CreateUser onCreateUser={onCreateUser} />

            </div>
          </Fade>
        </Modal>

        {/* // FIM Modal CADASTRAR USUÀRIO*/}

      </div >
    </div >
  );
};

CitizensToolbar.propTypes = {
  className: PropTypes.string
};

export default CitizensToolbar;


