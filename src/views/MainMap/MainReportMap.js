import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';
import RoomIcon from '@material-ui/icons/Room';
import Report from 'components/Report';
import {
  Button,
  Grid,
} from '@material-ui/core';
import 'react-html5-camera-photo/build/css/index.css';
//MODAL
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import API from '../../utils/API';
import s3 from 'utils/AWS-S3'
import GoogleMapReact from 'google-map-react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import ReportStatus from 'utils/ReportStatus';
import { ReactBingmaps } from 'react-bingmaps';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';


const styles = makeStyles(theme => ({
  gridButton: {
    position: "absolute",
    marginTop: -500,
    textAlign: 'right',
    //marginTop: "-35%",
    marginLeft: 5,
    //alignSelf: "center"
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
    overflow: 'scroll'
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


}));

const MainReportMap = props => {

  function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
      target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
      elevation: trigger ? 4 : 0,
    });
  }

  const [locationsInAnalysis, setLocationsInAnalysis] = useState([]);
  const [locationsInProgress, setLocationsInProgress] = useState([]);
  const [locationsAproved, setLocationsApproved] = useState([]);
  const [locationsFinished, setLocationsFinished] = useState([]);

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [idReportModal, setidReportModal] = useState('');

  const carregarAprovadas = () => {
    API.get('/report?status=' + ReportStatus.Aprovado()
    ).then(response => {
      const report = response.data
      response.data.forEach(element => {
        // adicionarDenunciaNoMapa('yellow', element)
      });
      setLocationsApproved(report)
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }
  const carregarFinalizadas = () => {
    API.get('/report?status=' + ReportStatus.Finalizada()
    ).then(response => {
      const report = response.data
      response.data.forEach(element => {
        // adicionarDenunciaNoMapa('green', element)
      });
      setLocationsFinished(report)
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }
  const carregarEmProgresso = () => {
    API.get('/report'
    ).then(response => {
      const reports = []

      response.data.forEach(element => {

        if ((ReportStatus.EmProgresso() == element.reportStatusId) && emProgresso) {
          reports.push(adicionarDenunciaNoMapa('blue', element))
        }
        else if ((ReportStatus.Finalizada() == element.reportStatusId) && finalizadas) {
          reports.push(adicionarDenunciaNoMapa('green', element))
        }
        else if ((ReportStatus.Aprovado() == element.reportStatusId) && aprovadas) {
          reports.push(adicionarDenunciaNoMapa('yellow', element))
        }

      });

      setDenuncias({
        ...denuncias,
        pins: reports
      })
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }

  const adicionarDenunciaNoMapa = (cor, denuncia) => {
    return {
      location: [denuncia.latitude, denuncia.longitude],
      option: {
        title: denuncia.title,
        color: cor,
      },
      addHandler: {
        type: "click",
        callback: () => openModalReport(denuncia.id)
      }
    }
  }

  const openModalReport = (message) => {
    setidReportModal(message)
    setOpen(true);
  }

  const [denuncias, setDenuncias] = useState({
    pins: [],
  })

  const carregarTodas = () => {
    // setDenuncias({
    //   pins: []
    // })
    // console.log(denuncias)
    // if (emProgresso) {
    carregarEmProgresso();
    // }
    // if (aprovadas) {
    //   carregarAprovadas();
    // }
    // if (finalizadas) {
    //   carregarFinalizadas();
    // }    
    // carregarAprovadas();
    // carregarFinalizadas();
    // carregarEmProgresso()
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        const { latitude, longitude } = position.coords;
        setLongitude(longitude);
        setLatitude(latitude);
        carregarTodas()
      },

      (error) => {
        console.log("ERRO! " + error.message)
      }
    )
    // const interval = setInterval(() => {
    //   carregarTodas();
    // }, 10000);
    // return () => interval;    
  }, [])

  const style = styles();

  const [clicked, setClicked] = useState({
    check: false
  });

  const defaultProps = {
    center: {
      lat: latitude,
      lng: longitude
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

  const [openDenuncias, setOpenDenuncias] = React.useState(false);

  const handleOpenDenuncias = props => {
    setOpenDenuncias(true);
  };

  const handleCloseDenuncias = () => {
    setOpenDenuncias(false);
  };
  /* FIM MODAL */

  const handleFinalizadas = () => {
    setFinalizadas(!finalizadas);
    carregarTodas();
  };

  const handleEmProgresso = () => {
    setEmProgresso(!emProgresso);
    carregarTodas();
  }

  const handleAprovadas = () => {
    setAprovadas(!aprovadas)
    carregarTodas();
  }
  const [finalizadas, setFinalizadas] = React.useState(true);
  const [emProgresso, setEmProgresso] = React.useState(true);
  const [aprovadas, setAprovadas] = React.useState(true);


  return (

    <React.Fragment>
      {/* <CssBaseline /> */}
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={finalizadas} onClick={handleFinalizadas} />}
                label="Denúncias finalizadas"
              />
              <FormControlLabel
                control={<Checkbox checked={emProgresso} onClick={handleEmProgresso} />}
                label="Denúncias em progresso"
              />
              <FormControlLabel
                control={<Checkbox checked={aprovadas} onClick={handleAprovadas} />}
                label="Denúncias aprovadas"
              />
            </FormGroup>
            <Button
              onClick={() => carregarTodas()}
            >
              <SearchIcon />
            </Button>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div style={{ height: '100vh', width: '100%' }}>
        {/* <GoogleMapReact
          bootstrapURLKeys={'AIzaSyDBxtpy4QlnhPfGK7mF_TnbLXooEXVPy_0'}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {locationsAproved.map(locationsMapAproved => (
            <RoomIcon
              onClick={() => handleOpen(locationsMapAproved.id)}
              key={locationsMapAproved.id}
              className={style.markerApproved}
              lat={locationsMapAproved.latitude}
              lng={locationsMapAproved.longitude}
            />

          ))}
          {locationsFinished.map(locationsMapFinished => (
            <RoomIcon
              onClick={() => handleOpen(locationsMapFinished.id)}
              key={locationsMapFinished.id}
              className={style.markerFinished}
              lat={locationsMapFinished.latitude}
              lng={locationsMapFinished.longitude}
            />

          ))}
          {locationsInProgress.map(locationsMapProgress => (
            <RoomIcon
              onClick={() => handleOpen(locationsMapProgress.id)}
              key={locationsMapProgress.id}
              className={style.markerProgress}
              lat={locationsMapProgress.latitude}
              lng={locationsMapProgress.longitude}
            />
          ))}
        </GoogleMapReact> */}

        <ReactBingmaps
          bingmapKey="AhB03kPUyRzwqaJu5TId4Ny9-WKbQzvOHxDrKtJaIqFEN9iLwfk5fWZD-5nZCVXv"
          center={[latitude, longitude]}
          pushPins={denuncias.pins}
          zoom={18}
        >
        </ReactBingmaps>

        <Grid
          className={style.gridButton}
          item
          lg={7}
          xs={12}
        >
          <div style={{ textAlign: 'left', width: 10 }}>
            <Button
              href='/sign-in'
              className={style.button1}
            >Denúnciar</Button>
          </div>


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
              <Fade


                in={open}>
                {/* DENTRO DO MODAL */}
                <div style={{
                  overflow: 'scroll',
                  height: '80%'
                }} className={style.paper}>

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

                  {/* Passar o id da denúncia para reportId vvvvvvvvvvvv */}
                  <Report reportId={idReportModal}></Report>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    xl={12}
                    xs={12}
                  >
                    <Button
                      color="default"
                      onClick={handleClose}
                      variant="contained"
                      style={{ float: 'right' }}
                    >
                      Fechar
                             </Button>
                  </Grid>

                </div>
              </Fade>
            </Modal>
          </div>
        </Grid>
        {/* FIM MODAL */}
      </div>
      <Toolbar />
    </React.Fragment>
  )
}

export default MainReportMap;
