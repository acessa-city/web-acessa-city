import React, { useState, useEffect } from 'react'
import clsx from 'clsx';
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
} from '@material-ui/core';
import firebase from 'firebase/app'

const useStyles = makeStyles(() => ({
    root: {}
}));

const ChangePassword = props => {
    const { className, ...rest } = props;

    const classes = useStyles();

    const [password, setPassword] = useState({
        password: '',
        confirmPassword: ''
    });

    const [mensagemErro, setMensagemErro] = useState('');

    const handleChange = (keyName, e) => { setPassword({ ...password, [keyName]: e.target.value }); }

    const updatePassword = () => {
        let infoError = '';

        if (password.password != password.confirmPassword) {
            infoError = 'A senha é diferente da confirmação de senha'
        }

        if (password.password.length < 6) {
            infoError = 'A senha deve conter pelo menos 6 caracteres'
        }

        if (!infoError) {
            var user = firebase.auth().currentUser;
            var newPassword = password.password;

            user.updatePassword(newPassword).then(function () {
                setPassword({
                    ...password,
                    password: '',
                    confirmPassword: ''
                })
                setErrors([
                    "Senha alterada com sucesso!"
                ])
                setErrorsStatus2(true)
                setTimeout(() => {
                    setErrors([]);
                }, 1000);
            }).catch(function (error) {
                console.log('Erro na troca de senha::::', error.message)

                if (error.message == 'This operation is sensitive and requires recent authentication. Log in again before retrying this request.') {

                    setErrors([
                        "Sua sessão expirou, para alterar sua senha e necessário deslogar e logar novamente!"
                    ])
                    setErrorsStatus(true)
                    setTimeout(() => {
                        setErrors([]);
                    }, 5000);
                
                 }
            });
        }
        else {
            alert(infoError);
            setMensagemErro(infoError)
        }
    }

    /////Errros///////
const handleSnackClick = () => {
    setErrors([]);
  }
  const [errors, setErrors] = useState([]);
  const [errorsStatus, setErrorsStatus] = useState('');
  const [errorsStatus2, setErrorsStatus2] = useState('');
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
                background: 'orange',
                textAlign: 'center'
              }}
              message={<h3>{error}</h3>} />
          ))}
        </div>)
    } else if(errorsStatus2 == true){
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
    }else {
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
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <form
                autoComplete="off"
                noValidate
            >
                <CardHeader
                    subheader="Minha Senha"
                    title="Alterar Senha"
                />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                error={password.password != password.confirmPassword}
                                helperText="Senha"
                                label="Senha"
                                margin="dense"
                                name="password"
                                type="password"
                                required
                                onChange={handleChange}
                                onChange={sender => handleChange('password', sender)}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
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
                        </Grid>


                    </Grid>
                </CardContent>
                <CardActions
                    style={{ float: 'right' }}
                >
                    <Button
                        disabled={!password.password}
                        fullWidth
                        variant="contained" color="secondary"
                        onClick={updatePassword}
                    >
                        Salvar
                </Button>

                </CardActions>
            </form>


            <Snackbar open={errors.length} onClick={handleSnackClick}>
                {erros()}
            </Snackbar>
            <Backdrop
                style={{ zIndex: 99999999 }}
                className={classes.backdrop} open={openValidador} onClick={handleCloseValidador}>
                <CircularProgress color="inherit" />
            </Backdrop>

        </Card>
    );
}


export default ChangePassword;
