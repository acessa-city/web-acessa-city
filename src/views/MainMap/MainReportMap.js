import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/styles';
import RoomIcon from '@material-ui/icons/Room';
import Report from 'components/Report';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


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
  Avatar
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

import API from '../../utils/API';
import s3 from 'utils/AWS-S3'
import currentUser from 'utils/AppUser';
import GoogleMapReact from 'google-map-react';

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

  const [locationsInAnalysis, setLocationsInAnalysis] = useState([]);
  const [locationsInProgress, setLocationsInProgress] = useState([]);
  const [locationsAproved, setLocationsApproved] = useState([]);
  const [locationsFinished, setLocationsFinished] = useState([]);

  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [idReportModal, setidReportModal] = useState('');

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
    API.get('/report?status=ee6dda1a-51e2-4041-9d21-7f5c8f2e94b0' /*MOSTRANDO AS NEGADAS (ALTERAR PARA ENCERRADAS)*/
    ).then(response => {
      const report = response.data
      setLocationsFinished(report)
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
        const { latitude, longitude } = position.coords;
        setLongitude(longitude);
        setLatitude(latitude);
      },

      (error) => {
        console.log("ERRO! " + error.message)
      }
    )
    filterBoth();

  }, []) 

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

  const handleCloseDenuncias = () => {
    setOpenDenuncias(false);
  };
  /* FIM MODAL */

  var fileUploadInput = React.createRef();

  const showFileUpload = (e) => {
    fileUploadInput.current.click();
  }

  const updatePhoto = photoUrl => {

    // const update = {
    //   userId: user.id,
    //   photoURL: photoUrl
    // }

    // api.put('/user/update-photo-profile', update)
    //   .then(response => {
    //     setUser(response.data)
    //   })
  }

  const uploadFileImg = (e) => {
    s3(e.target.files[0])
      .then((result) => {
        const photo = result.fotoUrl
        updatePhoto(photo)

      }).catch((erro) => {

      })
  }
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
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
        {locationsInAnalysis.map(locationsMapAnalysis => (
          <RoomIcon
            onClick={() => handleOpen(locationsMapAnalysis.id)}
            key={locationsMapAnalysis.id}
            className={style.markerAnalysis}
            lat={locationsMapAnalysis.latitude}
            lng={locationsMapAnalysis.longitude}
          />
        ))}
      </GoogleMapReact>

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
            <div className={style.paper}>
              {/* Passar o id da denúncia para reportId vvvvvvvvvvvv */}
              <Report reportId={idReportModal}></Report>
              <Button onClick={handleClose}>Voltar</Button>
            </div>
          </Fade>
        </Modal>
      </div>
      {/* FIM MODAL */}
    </div>
  )
}

export default MainReportMap;
