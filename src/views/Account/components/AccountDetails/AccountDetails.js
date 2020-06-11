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
  TextField
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import API from 'utils/API'
import currentUser from 'utils/AppUser';
import firebase from 'firebase/app'

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, userId, ...rest } = props;


  const classes = useStyles();


  const [user, setUser] = useState({})

  const[controleUser, setControleUser] = useState('');

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const enviaEmailRecuperacaoSenha = (userEmail) => {
    var auth = firebase.auth();
    
    auth.sendPasswordResetEmail(userEmail).then(function() {
      alert('Email enviado com sucesso')
    }).catch(function(error) {
      alert('Falha no envio do e-mail');
      console.log(error);
    });
  }


  const handleClickAlterar = (event) => {
    event.preventDefault();

    if (!userId) {
      currentUser().then((result) => {
        const alter = {
          userId: result.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        }
        
        API.put('/user/update-data-profile',alter).then((result) => {
  
          console.log('sucesso')
        }).catch((erro) => {
          console.log('erro', erro.message);
        })

      }).catch((erro) => {
        console.log("erro", erro)
      })
    } else {
      const alter = {
        userId: userId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      }

      API.put('/user/update-data-profile',alter).then((result) => {

        console.log('sucesso')
      }).catch((erro) => {
        console.log('erro', erro);
      })
      
    }

  }


  ///ABRIR MODAL RECUPERAR SENHA
  const [openRecuperarSenha, setOpenRecuperarSenha] = React.useState(false);

  const handleClickOpenRecuperar = () => {
    setOpenRecuperarSenha(true);
  };

  const handleCloseRecuperar = () => {
    enviaEmailRecuperacaoSenha(values.email);
    setOpenRecuperarSenha(false);
  };

  const carregarUser = (id) => {
    API.get(`/user/${id}`).then((result) => {
      setUser(result.data)
      setValues({
        ...values,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
      });
    }).catch((erro) => {
      console.log('erro', erro);
    })
  }
  React.useEffect(() => {

    if (!userId) {
      currentUser().then((result) => {
        //userId = result.id;
        carregarUser(result.id);

      }).catch((erro) => {
        console.log("erro", erro)
      })
      setControleUser(false)
    } else {
      carregarUser(userId);
      setControleUser(true)
    }

  }, []);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader="Meus dados pessoais"
          title="Perfil"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Seu primeiro nome"
                label="Nome"
                margin="dense"
                name="firstName"
                required
                onChange={handleChange}
                value={values.firstName}
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
                helperText="Seu segundo nome"
                label="Sobrenome"
                margin="dense"
                name="lastName"
                onChange={handleChange}
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Seu email"
                label="Endereço de e-mail"
                margin="dense"
                name="email"
                required
                onChange={handleChange}
                value={values.email}
                variant="outlined"
              />
            </Grid>


            {controleUser == true &&
            <Grid
              item
              md={12}
              xs={12}
              style={{ textAlign: 'center' }}
            >
              <Button
                variant="outlined" color="primary"
                onClick={handleClickOpenRecuperar}>
                Recuperar Senha
              </Button>
              <Dialog
                open={openRecuperarSenha}
                onClose={handleCloseRecuperar}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Recuperação de senha!</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Chegará um email de recuperação de senha no seu email.
                    Se deseja realmente recuperar sua senha,clicar na opção sim!
                 </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseRecuperar} color="primary">
                    Não
                  </Button>
                  <Button onClick={handleCloseRecuperar} color="primary" autoFocus>
                    sim
                  </Button>
                </DialogActions>
              </Dialog>

            </Grid>

}
            {/* <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Senha"
                label="Senha"
                margin="dense"
                name="password"
                type="password"
                required
                value={values.senha}
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
                helperText="Confirmar senha"
                label="Confirmação da senha"
                margin="dense"
                name="password"
                type="password"
                required
                value={values.confirmarSenha}
                variant="outlined"
              />

            </Grid> */}
          </Grid>
        </CardContent>
        <CardActions
          style={{ float: 'right' }}
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={handleClickAlterar}
          >
            Salvar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
