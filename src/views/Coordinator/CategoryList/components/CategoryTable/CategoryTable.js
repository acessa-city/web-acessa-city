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
import { constant } from 'underscore';

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


//FIM Abrir opções dos 3 pontinho

const CategoryTable = props => {
  const { className, categories, ...rest } = props;
  const classes = useStyles();


  //Modal de envio Coordenador de fora
  const [openCategories, setOpenCategories] = useState({
    categories: {}

  });

  const [open, setOpen] = React.useState(false);

  const handleOpen = (categoriesT) => {
    console.log("categoriesT" + JSON.stringify(categoriesT))
    setOpenCategories({
      categories: categoriesT
    });
    setOpen(true);
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
    props.deleteCategory(categoriesDelete);
    setOpenAlerta(false);
  }

  //////////////////////



  const handleChange = event => {
    event.preventDefault();
    setOpenCategories({
      ...openCategories,
      categories: {
        id: openCategories.categories.id,
        name: event.target.value
      }
    });
  };

  const submit = (event) => {
    event.preventDefault();
    props.editCategory(openCategories)
    setOpenCategories({ categories: {} })
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
                      <TableCell
                        style={{
                          textAlign: 'right'
                        }}
                      >
                        <IconButton
                          onClick={() => handleOpen(categorie)}
                          aria-label="display more actions" edge="end" color="inherit">
                          <EditIcon onClick={() => handleOpen(categorie)} />  {/* onClick={handleClick}  */}
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenDelete(categorie)}
                          aria-label="display more actions" edge="end" color="inherit">
                          <DeleteIcon onClick={() => handleOpenDelete(categorie)} />
                        </IconButton>

                      </TableCell>
                    </TableRow>

                  )
                })
                }
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
                    <Fade 
                    
                    style={{
                      overflow: 'scroll',
                      height: '35%'
                    }}

                    
                    in={openAlerta}>
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
                                Deseja realmente excluir a categoria {categoriesDelete.categories.name}?
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



                {/* Modal Edição */}
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
                                  helperText="Informe o novo nome da categoria"
                                  onChange={handleChange}
                                  label="Nome da categoria"
                                  margin="dense"
                                  name="categorie"
                                  required
                                  value={openCategories.categories.name}
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
                                style={{ float: 'right' }}
                                onClick={submit}
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
    </Card>
  );
};

CategoryTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default CategoryTable;

