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
    TextField
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
                alert('Senha Alterada com sucesso');
            }).catch(function (error) {
                console.log('Erro na troca de senha::::', error.message)

                if( error.message == 'This operation is sensitive and requires recent authentication. Log in again before retrying this request.' )
                {
                  window.alert('Você está inativo por muito tempo, sai e entre novamente para alterar senha!!');
                }
            });
        }
        else {
            alert(infoError);
            setMensagemErro(infoError)
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
        </Card>
    );
}


export default ChangePassword;
