import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/styles';
import RoomIcon from '@material-ui/icons/Room';
import Report from 'components/Report';


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
  Box
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
import { useState, useEffect } from 'react';
import currentUser from 'utils/AppUser';
import GoogleMapReact from 'google-map-react';

const styles = makeStyles(theme=>({
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
  marker: {
    color: "red",
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
  },
  button1:{
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
  }

}));

const ReportMap = props => {

  const [locations, setLocations] = useState([])
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [idReportModal, setidReportModal] = useState('')
 
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
    API.get('/report'
    ).then(response => {
      const report = response.data
      setLocations(report)      
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
  }, [])

const filtroEncerradas = () =>{
  API.get('/report?status=c37d9588-1875-44dd-8cf1-6781de7533c3'
    ).then(response => {
      const report = response.data
      setLocations(report)     
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
}

const filtroAprovadas = () =>{
  API.get('/report?status=96afa0df-8ad9-4a44-a726-70582b7bd010'
    ).then(response => {
      const report = response.data
      setLocations(report)     
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
}

const filtrarTodas = () =>{
  API.get('/report'
    ).then(response => {
      const report = response.data
      setLocations(report)     
    }).catch(erro => {
      console.log(erro);
      /* setMensagem('Ocorreu um erro', erro);
      setOpenDialog(true); */
    })
}

  const teste = () => {

    console.log("ESTADO " + JSON.stringify(locations[0].latitude));
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

  const handleClose = () => {
    setOpen(false);
  };
/* FIM MODAL */

  
  return (    
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={'AIzaSyDBxtpy4QlnhPfGK7mF_TnbLXooEXVPy_0'}
        defaultCenter={defaultProps.center}        
        defaultZoom={defaultProps.zoom}
      >

        
          {locations.map(locationsMap => (  
            console.log(locationsMap ),
            <RoomIcon     
            //Abrir o modal (fazer)
            onClick={() => handleOpen(locationsMap.id)}
            key={locationsMap.id} 
            className={style.marker} 
            lat={locationsMap.latitude} 
            lng={locationsMap.longitude} 
          />
      
    ))}
        <RoomIcon/>
        <RoomIcon className={style.marker}  lat={-22.893186} lng={-47.166818} />    
       
      </GoogleMapReact>
      
      <Grid
        className={style.gridButton}
        item
        lg={7}
        xs={12}
      >
        <div style={{ textAlign: 'left', width: 10 }}>
          <Button
            href="/criar-denuncia"
            className={style.button1}
          >DENÚNCIAR
          </Button>          

          <Button
          text="My Marker"
          onClick={filtroEncerradas}          
          className={style.button1}
          >
          EM PROGRESSO
          
          </Button>   

          <Button
          text="My Marker"
          onClick={filtroAprovadas}          
          className={style.button1}
          
          >
          APROVADAS
          
          </Button>       
          <Button
          text="My Marker"
          onClick={filtrarTodas}          
          className={style.button1}
          >
          TODAS DENÚNCIAS
          
          </Button>
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
            <Button>Voltar</Button>                                    
           
          </div>
        </Fade>
      </Modal>
    
      </div>
      {/* FIM MODAL */}


    </div>
  )
}

export default ReportMap;
