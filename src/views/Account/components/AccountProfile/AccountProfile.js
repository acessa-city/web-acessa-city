import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress,
  Backdrop,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import s3 from 'utils/AWS-S3'
import api from 'utils/API'
import currentUser from 'utils/AppUser'

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 100,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  var fileUploadInput = React.createRef();

  const showFileUpload = (e) => {
    fileUploadInput.current.click();
  }

  const updatePhoto = photoUrl => {

    const update = {
      userId: user.id,
      photoURL: photoUrl
    }
    const url = photoUrl;
    setOpenValidador(true)
    if(url){
      api.put('/user/update-photo-profile', update)
      .then(response => {
        setErrorsStatus(true)
        setOpenValidador(false)
        setErrors(["Foto Atualizada com sucesso."])
        setTimeout(() => {
          setErrors([]);
        }, 2000);
        setUser(response.data)
        
      }).catch((erro) => {
        setOpenValidador(false)
        setErrors(["Não foi possivel atualizar a foto."])
        setErrorsStatus(false)
        setTimeout(() => {
          setErrors([]);
        }, 2000);
      })
    }else{
      api.put('/user/update-photo-profile', update)
      .then(response => {
        setErrorsStatus(true)
        setOpenValidador(false)
        setErrors(["Foto Removida."])
        setTimeout(() => {
          setErrors([]);
        }, 2000);
        setUser(response.data)
        
      }).catch((erro) => {
        setOpenValidador(false)
        setErrors(["Não foi possivel remover a foto Removida."])
        setErrorsStatus(false)
        setTimeout(() => {
          setErrors([]);
        }, 2000);
      })
    }
    
  }

  const uploadFileImg = (e) => {
      
    s3(e.target.files[0])
      .then((result) => {
        const photo = result.fotoUrl
        updatePhoto(photo)

      }).catch((erro) => {
       console.log(erro);
      })
  }

  const [user, setUser] = useState({});

  useEffect(() => {
    console.log(2)
    currentUser()
      .then(fuser => {
        setUser(fuser)
      })
  }, [])


  const [errors, setErrors] = useState([]);
  const [errorsStatus, setErrorsStatus] = useState('');
  const [openValidador, setOpenValidador] = React.useState(false);
  const handleCloseValidador = () => {
    setOpenValidador(false);
  };
  const handleSnackClick = () => {
    setErrors([]);
  }
  const [errorsStatus2, setErrorsStatus2] = useState('');
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
    <div>
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography
                gutterBottom
                variant="h2"
              >
                {user.firstName}  { user.lastName}
              </Typography>
              <Typography
                className={classes.locationText}
                color="textSecondary"
                variant="body1"
              >
                {user.email}
              </Typography>
            </div>

            <input
              onChange={uploadFileImg}
              type="file"
              id="my_file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileUploadInput}
            />
            <Avatar
              className={classes.avatar}
              src={user.profileUrl}
              onClick={showFileUpload}
            />

          </div>
          {/* <div className={classes.progress}>
            <Typography variant="body1">Profile Completeness: 70%</Typography>
            <LinearProgress
              value={70}
              variant="determinate"
            />
          </div> */}
        </CardContent>
        <Divider />
        <CardActions>
          <input onChange={uploadFileImg} type="file" id="my_file" accept="image/*"
            hidden={true}
            ref={fileUploadInput}
          />
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
            onClick={() => fileUploadInput.current.click()}
          >
            Atualizar foto
          </Button>
          <Button onClick={() => updatePhoto("")} variant="text">Remover foto</Button>
        </CardActions>
      </Card>

      <Snackbar open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
      <Backdrop style={{zIndex: 999999999999999}} className={classes.backdrop} open={openValidador} onClick={handleCloseValidador}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
