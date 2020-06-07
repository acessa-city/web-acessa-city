import React, { useState, useEffect, Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/styles';
import RoomIcon from '@material-ui/icons/Room';
import Report from 'components/Report';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Videocam from '@material-ui/icons/Videocam';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import VideoPlayer from 'react-simple-video-player';

import {
  Card,
  Form,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TextField,
  Grid,
  Box,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import Camera, { idealResolution } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
//MODAL
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import API from '../../../utils/API';
import s3 from 'utils/AWS-S3'
import currentUser from 'utils/AppUser';
import GoogleMapReact from 'google-map-react';

const styles = makeStyles(theme => ({
  gridButton: {
    position: "absolute",
    marginTop: "-675px",
    alignSelf: "center"
  },
  gridForm: {
    position: "absolute",
    marginTop: "-620px",
    alignSelf: "center",
    backgroundColor: "#fff",
    width: "900px",
    height: "900px"
  },
  title: {
    fontSize: 12,
    fontFamily: '"Times New Roman", Times, serif'
  },
  camera: {
    width: "100px",
    height: "100px"
  },
  markerApproved: {
    color: "red",
    fontSize: 45
  },
  markerFinished: {
    color: "green",
    fontSize: 45
  },
  markerProgress: {
    color: "orange",
    fontSize: 45
  },
  markerAnalysis: {
    color: "blue",
    fontSize: 45
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    //overflow: 'scroll'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: 'hidden',
  },
  avatar: {
    height: 100,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  button1: {
    display: 'absolute',
    backgroundColor: '#fff',
    width: 100,
    marginBottom: 5,
    "&:hover": {
      background: "#efefef"
    },
    "&:last-child": {
      borderRight: "solid 1px #cccccc"
    }
  },
  input: {
    display: 'none'
  },
  gridList: {
    width: 500,
    height: 450,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },


}));

const ReportMap = props => {

  const [locationsInAnalysis, setLocationsInAnalysis] = useState([]);
  const [locationsInProgress, setLocationsInProgress] = useState([]);
  const [locationsAproved, setLocationsApproved] = useState([]);
  const [locationsFinished, setLocationsFinished] = useState([]);

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [idReportModal, setidReportModal] = useState('');

  const limpaTodos = () => {
    setLocationsApproved([]);
    setLocationsFinished([]);
    setLocationsInProgress([]);
    setLocationsInAnalysis([]);
  }

  const limpaEstadoApproved = () => {
    setLocationsApproved([]);
  }

  const limpaEstadoFinished = () => {
    setLocationsFinished([]);
  }

  const limpaEstadoInProgress = () => {
    locationsInProgress([]);
  }

  const limpaEstadoInAnalysis = () => {
    locationsInAnalysis([]);
  }

  const filterBoth = () => {
    API.get('/report?status=48cf5f0f-40c9-4a79-9627-6fd22018f72c'
    ).then(response => {
      const report = response.data
      setLocationsInAnalysis(report)
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
    API.get('/report?status=96afa0df-8ad9-4a44-a726-70582b7bd010'
    ).then(response => {
      const report = response.data
      setLocationsApproved(report)
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
    API.get('/report?status=c37d9588-1875-44dd-8cf1-6781de7533c3'
    ).then(response => {
      const report = response.data
      setLocationsInProgress(report)
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
    API.get('/report?status=52ccae2e-af86-4fcc-82ea-9234088dbedf' /*MOSTRANDO AS NEGADAS (ALTERAR PARA ENCERRADAS)*/
    ).then(response => {
      const report = response.data
      setLocationsFinished(report)
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }


  const filterFinished = () => {
    API.get('/report?status=c37d9588-1875-44dd-8cf1-6781de7533c3'
    ).then(response => {
      const report = response.data
      /* limpaTodos(); */
      setLocationsFinished(report)
      limpaEstadoInProgress();
      limpaEstadoApproved();
      limpaEstadoInAnalysis();
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }

  const filtroApproved = () => {
    API.get('/report?status=96afa0df-8ad9-4a44-a726-70582b7bd010'
    ).then(response => {
      const report = response.data
      /* limpaTodos(); */
      setLocationsApproved(report)
      limpaEstadoInProgress();
      limpaEstadoFinished();
      limpaEstadoInAnalysis();
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }

  const filtroInAnalysis = () => {
    API.get('/report?status=48cf5f0f-40c9-4a79-9627-6fd22018f72c'
    ).then(response => {
      const report = response.data
      limpaTodos();
      setLocationsInAnalysis(report)
      /*  limpaEstadoInProgress();
       limpaEstadoFinished();
       limpaEstadoApproved(); */
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }

  const filtroInProgress = () => {
    API.get('/report?status=c37d9588-1875-44dd-8cf1-6781de7533c3'
    ).then(response => {
      const report = response.data
      /* limpaTodos(); */
      setLocationsInAnalysis(report)
      limpaEstadoFinished();
      limpaEstadoApproved();
      limpaEstadoInAnalysis();
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }


  const style = styles();

  const [clicked, setClicked] = useState({
    check: false
  });

  const defaultProps = {
    center: {
      lat: -22.89205,
      lng: -47.0616
    },
    zoom: 18
  };

  function handleTakePhoto(dataUri) {

    console.log('takePhoto');
  }

  function loadReport(event) {
    event.preventDefault();

    setClicked({
      check: true
    });
  }

  function onCreateReport(event) {
    event.preventDefault();

    setClicked({
      check: false
    });
  }


  /* INICIO MODAL */

  const [open, setOpen] = React.useState(false);

  const handleOpen = props => {

    /* FUNÇÃO QUE RETORNA UM VALOR PARA A VARIAVEL */
    setidReportModal(props)
    console.log(props);
    setOpen(true, props);
  };

  const closeModal = () => {
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false);
  };
  /* FIM MODAL */





  /* INICIO MODAL  DENUCNIAS*/

  const [openDenuncias, setOpenDenuncias] = React.useState(false);

  const handleOpenDenuncias = props => {
    setOpenDenuncias(true);
  };





  ////////Fechar Modal e limpar //////
  const handleCloseDenuncias = () => {
    setOpenDenuncias(false);
    limparForm();
    limparMidia();
    setMidiaStatusPhotos(false);
    setMidiaStatusVideo(false);
  };
  /* FIM MODAL */


  const limparForm = () => {
    setValues({
      title: '',
      description: '',
      categoria: ''
    })
  }

  const limparMidia = () => {
    setMidia({
      images: [],
      videos: []
    })
  }


  //////////Lista de MIDIAS ///////////
  const [midia, setMidia] = useState({
    images: [],
    videos: []
  });

  const [midiaStatusPhotos, setMidiaStatusPhotos] = React.useState(false);
  const [midiaStatusVideo, setMidiaStatusVideo] = React.useState(false);

  const validarTamanho = (maxSize, size, photo) => {
    if ((size / 1024) > maxSize) {
      if (photo) {
        alert("Tamanho muito grande de imagem!")
      } else {
        alert("Tamanho muito grande de video!")
      }
      return false;
    }

    return true;

  }

  const [arrayMidia, setarrayMidia] = useState({
    total: [],
  });

  const handleCapture = ({ target }) => {

    const name = target.accept.includes('image') ? 'images' : 'videos';

    for (let i = 0; i < target.files.length; i++) {

      const fileReader = new FileReader();

      const totalMidia = arrayMidia.total

      totalMidia.push(target.files[i])

      fileReader.readAsDataURL(target.files[i]);

      fileReader.onload = (e) => {

        if (name == 'images') {

          if (validarTamanho(2048, target.files[i].size, true)) {
            setMidiaStatusPhotos(true)
            const imagem = {
              base64: e.target.result,
              fileLocal: target.files[i],
              pathAmazon: ''
            }
            const imagens = midia.images
            imagens.push(imagem)
            setMidia({
              ...midia,
              images: imagens
            });

          }

        } else {

          if (validarTamanho(102040, target.files[i].size, false)) {

            setMidiaStatusVideo(true)
            const video = {
              base64: e.target.result,
              fileLocal: target.files[i],
              pathAmazon: ''
            }
            const imagens = midia.videos
            imagens.push(video)
            setMidia({
              ...midia,
              videos: imagens
            });
          }


        }

      }

    }

  };


  //////Salvar Denuncia//////

  const [values, setValues] = useState({
    title: '',
    description: '',
    categoria: ''
  });

  const handleChangeDenuncia = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleEnvio = (event) => {
    event.preventDefault();
    currentUser().then((result) => {
      const denuncia = {
        userId: result.id,
        categoryId: values.categoria,
        urgencyLevelId: "553b0d79-20c1-49f3-8c2d-820128a293af",
        reportStatusId: "48cf5f0f-40c9-4a79-9627-6fd22018f72c",
        title: values.title,
        description: values.description,
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        accuracy: 1.9,
      }
      setOpenValidador(true)
      API.post('/report', denuncia
      ).then(response => {
        console.log("teste", arrayMidia)
        if (arrayMidia.total.length > 0) {
          const idDenuncia = response.data.id;

          for (let i = 0; i < arrayMidia.total.length; i++) {
            s3(arrayMidia.total[i])
              .then((result) => {
                
                const JsonAttachment = {
                  reportId: idDenuncia,
                  mediaType: arrayMidia.total[i].type,
                  url: result.fotoUrl
                }
                API.post('/report-attachment', JsonAttachment
                ).then(response => {
                  setOpenValidador(false)

                  setErrors(["Denúncia enviada com Sucesso!"])
                  setErrorsStatus(true)
                  setTimeout(() => {
                    setErrors([]);
                  }, 10000);
                  limparForm();
                  limparMidia();
                }).catch((aError) => {
                  limparForm();
                  limparMidia();
                  setMidiaStatusPhotos(false);
                  setMidiaStatusVideo(false);
                  if (aError.response.status == 400) {
                    setOpenValidador(false)
                    console.log(aError.response.data.errors)
                    setErrors(aError.response.data.errors)

                    setTimeout(() => {
                      setErrors([]);
                    }, 10000);
                    limparForm();
                    limparMidia();
                  }
                  else if (aError.response.status == 500) {
                    setErrors([
                      "Erro servidor"
                    ])

                    setTimeout(() => {
                      setErrors([]);
                    }, 10000);
                    limparForm();
                    limparMidia();
                  }
                  setErrorsStatus(false)
                  setOpenValidador(false)

                })

              }).catch((aError) => {
                if (aError.response.status == 400) {
                  setOpenValidador(false)
                  console.log(aError.response.data.errors)
                  setErrors(aError.response.data.errors)

                  setTimeout(() => {
                    setErrors([]);
                  }, 10000);
                  limparForm();
                  limparMidia();
                }
                else if (aError.response.status == 500) {
                  setErrors([
                    "Erro servidor"
                  ])

                  setTimeout(() => {
                    setErrors([]);
                  }, 10000);
                  limparForm();
                  limparMidia();
                }
                setErrorsStatus(false)
                setOpenValidador(false)
              })
          }
        
        } else {
            console.log("entreiiieieieieii aqui")
          setOpenValidador(false)
          setErrors(["Denúncia criada com Sucesso!"])
          setErrorsStatus(true)
          setTimeout(() => {
            setErrors([]);
          }, 10000);
          limparForm();
          limparMidia();

         
        }


      }).catch((aError) => {

        if (aError.response.status == 400) {
          setOpenValidador(false)
          console.log(aError.response.data.errors)
          setErrors(aError.response.data.errors)

          setTimeout(() => {
            setErrors([]);
          }, 10000);
        }
        else if (aError.response.status == 500) {
          setErrors([
            "A campos vazios"
          ])

          setTimeout(() => {
            setErrors([]);
          }, 10000);
        }
        setErrorsStatus(false)
        setOpenValidador(false)
      })

    })

  }

  /////////Lista Categoria/////////
  const [categories, setCategories] = useState([]);

  const listCategory = () => {
    API.get('/category'
    ).then(response => {
      const listCategory2 = response.data;
      setCategories(listCategory2);
    }).catch(erro => {
      console.log(erro);
    })
  }

  //////useEffect////////
  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLongitude(longitude);
        setLatitude(latitude);
      },

      (error) => {
        console.log("ERRO! " + error.message)
      }
    )
    filterBoth();
    listCategory();

  }, [])


  /////Errros///////
  const handleSnackClick = () => {
    setErrors([]);
  }
  const [errors, setErrors] = useState([]);
  const [errorsStatus, setErrorsStatus] = useState('');
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
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={'AIzaSyDBxtpy4QlnhPfGK7mF_TnbLXooEXVPy_0'}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {locationsAproved.map(locationsMap => (
          <RoomIcon
            onClick={() => handleOpen(locationsMap.id)}
            key={locationsMap.id}
            className={style.markerApproved}
            lat={locationsMap.latitude}
            lng={locationsMap.longitude}
          />

        ))}
        {locationsFinished.map(locationsMap => (
          <RoomIcon
            onClick={() => handleOpen(locationsMap.id)}
            key={locationsMap.id}
            className={style.markerFinished}
            lat={locationsMap.latitude}
            lng={locationsMap.longitude}
          />

        ))}
        {locationsInProgress.map(locationsMap => (
          <RoomIcon
            onClick={() => handleOpen(locationsMap.id)}
            key={locationsMap.id}
            className={style.markerProgress}
            lat={locationsMap.latitude}
            lng={locationsMap.longitude}
          />
        ))}
        {locationsInAnalysis.map(locationsMap => (
          <RoomIcon
            onClick={() => handleOpen(locationsMap.id)}
            key={locationsMap.id}
            className={style.markerAnalysis}
            lat={locationsMap.latitude}
            lng={locationsMap.longitude}
          />
        ))}
        <RoomIcon />
        <RoomIcon className={style.marker} lat={-22.893186} lng={-47.166818} />

      </GoogleMapReact>

      <Grid
        className={style.gridButton}
        item
        lg={7}
        xs={12}
      >
        <div style={{ textAlign: 'left', width: 10 }}>
          <Button
            onClick={handleOpenDenuncias}
            className={style.button1}
          >Denúnciar</Button>
          <Button
            href="/historico-de-denuncias"
            className={style.button1}
          >Histórico</Button>
          <Button
            text="My Marker"
            onClick={filterFinished}
            className={style.button1}
          >Encerradas</Button>{/* ALTERAR PARA FILTRAR POR ENCERRADO */}
          <Button
            text="My Marker"
            onClick={filtroApproved}
            className={style.button1}
          >Aprovadas</Button>
          <Button
            text="My Marker"
            onClick={filtroInAnalysis}
            className={style.button1}
          >Em análise</Button>
          <Button
            text="My Marker"
            onClick={filtroInProgress}
            className={style.button1}
          >Em progresso</Button>
          <Button
            text="My Marker"
            onClick={filterBoth}
            className={style.button1}
          >Todas denúncias</Button>
        </div>

      </Grid>
      {/* MODAL */}
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={style.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            {/* DENTRO DO MODAL */}
            <div
              style={{
                overflow: 'scroll',
                height: '100%'
              }}
              className={style.paper}>
              {/* Passar o id da denúncia para reportId vvvvvvvvvvvv */}
              <Report reportId={idReportModal}></Report>
              <Button onClick={handleClose}>Voltar</Button>

            </div>
          </Fade>
        </Modal>

      </div>
      {/* FIM MODAL */}




      {/* MODAL DENUNCIA */}
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={style.modal}
          open={openDenuncias}
          onClose={handleCloseDenuncias}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openDenuncias}>
            {/* DENTRO DO MODAL */}
            <div style={{
              overflow: 'scroll',
              height: '80%'
            }}
              className={style.paper}>
              <Card>
                <form
                  autoComplete="off"
                  noValidate
                >
                  <CardHeader
                    subheader="Informe sua Denúncia"
                    title="Denúncias"
                  />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        lg={6}
                        md={6}
                        xl={12}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          helperText="Digite o título da denúncia"
                          label="Título"
                          margin="dense"
                          name="title"
                          required
                          onChange={handleChangeDenuncia}
                          value={values.title}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid
                        item
                        lg={6}
                        md={6}
                        xl={12}
                        xs={12}
                      >
                        <FormControl variant="outlined" margin="dense" fullWidth>
                          <InputLabel>Categoria:</InputLabel>
                          <Select native label="Categoria"
                            value={values.categoria}
                            onChange={handleChangeDenuncia}
                            inputProps={{
                              name: 'categoria',
                            }}
                          >
                            <option aria-label="None" value="" />
                            {categories.map(categorie => {
                              return (
                                <option value={categorie.id}>{categorie.name}</option>
                              )
                            })
                            }
                          </Select>
                        </FormControl>
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
                          onChange={handleChangeDenuncia}
                          value={values.description}
                          placeholder="Descreva sua denúncia*"
                        />

                      </Grid>

                      <Grid
                        item
                        lg={6}
                        md={6}
                        xl={12}
                        xs={12}
                        style={{
                          textAlign: 'center'
                        }}
                      >
                        {midiaStatusPhotos &&
                          <GridList
                            style={{
                              width: "100%",
                              height: "170px"
                            }}
                            cellHeight={160} className={style.gridList} cols={3}>
                            {midia.images.map((midias) => (
                              <GridListTile key={midias.fileLocal.name} cols={midias.cols || 1}>
                                <img src={midias.base64} />
                              </GridListTile>
                            ))}
                          </GridList>
                        }
                        <Fragment>
                          <input
                            accept="image/*"
                            className={style.input}
                            id="icon-button-photo"
                            onChange={handleCapture}
                            multiple
                            type="file"
                          />
                          <label htmlFor="icon-button-photo">
                            <IconButton
                              style={{
                                textAlign: 'center'
                              }}
                              color="primary" component="span">
                              <PhotoCamera />
                            </IconButton>
                          </label>
                        </Fragment>
                      </Grid>
                      <Grid
                        item
                        lg={6}
                        md={6}
                        xl={12}
                        xs={12}
                        style={{
                          textAlign: 'center'
                        }}
                      >
                        {midiaStatusVideo &&
                          <GridList
                            style={{
                              width: "100%",
                              height: "170px"
                            }}
                            cellHeight={160} className={style.gridList} cols={3}>
                            {midia.videos.map((videos) => (
                              <GridListTile key={videos.fileLocal.name} cols={videos.cols || 1}>
                                <video controls
                                  width='100%'
                                  height='auto'
                                >
                                  <source src={videos.base64} />
                                </video>
                              </GridListTile>
                            ))}
                          </GridList>
                        }
                        < Fragment >
                          <input
                            accept="video/*"
                            capture="camcorder"
                            className={style.input}
                            id="icon-button-video"
                            onChange={handleCapture}
                            multiple
                            type="file"
                          />
                          <label htmlFor="icon-button-video">
                            <IconButton
                              color="primary" component="span">
                              <Videocam />
                            </IconButton>
                          </label>
                        </Fragment>
                      </Grid>



                    </Grid>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Grid
                      item
                      lg={6}
                      md={6}
                      xl={6}
                      xs={6}
                    >
                      <Button
                        color="primary"
                        onClick={handleCloseDenuncias}
                        variant="contained"
                        style={{
                          background: 'red'
                        }}

                      >
                        Fechar
                     </Button>
                    </Grid>

                    <Grid
                      item
                      lg={6}
                      md={6}
                      xl={6}
                      xs={6}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleEnvio}
                        style={{ background: 'green', float: 'right' }}
                      >
                        Enviar
                     </Button>
                    </Grid>
                  </CardActions>
                </form>
              </Card>
            </div>
          </Fade>
        </Modal>

      </div>
      {/* FIM MODAL */}

      <Snackbar open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
      <Backdrop
        style={{ zIndex: 99999999 }}
        className={style.backdrop} open={openValidador} onClick={handleCloseValidador}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div >
  )
}

export default ReportMap;
