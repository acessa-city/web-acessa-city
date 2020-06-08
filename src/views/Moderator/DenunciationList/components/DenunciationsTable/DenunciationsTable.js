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
    height: '280px'
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
  const { className, denunciations, coodenadores, ...rest } = props;
  const classes = useStyles();



  /// Salvar coodenadores
  const [coodenador, setCoodenador] = useState({
    id: {}
  });


  const handleCoordinatorChange = (sender) => {

    setCoodenador({
      id: sender
    })

  }

  const submit = (event) => {
    event.preventDefault();

    const coordenadores = {

      coordinatorId: coodenador.id,
      reportId: openModalDenunciations.denunciations.id

    }

    if (coodenador.id.length > 0) {
      props.envioCoordenador(coordenadores);
      setCoodenador({ id: '' })
      setOpenAprove(false);
      setOpen(false);
    } else {
      setErrors([
        "Selecione um coordenador"
      ])
      setErrorsStatus(false)
      setTimeout(() => {
        setErrors([]);
      }, 1000);
    }

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
      userId: deny.userId,
      denunciationsId: openModalDenunciations.denunciations.id,
      reportStatusId: '52ccae2e-af86-4fcc-82ea-9234088dbedf',
      description: deny.message

    }

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

  const handleCloseComments = () => {
    setComments(false);
  };

  ////Modal de Denuncias 3 pontinho
  const [openDenunciation, setOpenDenunciation] = React.useState(false);

  const handleOpenDenunciation = () => {
    setOpenDenunciation(true);
  };

  const handleCloseDenunciation = () => {
    setOpenDenunciation(false);
  };

  ////Modal Negar de Denuncias 3 pontinho
  const [openDenunciationDeny, setOpenDenunciationDeny] = React.useState(false);

  const handleOpenDenunciationDeny = () => {
    setOpenDenunciationDeny(true);
  };

  const handleCloseDenunciationDeny = () => {
    setOpenDenunciationDeny(false);
  };




  //FIM Modal de Denuncias

  //Abrir opções dos 3 pontinho
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
  };
  //FIM Abrir opções dos 3 pontinho



  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const tratarClose = () => {
    setComments(false)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
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

              <CardActions>
                <Grid md={12} xl={12} xs={12}>
                  <Button style={{ float: 'right', background: '#2979ff', color: '#fff' }} onClick={tratarClose}>
                    Fechar
                    </Button>
                </Grid>
              </CardActions>

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
                  <TableCell>Cometários</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {denunciations.map(denunciation => {
                  return (
                    <TableRow key={denunciation.id}>
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
                          <CardActions>

                            <Grid item md={6} xs={6}>
                              <Button
                                onClick={handleOpenAprove}
                                mx={200}
                                color="primary"
                                align="right"
                                disabled={false}
                                width="10px"
                                size="large"
                                type="submit"
                                variant="contained"
                                className={classes.button}
                              >
                                Aprovar
                          </Button>
                            </Grid>
                            <Grid item md={6} xs={6}>
                              <Button
                                style={{ float: 'right' }}
                                onClick={handleOpenDeny}
                                mx={200}
                                color="primary"
                                align="right"
                                disabled={false}
                                width="10px"
                                size="large"
                                type="submit"
                                variant="contained"
                                className={classes.button}
                              >
                                Negar
                            </Button>
                            </Grid>
                          </CardActions>
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

                      <Grid container spacing={1}>

                        <Grid item xs={12} sm={12}>
                          <InputLabel>Selecione um coordenador:</InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={12}>

                          <FormControl variant="outlined" margin="dense" fullWidth>
                            <InputLabel>Coodenadores:</InputLabel>
                            <Select native label="Coodenadores" value={coodenador.id} onChange={e => handleCoordinatorChange(e.target.value)}>
                              <option aria-label="None" value="" />
                              {coodenadores.map(listCoodenadores => {
                                return (
                                  <option value={listCoodenadores.id}>{listCoodenadores.firstName}</option>
                                )
                              })
                              }
                            </Select>
                          </FormControl>

                        </Grid>
      
                          <FormControl margin="dense" fullWidth>
                          <Grid item md={12} xs={12}>
                            <Button style={{ float: 'right' }} o onClick={submit} variant="contained" color="secondary">Enviar</Button>
                          </Grid>
                          </FormControl>
                      </Grid>
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
                              <Button style={{ float: 'right' }} onClick={submitDeny} variant="contained" color="secondary">Enviar</Button>
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
    </Card>
  );
};

DenunciationsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default DenunciationsTable;
