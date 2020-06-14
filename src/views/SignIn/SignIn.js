import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  Backdrop,
  Card,
  CardActions,
  CardContent,
  Divider
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { asyncLogin, logout } from '../../utils/auth';
//Modal
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from 'firebase/app';

import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'é obrigatório' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'é obrigatório' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    // textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
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
}));

const SignIn = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleBack = () => {
    history.goBack();
  };

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleGoogleSignin = event => {
    event.preventDefault();

    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(googleAuthProvider)
      .then((result) => {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            user.getIdTokenResult().then((token) => {
              asyncLogin(token.token).then(result => {
                window.location = '/';
              })
                .catch(error => {
                  console.log(error)
                })
            })
              .catch(error => {
                console.log(error)
              })
          }
        })
      }).catch((error) => {
        if (error.code == 'auth/wrong-password') {
          setErrors(["Falha ao realizar o login. O usuário ou senha é uma entrada inválida."])
          setErrorsStatus(false)
          setTimeout(() => {
            setErrors([]);
          }, 2000);
        }
      })
  }

  const hanldeFacebookSignin = event => {
    event.preventDefault();

    const facebookProvider = new firebase.auth.FacebookAuthProvider;

    firebase.auth().signInWithPopup(facebookProvider)
      .then((result) => {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            user.getIdTokenResult().then((token) => {
              asyncLogin(token.token).then(result => {
                window.location = '/';
              })
                .catch(error => {
                  console.log(error)
                })
            })
              .catch(error => {

              })
          }
        })
      }).catch((error) => {
        console.log(error)
      })

  }

  const logout = event => {
    event.preventDefault();
    firebase.auth().signOut();
  }

  const handleSignIn = event => {
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(formState.values.email, formState.values.password)
      .then((result) => {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            user.getIdTokenResult().then((token) => {
              console.log(token.token)
              asyncLogin(token.token).then(result => {
                window.location = '/'
              })
                .catch(error => {
                  console.log(error)
                })
            })
              .catch(error => {
              })
          }
        })
      }).catch((error) => {

        console.log(error);
        if (error.code == 'auth/wrong-password' || error.code == 'auth/user-not-found') {

          setErrors(["Falha ao realizar o login. O usuário ou senha é uma entrada inválida."])
          setErrorsStatus(false)
          setTimeout(() => {
            setErrors([]);
          }, 3000);

        }
      });

  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const [values2, setValues2] = useState({
    email: '',
  });

  const handleChange2 = event => {
    setValues2({
      ...values2,
      [event.target.name]: event.target.value
    });
  };


  const [openAlerta, setOpenAlerta] = React.useState(false);

  const handleRecuperar = (categoriesD) => {
    setOpenAlerta(true);
  };

  const handleCloseRecuperar = () => {
    setOpenAlerta(false);
  };



  const handleEnvio = () => {
    if (values2.email == '') {
      setErrors(["Precisa preencher o campo email."])
      setErrorsStatus(false)
      setTimeout(() => {
        setErrors([]);
      }, 3000);

    } else {
      console.log(values2);
      var auth = firebase.auth();
      setOpenValidador(true)
      auth.sendPasswordResetEmail(values2.email).then(function () {
        setOpenValidador(false)
        setErrors([
          "Foi enviado um email de recuperação para o " + values2.email + ", com sucesso."])
        setErrorsStatus(true)
        setTimeout(() => {
          setErrors([]);
        }, 5000);

      }).catch(function (error) {
        setOpenValidador(false)
        setErrors(["Precisa preencher o campo email."])
        setErrorsStatus(false)
        setTimeout(() => {
          setErrors([]);
        }, 3000);
      });
    }

  }


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
    <div className={classes.root}>

      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                Acessa City
              </Typography>
              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="h1"
                >
                  Colaboração social em tempo real
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignIn}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Fazer login - Acessa City
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Bem-vindo de volta.
                </Typography>
                <Grid
                  className={classes.socialButtons}
                  container
                  spacing={1}
                >
                  {/* <Grid item>
                    <Button
                      color="primary"
                      onClick={hanldeFacebookSignin}
                      size="large"
                      variant="contained"
                    >
                      <FacebookIcon className={classes.socialIcon} />
                      Login com Facebook
                    </Button>
                  </Grid> */}
                  <Grid item>
                    <Button
                      onClick={handleGoogleSignin}
                      size="large"
                      variant="contained"
                    >
                      <GoogleIcon className={classes.socialIcon} />
                      Login com Google
                    </Button>
                  </Grid>
                </Grid>
                <Typography
                  align="center"
                  className={classes.sugestion}
                  color="textSecondary"
                  variant="body1"
                >
                  Administração? Faça login com suas credenciais.
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Endereço de e-mail"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Senha"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                />
                <Button
                  className={classes.signInButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Entrar agora
                </Button>
                <Grid
                  container
                  spacing={1}
                >
                  <Grid
                    item
                    lg={6}
                    md={6}
                    xl={12}
                    xs={12}
                  >
                    <Typography
                      color="textSecondary"
                      variant="body1"
                    >
                      Ainda não tem uma conta?{' '}
                      <Link
                        component={RouterLink}
                        to="/sign-up"
                        variant="h6"
                      >
                        Cadastre-se
                  </Link>
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    lg={6}
                    md={6}
                    xl={12}
                    xs={12}
                  >
                    <Button
                      style={{
                        float: 'right'
                      }}
                      variant="outlined" color="primary"
                      onClick={handleRecuperar}>
                      Recuperar Senha
                   </Button>
                  </Grid>
                </Grid>

                <Dialog open={openAlerta} onClose={handleCloseRecuperar} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Recuperação de senha!</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Se realmente precisa recuperar sua senha, digite seu email e selecione a opção sim e chegará um email de recuperação na seu email.
                     </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      onChange={handleChange2}
                      value={values2.email}
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseRecuperar} color="primary">
                      Não
                    </Button>
                    <Button onClick={handleEnvio} color="primary">
                      Sim
                    </Button>
                  </DialogActions>
                </Dialog>

              </form>
            </div>
          </div>
        </Grid>
      </Grid>

      <Snackbar open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
      <Backdrop
        style={{ zIndex: 99999999 }}
        className={classes.backdrop} open={openValidador} onClick={handleCloseValidador}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};


SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
