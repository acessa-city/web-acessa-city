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
  TableContainer
} from '@material-ui/core';

//Modal
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
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

const CitizensTable = props => {
  const { className, citizens, ...rest } = props;
  const users = [];
  const classes = useStyles();

  console.log("Usuário", JSON.stringify(citizens))
  

  ///ABRIR MODAL RECUPERAR SENHA

  const [open, setOpen] = React.useState(false);


  const [openCitizens, setOpenCitizens] = useState({
    citizens: '',
  });

  const handleClickAccount = (citizensL) => {

    console.log("sdfsddsdasddasdasda", citizensL)
    setOpenCitizens({
      ...citizens,
      citizens: citizensL
    });
    setOpen(true)
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleClickDelete = (userDelete) => {
    console.log("chegando id delete:", userDelete)
    API.delete(`/user/${userDelete.id}`)
    .then(response => {
      console.log("sucesso")
    }).catch(erro => {
      console.log(erro);
    })

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
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {citizens.map(citizen => {
                  return (
                    <TableRow key={citizen.id}
                      hover={true}
                    >
                      <TableCell onClick={() => handleClickAccount(citizen)}>{citizen.firstName}</TableCell>
                      <TableCell>{citizen.email}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="display more actions" edge="end" color="inherit">
                          <EditIcon
                            onClick={() => handleClickAccount(citizen)} />  {/* onClick={handleClick}  */}
                        </IconButton>
                        <IconButton aria-label="display more actions" edge="end" color="inherit">
                          <DeleteIcon onClick={() => handleClickDelete(citizen)} />  {/* onClick={handleClick}  */}
                        </IconButton>

                      </TableCell>
                    </TableRow>
                  )
                })
                }
              </TableBody>
            </Table>

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
 
                   <AccountDetails userId={openCitizens.citizens.id} />

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

CitizensTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default CitizensTable;
