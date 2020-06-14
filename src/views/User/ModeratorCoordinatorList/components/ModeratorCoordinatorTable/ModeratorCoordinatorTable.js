import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, withStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

//Modal
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
//Fim Modal

//Icone 3 bolinhas
import MoreIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
//FIM Icone 3 bolinhas

import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ForumIcon from '@material-ui/icons/Forum';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import firebase from 'firebase/app'


import API from '../../../../../utils/API';
import AccountDetails from '../../../../../views/Account/components/AccountDetails';
import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
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
  Card: {
    marginTop: 50
  }

}));

//Abrir opções dos 3 pontinho
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

//FIM Abrir opções dos 3 pontinho

const ModeratorCoordinatorTable = props => {
  const { className, users, ...rest } = props;
  const classes = useStyles();

  console.log("Usuário", JSON.stringify(users))
  //Abrir opções dos 3 pontinho
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const anchorElClose = () => {
    setAnchorEl(null);
  };
  //FIM Abrir opções dos 3 pontinho

  ///ABRIR MODAL RECUPERAR SENHA

  const [open, setOpen] = React.useState(false);


  const [openAccount, setAccount] = useState({
    users: '',
  });

  const handleClickAccount = (usersCM) => {

    console.log("sdfsddsdasddasdasda", usersCM)
    setAccount({
      ...users,
      users: usersCM
    });
    setOpen(true)
  };

  const handleClose = () => {
    setOpen(false);
  };


  //DELETE
  const [categoriesDelete, setCategoriesDelete] = useState({
    categories: {}
  });

  const [openAlerta, setOpenAlerta] = React.useState(false);

  const handleOpenDelete = (categoriesD) => {
    setCategoriesDelete({
      categories: categoriesD
    });
    setOpenAlerta(true);
  };

  const handleCloseAlerta = () => {
    setOpenAlerta(false);
  };


  const handleExlcuir = (event) => {
    event.preventDefault();
    console.log("Deletar usuario", categoriesDelete)
    props.deleteUsuario(categoriesDelete);
    setOpenAlerta(false);
  }

  const atualizar = (status) =>{
    props.atualizarModal(status);
    setOpen(false);
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell
                    style={{
                      textAlign: 'right',
                      padding: '0px 25px 0px 0px'
                    }}
                  >Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.filter(function(user){
                  return !user.roles.includes('city_hall')
                }).map(user => {
                  return (
                    <TableRow key={user.id}
                      hover={true}
                    >
                      <TableCell onClick={() => handleClickAccount(user)}>{user.firstName} {user.lastName}</TableCell>
                      <TableCell onClick={() => handleClickAccount(user)}>{user.email}</TableCell>
                      <TableCell onClick={() => handleClickAccount(user)}>{user.roles[0]} {user.roles[1]}</TableCell>
                      <TableCell style={{
                        textAlign: 'right'
                      }}>
                        <IconButton
                          onClick={() => handleClickAccount(user)}
                          aria-label="display more actions" edge="end" color="inherit">
                          <EditIcon
                            onClick={() => handleClickAccount(user)} />  {/* onClick={handleClick}  */}
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenDelete(user)}
                          aria-label="display more actions" edge="end" color="inherit">
                          <DeleteIcon onClick={() => handleOpenDelete(user)} />  {/* onClick={handleClick}  */}
                        </IconButton>

                      </TableCell>
                    </TableRow>
                  )
                })
                }
              </TableBody>
            </Table>

            {/* Modal Alerta */}
            {openAlerta &&

              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openAlerta}
                onClose={handleCloseAlerta}
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}

              >
                {/* Modal da Dereita */}
                <Fade in={openAlerta}>
                  <div className={classes.paper}>
                    <div style={{
                      textAlign: 'right'
                    }}>

                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleCloseAlerta}
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
                        {
                          <Typography>
                            Deseja realmente excluir o usuário {categoriesDelete.categories.firstName}?
                       </Typography>
                        }
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
                            color="secondary"
                            variant="contained"
                            style={{ float: 'right', background: '#b71c1c' }}
                            onClick={handleExlcuir}
                          >
                            Excluir
                        </Button>
                        </Grid>
                      </CardActions>
                    </Card>
                  </div>
                </Fade>
              </Modal>
              // {/* FIM Abri Modal envio coordenador  */}
            }

            {/* ///Alterar dados */}
            {open &&
              < Modal
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
                <Fade in={open}>
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

                    <AccountDetails atualizar={atualizar} userId={openAccount.users.id} />

                  </div>
                </Fade>
              </Modal>
            }

          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card >
  );
};

ModeratorCoordinatorTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default ModeratorCoordinatorTable;
