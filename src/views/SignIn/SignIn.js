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
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { asyncLogin, logout } from '../../utils/auth';

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
  }
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
        firebase.auth().onAuthStateChanged(function(user) {
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
        if (error.code == 'auth/wrong-password')
        {
          alert('Falha ao realizar o login. O usuário ou senha é uma entrada inválida.')
        }
      })     
  }

  const hanldeFacebookSignin = event => {
    event.preventDefault();

    const facebookProvider = new firebase.auth.FacebookAuthProvider;
    
    firebase.auth().signInWithPopup(facebookProvider)
    .then((result) => {          
      firebase.auth().onAuthStateChanged(function(user) {
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
        firebase.auth().onAuthStateChanged(function(user) {
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
        if (error.code == 'auth/wrong-password')
        {
          alert('Falha ao realizar o login. O usuário ou senha é uma entrada inválida.')
        }
      });
  
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

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
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};


SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
