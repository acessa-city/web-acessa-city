import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  Backdrop,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';

import currentUser from 'utils/AppUser';

const useStyles = makeStyles((theme) => ({
  root: {},
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const AccountDetails = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    lastName: '',
    email: '',
    role: '',

  });

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [userLogado, setUserLogado] = useState({});

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };



  // const campoVazio = values =>{

  //   values.name === '' ||
  //   values.cnpj=== ''||
  //   values.email=== ''||
  //   values.address=== ''||
  //   values.neighborhood=== ''||
  //   values.zipCode=== ''||
  //   values.number=== ''||
  //   values.cityId=== ''
  //   ?  
  //   setErrors([
  //     "Existem campos vazios."
  //   ]) : 
  //   setErrorsStatus(false);
  // }


  const [password, setPassword] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange2 = (keyName, e) => { setPassword({ ...password, [keyName]: e.target.value }); }


  const handleClick = (event) => {
    event.preventDefault();


    if (password.password != password.confirmPassword) {
      setErrorsStatus(false)
      setErrors([
        "A senha é diferente da confirmação de senha"
      ])
      setTimeout(() => {
        setErrors([]);
      }, 2000);
    } else if (password.password.length < 6) {
      setErrorsStatus(false)
      setErrors([
        "A senha deve conter pelo menos 6 caracteres"
      ])
      setTimeout(() => {
        setErrors([]);
      }, 2000);

    } else {

      const userCreate = {
        cityHallId: userLogado.cityHallId,
        email: values.email,
        emailVerified: true,
        password: password.password,
        displayName: values.name + ' ' + values.lastName,
        photoUrl: 'https://acessacity.s3.amazonaws.com/photos/user.png',
        disabled: false,
        roles: [
          values.role
        ]
      }

      setOpenValidador(true)
      if (values.role && values.name && values.email) {
        setOpenValidador(false)
        props.createUser(userCreate);
        limparForm()
      } else {
        setOpenValidador(false)
        setErrorsStatus(false)
        setErrors([
          "Há campos vazios"
        ])
        setTimeout(() => {
          setErrors([]);
        }, 2000);
      }

    }

  }

  const limparForm = () => {
    setValues({
      name: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
    })

    setPassword({
      password: '',
      confirmPassword: '',
    })
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
  const [roles, setRoles] = useState({
    loaded: false,
  });

  React.useEffect(() => {

    currentUser().then((result) => {
      setUserLogado(result);
      setRoles({
        ...roles,
        loaded: true,
        admin: result.roles.includes('admin'),
        city_hall: result.roles.includes('city_hall'),
      })
    })

  }, []);

  return (
    <div>
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form
          autoComplete="off"
          noValidate
        >
          {roles.admin &&
            <CardHeader
              subheader="Criar Admin ou Usuário"
              title="Criar novo usuário"
            />
          }

          {roles.city_hall &&
            <CardHeader
              subheader="Criar coordenador ou Moderador"
              title="Criar novo usuário"
            />
          }

          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <form
                  noValidate
                  autoComplete="off"
                >
                <TextField
                  fullWidth
                  helperText="Informe o primeiro nome"
                  label="Primeiro nome"
                  margin="dense"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                  variant="outlined"
                />
                </form>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                 <form
                  noValidate
                  autoComplete="off"
                >
                <TextField
                  fullWidth
                  helperText="Informe o sobrenome"
                  label="Sobrenome"
                  margin="dense"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                  variant="outlined"
                />
                </form>
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
              >
                 <form
                  noValidate
                  autoComplete="off"
                >
                <TextField
                  fullWidth
                  helperText="Informe o endereço de e-mail"
                  label="Endereço de e-mail"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                  variant="outlined"
                />
                </form>
              </Grid>


              <Grid item xs={12} md={3}>
              <form
                  noValidate
                  autoComplete="off"
                >
                <TextField
                  fullWidth
                  error={password.password != password.confirmPassword}
                  helperText="Senha"
                  label="Senha"
                  margin="dense"
                  name="password"
                  type="password"
                  required
                  value={password.password}
                  onChange={sender => handleChange2('password', sender)}
                  variant="outlined"
                />
                </form>
              </Grid>
    
              <Grid item xs={12} md={3}>
              <form
                  noValidate
                  autoComplete="off"
                >
                <TextField
                  fullWidth
                  error={password.password != password.confirmPassword}
                  helperText="Confirmar senha"
                  label="Confirmação da senha"
                  margin="dense"
                  name="confirmPassword"
                  type="password"
                  required
                  onChange={sender => handleChange2('confirmPassword', sender)}
                  value={password.confirmPassword}
                  variant="outlined"
                />
                </form>
              </Grid>

              {/* <Grid
                item
                md={3}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText="Informe a senha"
                  label="Senha"
                  margin="dense"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  error={password.password != password.confirmPassword}
                  helperText="Confirmar senha"
                  label="Confirmação da senha"
                  margin="dense"
                  name="confirmPassword"
                  type="password"
                  required
                  onChange={sender => handleChange('confirmPassword', sender)}
                  value={password.confirmPassword}
                  variant="outlined"
                />
              </Grid> */}

              <Grid
                item
                md={2}
                xs={12}
              >
                <FormControl variant="outlined" margin="dense" fullWidth>
                  <InputLabel>Tipo:</InputLabel>
                  {roles.admin &&
                    <Select native
                      label="Role"
                      value={values.role}
                      onChange={handleChange}
                      label="Role"
                      inputProps={{
                        name: 'role',
                      }}>

                      <option aria-label="None" value="" />
                      <option value='admin'>Admin</option>
                      <option value='user'>Usuários</option>

                    </Select>
                  }

                  {roles.city_hall &&
                    <Select native
                      label="Role"
                      value={values.role}
                      onChange={handleChange}
                      label="Role"
                      inputProps={{
                        name: 'role',
                      }}>

                      <option aria-label="None" value="" />
                      <option value='coordinator'>Coordenador</option>
                      <option value='moderator'>Moderador</option>

                    </Select>
                  }
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={handleClick}
                style={{ background: '#1b5e20', float: 'right' }}
              >
                Cadastrar
                             </Button>
            </Grid>
          </CardActions>
        </form>
      </Card>
      <Snackbar open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
      <Backdrop
        style={{ zIndex: 99999999 }}
        className={classes.backdrop} open={openValidador} onClick={handleCloseValidador}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div >
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
