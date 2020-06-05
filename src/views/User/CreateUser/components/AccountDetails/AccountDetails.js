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
    password: '',
    role: '',
  });

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [errors, setErrors] = useState([]);
  const [errorsStatus, setErrorsStatus] = React.useState(true);

  const [userLogado, setUserLogado] = useState({});

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSnackClick = () => {
    setErrors([]);
  }

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


  // const [password, setPassword] = useState({
  //   password: '',
  //   confirmPassword: ''
  // });

  //const handleChange2 = (keyName, e) => { setPassword({ ...password, [keyName]: e.target.value }); }


  const handleClick = (event) => {
    event.preventDefault();

    //campoVazio(values)

    const userCreate = {

      cityHallId: userLogado.cityHallId,
      email: values.email,
      emailVerified: true,
      password: values.password,
      displayName: values.name + ' ' + values.lastName,
      photoUrl: 'https://acessacity.s3.amazonaws.com/photos/user.png',
      disabled: false,
      roles: [
        values.role
      ]
    }
    console.log("teste", userCreate);
    props.createUser(userCreate);
    limparForm()
  }

  const limparForm = () => {
    setValues({
      name: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
    })
  }

  const teste = () => {
    return (<div>
      {errors.map(error => (
        <SnackbarContent message={<h3>{error}</h3>} />
      ))}
    </div>)
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
          <CardHeader
            subheader="Criar um novo coordenador ou moderador"
            title="Criar novo usuário"
          />
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
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
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
              </Grid>
              <Grid
                item
                md={4}
                xs={12}
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
              </Grid>
              <Grid
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
              {/* <Grid item xs={12} md={3}>
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
            <Button
              // disabled={!password.password || password.password != password.confirmPassword} 
              color="primary"
              variant="contained"
              onClick={handleClick}
            >
              Salvar
            </Button>
          </CardActions>
        </form>
      </Card>
      <Snackbar open={errors.length} autoHideDuration={20000} onClick={handleSnackClick}>
        {teste()}
      </Snackbar>
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div >
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
