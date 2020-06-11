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
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import EditIcon from '@material-ui/icons/Edit';
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
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import ForumIcon from '@material-ui/icons/Forum';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import firebase from 'firebase/app'


import API from '../../../../../utils/API';
import { ReportCommentaries } from '../../../../../components/';
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

const CategoryTable = props => {
  const { className, categories, ...rest } = props;
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');



//Modal de envio Coordenador de fora
const [openCategories, setOpenCategories] = useState({
  categories: {}

});

const [open, setOpen] = React.useState(false);

const handleOpen = (categoriesT) => {
  console.log("categoriesT" + JSON.stringify(categoriesT))
  setOpenCategories({
    ...categories,
    categories: categoriesT.name
  });
  setOpen(true);
};

const handleClose = () => {

  setOpen(false);
};


// const[values,setValues]
// const handleChange = event => {
//   setValues({
//     ...values,
//     [event.target.name]: event.target.value
//   });
// };



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

                  <TableCell>Categoria</TableCell>
                  <TableCell
                   style={{
                    textAlign: 'right',
                    padding: '0px 25px 0px 0px'
                  }}
                  
                  >Ações</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
              {categories.map(categorie => {
                  return (
                    <TableRow key={categorie.id}>
                      <TableCell onClick={() => handleOpen(categorie)}>{categorie.name}</TableCell>
                    </TableRow>

                  )
                })
                }




                {open &&

                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}

                  >
                    {/* Modal da Dereita */}
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
                                  helperText="Informe o novo nome da categoria"
                                 // onChange={handleChange}
                                  label="Nome da categoria"
                                  margin="dense"
                                  name="name"
                                  required
                                  value={openCategories.categories}
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
                                color="secondary"
                                variant="contained"
                                style={{float: 'right' }}
                              >
                                salvar
                             </Button>
                            </Grid>
                          </CardActions>
                        </Card>
                      </div>
                    </Fade>
                  </Modal>
                  // {/* FIM Abri Modal envio coordenador  */}
                }
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>

      <Dialog open={openDialog} onClose={e => setOpenDialog(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          {mensagem}
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
};

CategoryTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default CategoryTable;

