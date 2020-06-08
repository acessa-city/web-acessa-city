import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  Backdrop,
  CircularProgress,  
  TextField,
  Link,
  Typography,
  Snackbar,
  SnackbarContent  
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CreateUser from 'views/User/CreateUser'
import api from 'utils/API';

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
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
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const [errors, setErrors] = useState([]);
  const [created, setCreated] = useState(false);
  const [errorsStatus, setErrorsStatus] = useState('');
  const [openValidador, setOpenValidador] = React.useState(false);
  const handleCloseValidador = () => {
    setOpenValidador(false);
  };  

  const _createUser = () => {
    const userData = {
      email: formState.values.email,
      emailVerified: true,
      password: formState.values.password,
      displayName: formState.values.firstName + ' ' + formState.values.lastName,
      disabled: false
    }
    createUser(userData);
  }

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

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

  const createUser = (user) => {
    setOpenValidador(true)
    api.post('/user', user)
      .then((result) => {
        setCreated(true)
        setOpenValidador(false)
        setErrors([
          "O usuário " + user.email + " foi criado com sucesso."])
        setErrorsStatus(true)
        setTimeout(() => {
          history.push('/');
        }, 7000);        
      })
      .catch((aError) => {
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
            "Erro no servidor"
          ])

          setTimeout(() => {
            setErrors([]);
          }, 10000);
        }
        setErrorsStatus(false)
        setOpenValidador(false)
      })
  }

  const erros = () => {
    if (errorsStatus == true) {
      return (
        <div>
          {errors.map(error => (
            <SnackbarContent
              style={{
                background: 'green',
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
              }}
              message={<h3>{error}</h3>}
            />
          ))}
        </div>)
    }

  }  

  const handleSnackClick = () => {
    setErrors([]);
  }  

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    event.preventDefault();
    _createUser();
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
                onSubmit={handleSignUp}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Criar uma nova conta - Acessa City
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Utilize o seu e-mail para criar uma nova conta
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('firstName')}
                  fullWidth
                  helperText={
                    hasError('firstName') ? formState.errors.firstName[0] : null
                  }
                  label="Nome"
                  name="firstName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.firstName || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('lastName')}
                  fullWidth
                  helperText={
                    hasError('lastName') ? formState.errors.lastName[0] : null
                  }
                  label="Sobrenome"
                  name="lastName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.lastName || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email"
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
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid || created}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Registrar
                </Button>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Já tem uma conta?{' '}
                  <Link
                    component={RouterLink}
                    to="/sign-in"
                    variant="h6"
                  >
                    Login
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
      <Snackbar open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
      <Backdrop 
      style={{ zIndex: 99999999}}
      className={classes.backdrop} open={openValidador} onClick={handleCloseValidador}>
        <CircularProgress color="inherit" />
      </Backdrop>      
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
