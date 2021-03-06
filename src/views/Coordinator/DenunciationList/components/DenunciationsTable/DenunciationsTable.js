import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, withStyles } from '@material-ui/styles';
import Carousel from 'react-material-ui-carousel'
import CardMedia from '@material-ui/core/CardMedia';
import {
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
  Divider,
  Snackbar,
  SnackbarContent,
  TableFooter
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
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import ForumIcon from '@material-ui/icons/Forum';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CloseIcon from '@material-ui/icons/Close';
import { Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import firebase from 'firebase/app'


import API from '../../../../../utils/API';
import Report from '../../../../../components/Report';
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
  },
  media: {
    width: '800px',
    height: '380px'
  },

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

const DenunciationsTable = props => {
  const { className, denunciations, coodenadores, statusProgressDenunciation, ...rest } = props;
  const classes = useStyles();

  console.log("tipode fltrpi asasasasasas", statusProgressDenunciation)

  /// Salvar coodenadores
  const [coodenador, setCoodenador] = useState({
    id: {}
  });


  const handleCoordinatorChange = (sender) => {

    setCoodenador({
      id: sender
    })

  }

  //Modal de Aprovação
  const [openAprove, setOpenAprove] = React.useState(false);

  const handleOpenAprove = () => {
    setOpenAprove(true);
  };

  const handleCloseAprove = () => {
    setCoodenador({ id: '' })
    setOpenAprove(false);
  };


  //Modal de Negação
  const [openDeny, setOpenDeny] = React.useState(false);

  const handleOpenDeny = () => {
    setOpenDeny(true);
  };

  const handleCloseDeny = () => {
    setDeny({ message: '', userId: '' });
    setOpenDeny(false);
  };


  /// negar uma denuncia


  function getFirebase(user) {
    console.log(1)
    let uId = ''
    if (user) {
      console.log('' + JSON.stringify(user))
      user.getIdTokenResult().then((result) => {
        uId = result.claims.app_user_id
        setDeny({
          ...deny,
          userId: uId
        })
      })
    } else {

    }

  }


  const [deny, setDeny] = useState({
    message: '',
    userId: ''
  });


  const handleDenyChange = (sender) => {
    setDeny({
      ...deny,
      message: sender
    })

  }

  const submitDeny = (event) => {
    event.preventDefault();

    const denyDenunciations = {
      reportId: openModalDenunciations.denunciations.id,
      reportStatusId: '52ccae2e-af86-4fcc-82ea-9234088dbedf',
      description: deny.message

    }
    console.log("aquiiiiii o jason denuncia", denyDenunciations)

    if (deny.message == '') {
      setErrors([
        "Decreva o motivo da negação"
      ])
      setErrorsStatus(false)
      setTimeout(() => {
        setErrors([]);
      }, 1000);
    } else {
      props.envioDeny(denyDenunciations);
      setDeny({ message: '', userId: '' });
      setOpenDeny(false);
      setOpen(false);
    }

  }


  const [reportComments, setReportComments] = React.useState(false);
  // Listar Cometarios
  const listComments = () => {
    API.get(`/report-commentary/report/0efd3d3e-2ff6-40e3-a7f0-6100fe403701`,
    ).then(response => {
      const listComments2 = response.data;
      console.log("ENTRE.LLLLLL.." + JSON.stringify(listComments2))
      setReportComments(listComments2);
    }).catch(erro => {
      console.log(erro);
    })
  }


  React.useEffect(() => {
    listComments();
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(getFirebase)
    console.log(3)
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])


  //////////////////////



  //Modal de envio Coordenador de fora
  const [openModalDenunciations, setOpenModalDenunciations] = useState({
    denunciations: {}

  });

  const [open, setOpen] = React.useState(false);

  const handleOpen = (denunciationsp) => {
    console.log("denunciasss" + JSON.stringify(denunciationsp))
    setOpenModalDenunciations({
      ...denunciations,
      denunciations: denunciationsp
    });
    setOpen(true);
  };

  const handleClose = () => {

    setOpen(false);
  };

  //FIM Modal de envio Coordenador


  //modal comentario

  const [openComments, setComments] = React.useState(false);


  console.log(JSON.stringify(openComments))

  const handleOpenComments = (denunciationsp2) => {
    setOpenModalDenunciations({
      ...denunciations,
      denunciations: denunciationsp2
    });
    setComments(true);
  };


  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  // const handleSelectAll = event => {
  //   const { users } = props;

  //   let selectedUsers;

  //   if (event.target.checked) {

  //   } else {
  //     selectedUsers = [];
  //   }

  //   setSelectedUsers(selectedUsers);
  // };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const tratarClose = () => {
    setComments(false)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  ////////Midias//////////
  const [media, setMedia] = useState({
    hasMedia: false,
    photos: [],
    videos: []
  })


  const updateMediaLinks = attachments => {
    const photos = media.photos;
    if (attachments) {
      setMedia({
        ...media,
        hasMedia: true
      });
      attachments.forEach(element => {
        photos.push(element.url)
      });
      console.log("photooooo", photos)
    }
  }




  //Envio aprovação (em análise).
  const [progress, setProgress] = useState({
    description: '',
    data: ''
  });

  const handleProgress = (sender) => {
    setProgress({
      ...progress,
      description: sender
    })
  }

  const handleProgress2 = (sender) => {
    setProgress({
      ...progress,
      data: sender
    })
  }

  const submitProgress = (event) => {
    event.preventDefault();

    const progressAprove = {

      denunciationsId: openModalDenunciations.denunciations.id,
      description: progress.description,
      data: progress.data

    }

    if (progress.description == '' || progress.data == '') {
      setErrors([
        "Preencha o campo descrição e data!"
      ])
      setErrorsStatus(false)
      setTimeout(() => {
        setErrors([]);
      }, 1000);

    } else {
      props.envioProgress(progressAprove);
      setProgress({ denunciationsId: '', reportStatusId: '', description: '', data: '', });
      setOpenAprove(false);
      setOpen(false);
    }
  }


  ///////ENCERRAMENTO///////

  const [valuesEncerramento, setValuesEncerramento] = useState({
    descriptionEncerramento: '',
    dataEncerramento: ''
  });

  const handleChangeEncerramento = event => {
    setValuesEncerramento({
      ...valuesEncerramento,
      [event.target.name]: event.target.value
    });
  };

  const submitEncerramento = (event) => {
    event.preventDefault();

    const encerrar = {
      reportId: openModalDenunciations.denunciations.id,
      description: valuesEncerramento.descriptionEncerramento,
      endDate: valuesEncerramento.dataEncerramento
    }

    if (valuesEncerramento.descriptionEncerramento == '' || valuesEncerramento.dataEncerramento == '') {
      setErrors([
        "Preencha o campo descrição e data!"
      ])
      setErrorsStatus(false)
      setTimeout(() => {
        setErrors([]);
      }, 1000);

    } else {
      props.envioFinish(encerrar);
      setValuesEncerramento({ descriptionEncerramento: '', dataEncerramento: '' });
      setOpenAprove(false);
      setOpen(false);
    }

  }

  /////Errros///////
  const handleSnackClick = () => {
    setErrors([]);
  }
  const [errors, setErrors] = useState([]);
  const [errorsStatus, setErrorsStatus] = useState('');
  const [errorsStatus2, setErrorsStatus2] = useState('');
  const [openValidador, setOpenValidador] = React.useState(false);
  const handleCloseValidador = () => {
    setOpenValidador(false);
  };

  const erros = () => {
    if (errorsStatus == true) {
      return (
        <div>
          {errors.map(error => (
            <SnackbarContent
              style={{
                background: 'orange',
                textAlign: 'center'
              }}
              message={<h3>{error}</h3>} />
          ))}
        </div>)
    } else if (errorsStatus2 == true) {
      return (
        <div>
          {errors.map(error => (
            <SnackbarContent
              style={{
                background: 'green',
                textAlign: 'center'
              }}
              message={<h3>{error}</h3>} />
          ))}
        </div>)
    } else {
      return (
        <div>
          {errors.map(error => (
            <SnackbarContent autoHideDuration={1}
              style={{
                background: 'red',
                textAlign: 'center'
              }}
              message={<h3>{error}</h3>}
            />
          ))}
        </div>)
    }
  }


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >

      {openComments &&

        //{/* // De comentarios */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openComments}
          onClose={tratarClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openComments}>
            <div style={{
              overflow: 'scroll',
              height: '100%'
            }}
              className={classes.paper}>

              <div style={{
                textAlign: 'right'
              }}>

                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={tratarClose}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <Report reportId={openModalDenunciations.denunciations.id}>
              </Report>

              <Grid
                item
                lg={12}
                md={12}
                xl={12}
                xs={12}
              >
                <Button
                  color="default"
                  onClick={tratarClose}
                  variant="contained"
                  style={{ float: 'right' }}
                >
                  Fechar
                             </Button>
              </Grid>


            </div>
          </Fade>
        </Modal>
      }

      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Denúncias</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Bairro</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Datas</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell style={{
                    textAlign: 'center',
                  }}>Cometários</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? denunciations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : denunciations
                ).map((denunciation) => {
                  return (
                    <TableRow key={denunciation.id}
                    hover={true}
                    style={{cursor: 'pointer'}}
                    >
                      <TableCell onClick={() => handleOpen(denunciation)}>{denunciation.title}</TableCell>
                      <TableCell>{denunciation.street}</TableCell>
                      <TableCell>{denunciation.neighborhood}</TableCell>
                      <TableCell>{denunciation.category.name}</TableCell>
                      <TableCell>{moment(denunciation.creationDate).format('DD/MM/YYYY')}</TableCell>
                      <TableCell onClick={() => handleOpen(denunciation.id)}>{(denunciation.reportStatus.description)}</TableCell>
                      <TableCell onClick={() => handleOpenComments(denunciation)}><div style={{
                        textAlign: 'center',
                      }}><ForumIcon /></div></TableCell>
                    </TableRow>

                  )
                })
                }

                {open &&
                  //Modal da denuncia
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
                    <Fade in={open}>
                      <div style={{
                        overflow: 'scroll',
                        height: '100%'
                      }}
                        className={classes.paper}>

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
                            maxWidth: 700
                          }}
                        >
                          <CardContent>
                            <div style={{ textAlign: 'center' }} >
                              <Typography gutterBottom variant="h3" component="h2">
                                {openModalDenunciations.denunciations.title}
                              </Typography>
                            </div>
                            {openModalDenunciations.denunciations.attachments.length > 0 &&
                              <Carousel>
                                {openModalDenunciations.denunciations.attachments.map(item => (
                                  <div>
                                    {item.url.includes('.mp4') &&
                                      <video controls
                                        onClick={() => window.open(item.url, "_blank")}
                                        width='100%'
                                        height='auto'
                                      >
                                        <source src={item.url} />
                                      </video>
                                    }

                                    {!item.url.includes('.mp4') &&

                                      <CardMedia
                                        onClick={() => window.open(item.url, "_blank")}
                                        className={classes.media}
                                        image={item.url}
                                      />

                                    }
                                  </div>
                                ))}
                              </Carousel>
                            }
                            <div>
                              <Typography gutterBottom variant="h3" component="h2">
                                Descrição:
                              </Typography>
                            </div>
                            <div>
                              <Typography align="justify">{openModalDenunciations.denunciations.description}</Typography>
                            </div>
                          </CardContent>
                          <Divider />
                          {statusProgressDenunciation == '96afa0df-8ad9-4a44-a726-70582b7bd010' &&
                            <CardActions>
                              <Grid item md={6} xs={6}>
                                <Button
                                  style={{ background: '#b71c1c' }}
                                  onClick={handleOpenDeny}
                                  mx={200}
                                  color="primary"
                                  variant="contained"
                                >
                                  Negar
                            </Button>
                              </Grid>
                              <Grid item md={6} xs={6}>
                                <Button
                                  style={{ background: '#1b5e20', float: 'right' }}
                                  onClick={handleOpenAprove}
                                  color="primary"
                                  variant="contained"
                                >
                                  Aprovar
                              </Button>
                              </Grid>

                            </CardActions>
                          }
                          {statusProgressDenunciation == 'c37d9588-1875-44dd-8cf1-6781de7533c3' &&
                            <CardActions>
                              <Grid item md={6} xs={6}>
                                {/* <Button
                                  style={{ background: '#b71c1c' }}
                                  onClick={handleOpenDeny}
                                  color="primary"
                                  variant="contained"
                                >
                                  Negar
                               </Button> */}
                              </Grid>
                              <Grid item md={6} xs={6}>
                                <Button
                                  style={{ background: '#1b5e20', float: 'right' }}
                                  onClick={handleOpenAprove}
                                  color="primary"
                                  variant="contained"
                                >
                                  Encerrar
                              </Button>
                              </Grid>
                            </CardActions>
                          }
                        </Card>
                      </div>
                    </Fade>
                  </Modal>
                  // {/* FIM Abri Modal envio coordenador  */}
                }

                {/* // Modal Aprovação */}
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  open={openAprove}
                  onClose={handleCloseAprove}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  {/* Modal da Dereita */}
                  <Fade in={openAprove}>
                    <div className={classes.paper}>
                      {statusProgressDenunciation == '96afa0df-8ad9-4a44-a726-70582b7bd010' &&
                        <Grid container spacing={1}>

                          <Grid item xs={12} sm={12}>
                            <InputLabel>Descreva o motivo da Denúncia:</InputLabel>
                          </Grid>
                          <Grid
                            item
                            lg={12}
                            md={12}
                            xl={12}
                            xs={12}
                          >
                            <TextareaAutosize style={{ width: '100%', fontSize: '15px', borderRadius: '4px', padding: '5px 13px 10px 13px' }}
                              rowsMin={3}
                              aria-label="empty textarea"
                              name="description"
                              onChange={e => handleProgress(e.target.value)}
                              value={progress.description}
                              placeholder="Descreva o motivo da denúncia.*"
                            />

                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <TextField
                              onChange={e => handleProgress2(e.target.value)}
                              id="date"
                              label="Data de Finalização"
                              type="date"
                              defaultValue="24-05-2017"
                              className={classes.textField}
                              value={progress.data}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FormControl margin="dense" fullWidth>
                              <Grid item md={12} xs={12}>
                                <Button style={{ float: 'right', background: '#1b5e20' }} onClick={submitProgress} variant="contained" color="secondary">Progresso</Button>
                              </Grid>
                            </FormControl>
                          </Grid>
                        </Grid>
                      }
                      {statusProgressDenunciation == 'c37d9588-1875-44dd-8cf1-6781de7533c3' &&
                        <Grid container spacing={1}>

                          <Grid item xs={12} sm={12}>
                            <InputLabel>Descreva o motivo do Encerramento:</InputLabel>
                          </Grid>

                          <Grid
                            item
                            lg={12}
                            md={12}
                            xl={12}
                            xs={12}
                          >
                            <TextareaAutosize style={{ width: '100%', fontSize: '15px', borderRadius: '4px', padding: '5px 13px 10px 13px' }}
                              rowsMin={3}
                              aria-label="empty textarea"
                              name="descriptionEncerramento"
                              onChange={handleChangeEncerramento}
                              value={valuesEncerramento.descriptionEncerramento}
                              placeholder="Descreva o motivo do encerramento.*"
                            />
                          </Grid>

                          <Grid item xs={12} sm={10}>
                            <TextField
                              onChange={handleChangeEncerramento}
                              id="date"
                              label="Data de Finalização"
                              type="date"
                              defaultValue="2017-05-24"
                              className={classes.textField}
                              value={valuesEncerramento.dataEncerramento}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                name: 'dataEncerramento',
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <FormControl margin="dense" fullWidth>
                              <Grid item md={12} xs={12}>
                                <Button onClick={submitEncerramento} style={{ background: '#1b5e20', float: 'right' }} variant="contained" color="secondary">Encerrar</Button>
                              </Grid>
                            </FormControl>
                          </Grid>
                        </Grid>
                      }
                    </div>
                  </Fade>
                </Modal>


                {/* // Modal Negação */}
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  open={openDeny}
                  onClose={handleCloseDeny}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={openDeny}>
                    <div className={classes.paper}>

                      <Grid container spacing={1}>

                        <Grid item xs={12} sm={12}>
                          <InputLabel>Descreva o motivo da negação:</InputLabel>
                        </Grid>

                        <Grid
                          item
                          lg={12}
                          md={12}
                          xl={12}
                          xs={12}
                        >

                          <TextareaAutosize style={{ width: '100%', fontSize: '15px', borderRadius: '4px', padding: '5px 13px 10px 13px' }}
                            rowsMin={3}
                            aria-label="empty textarea"
                            name="description"
                            onChange={e => handleDenyChange(e.target.value)}
                            value={deny.message}
                            placeholder="Descreva o motivo dessa negação.*"
                          />

                        </Grid>

                        <FormControl margin="dense" fullWidth>
                          <Grid item md={12} xs={12}>
                            <Button style={{ float: 'right', background: '#1b5e20' }} onClick={submitDeny} variant="contained" color="secondary">Enviar</Button>
                          </Grid>
                        </FormControl>


                      </Grid>
                    </div>
                  </Fade>
                </Modal>

              </TableBody>
            </Table>

          </div>
        </PerfectScrollbar>
      </CardContent>
      <Snackbar open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
      <TableFooter>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: 'Todas', value: -1 }]}
          colSpan={3}
          backIconButtonText={"Anterior"}
          nextIconButtonText={"Próxima"}
          count={denunciations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage={'Denúncias por página:'}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ` + `${count}`}
          SelectProps={{
            inputProps: { '': 'Denúncias por página:' },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableFooter>
    </Card>
  );
};

DenunciationsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default DenunciationsTable;


