import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import MaskedInput from 'react-text-mask';
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
  FormControl,
  InputLabel,
  InputMask,
  Input
} from '@material-ui/core';
import api from 'utils/API';
import currentUser from 'utils/AppUser';
import { useForm, ErrorMessage } from 'react-hook-form'
const useStyles = makeStyles((theme) => ({
  root: {},
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


const CityHallCreate = props => {
  const { className, onCreatePrefecture, prefecturesId, mudarCor, mudarCor2, ...rest } = props;



  const classes = useStyles();

  const [values2, setValues2] = useState({
    city: '',
  });

  const handleChange2 = event => {
    setValues2({
      ...values2,
      [event.target.name]: event.target.value
    });
  };

  const limparForm2 = () => {
    setValues2({
      city: '',
    })
  }


  const limparForm3 = () => {
    setValues({
      state: '',
      state: ''
    })
  }

  const [values, setValues] = useState({
    name: '',
    cityId: '',
    cnpj: '',
    address: '',
    neighborhood: '',
    zipCode: '',
    number: '',
    email: '',
    state: ''
  });

  const { register, watch } = useForm(
    { validateCriteriaMode: "all" }
  )

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };


  const limparForm = () => {
    setValues({
      name: '',
      cnpj: '',
      email: '',
      address: '',
      neighborhood: '',
      zipCode: '',
      number: '',
      state: ''
    })
  }


  const [states, setStates] = useState({
    states: []
  })

  const [cities, setCities] = useState({
    cities: [],
  })

  //TRAZER OS ESTADOS
  const changeState = (stateId) => {
    setValues({
      ...values,
      state: stateId
    })
    atualizacidades(stateId)
    console.log(values);
  }



  const atualizacidades = (stateId) => {
    api.get('/state/' + stateId + '/cities').then((result) => {
      setCities({
        cities: result.data
      });
    })
  }



  const [controlePrefecture, setControlePrefecture] = useState('');

  const carregarPrefecture = (id) => {
    api.get(`/city-hall/${id}`).then((result) => {

      console.log("result", result);
      setValues({
        ...values,
        name: result.data.name,
        cnpj: result.data.cnpj,
        email: result.data.email,
        address: result.data.address,
        neighborhood: result.data.neighborhood,
        zipCode: result.data.zipCode,
        number: result.data.number,
        state: result.data.city.cityState.id,
      });

      atualizacidades(result.data.city.cityState.id);

      setValues2({
        city: result.data.cityId
      });

    }).catch((erro) => {
      console.log('erro', erro);
    })
  }

  React.useEffect(() => {
    api.get('/state').then((result) => {
      console.log(result);
      setStates({
        states: result.data
      });
      if (result.data.length) {
        setValues({
          ...values,
          state: result.data.id
        })
      }
    })

    if (!prefecturesId) {
      currentUser().then((result) => {
        carregarPrefecture(result.id);
      }).catch((erro) => {
        console.log("erro", erro)
      })
      setControlePrefecture(false);
    } else {
      carregarPrefecture(prefecturesId);
      setControlePrefecture(true);
    }


  }, [])


  const handleStateChange = (event) => {
    const stateId = event.target.value;
    changeState(stateId);
  }


  const handleClick = () => {
    setOpen(true)
    setOpenValidador(true)
    if (values2.city === '' || values.state === '' || values.name === '' || values.cnpj === '' || values.email === '' || values.address === '' || values.neighborhood === '' || values.zipCode === '' || values.number === '') {
      setOpenValidador(false)
      setErrorsStatus(false)
      setErrors([
        "Há campos vazios"
      ])
      setTimeout(() => {
        setErrors([]);
      }, 2000);
    } else {

      const newCityHall = {
        name: values.name,
        cnpj: values.cnpj.replace(/\.|\/|\-/g, ""),
        email: values.email,
        address: values.address,
        neighborhood: values.neighborhood,
        zipCode: values.zipCode.replace(/\-/g, ""),
        number: values.number,
        state: values.state,
        cityId: values2.city
      }

      if (newCityHall.cnpj.replace(/\s/g, '').length !== 14) {
        setOpenValidador(false)
        setErrorsStatus(false)
        setErrors([
          "O CNPJ precisa ter 14 dígitos, verifique o campo CNPJ."
        ])
        setTimeout(() => {
          setErrors([]);
        }, 2000);
      } else if (newCityHall.zipCode.replace(/\s/g, '').length !== 8) {

        setOpenValidador(false)
        setErrorsStatus(false)
        setErrors([
          "O CEP precisa ter 8 dígitos, verifique o campo CEP."
        ])
        setTimeout(() => {
          setErrors([]);
        }, 2000);

      } else {

        api.post('/city-hall', newCityHall)
          .then((result) => {
            setOpenValidador(false)
            setOpen(false)
            setErrorsStatus(true)
            setErrors([
              "A prefeitura " + values.name + " foi criada com sucesso."
            ])

            if (onCreatePrefecture) {
              onCreatePrefecture(result.data)
            }
            setTimeout(() => {
              setErrors([]);
            }, 2000);
            limparForm();
            limparForm2();
            limparForm3();
          })
          .catch((aError) => {

            if (aError.response.status == 400) {
              setOpen(false)
              console.log(aError.response.data.errors)
              setErrors(aError.response.data.errors)
            }
            else if (aError.response.status == 500) {
              setErrors([
                "Erro no servidor"
              ])
            }
            setTimeout(() => {
              setErrors([]);
            }, 2000);
            setErrorsStatus(false)
            setOpenValidador(false)
            setOpen(false)
          })


      }

    }

  }


  const handleClickAlterar = () => {
    setOpenValidador(true)
    if (values2.city === '' || values.state === '' || values.name === '' || values.cnpj === '' || values.email === '' || values.address === '' || values.neighborhood === '' || values.zipCode === '' || values.number === '') {
      setOpenValidador(false)
      setErrorsStatus(false)
      setErrors([
        "Há campos vazios"
      ])
      setTimeout(() => {
        setErrors([]);
      }, 2000);
    } else {

      const newCityHall = {
        name: values.name,
        cnpj: values.cnpj.replace(/\.|\/|\-/g, ""),
        email: values.email,
        address: values.address,
        neighborhood: values.neighborhood,
        zipCode: values.zipCode.replace(/\-/g, ""),
        number: values.number,
        state: values.state,
        cityId: values2.city
      }

      if (newCityHall.cnpj.replace(/\s/g, '').length !== 14) {
        setOpenValidador(false)
        setErrorsStatus(false)
        setErrors([
          "O CNPJ precisa ter 14 dígitos, verifique o campo CNPJ."
        ])
        setTimeout(() => {
          setErrors([]);
        }, 2000);
      } else if (newCityHall.zipCode.replace(/\s/g, '').length !== 8) {

        setOpenValidador(false)
        setErrorsStatus(false)
        setErrors([
          "O CEP precisa ter 8 dígitos, verifique o campo CEP."
        ])
        setTimeout(() => {
          setErrors([]);
        }, 2000);

      } else {

        api.put(`/city-hall/${prefecturesId}`, newCityHall)
          .then((result) => {
            setOpen(false)
            const closeModal = {
              name: values.name
            }
            props.modalClose(closeModal);
          })
          .catch((aError) => {

            setErrors([
              "Erro ao tentar atualizar a prefeitura."
            ]);
            setErrorsStatus(false)
            setTimeout(() => {
              setErrors([]);
            }, 2000);
            setOpenValidador(false)

          })

      }

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



 /* function TextMaskCustom(props) {
    const { inputRef, ...outros } = props;

    return (
      <MaskedInput
        {...outros}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        // style={{padding: '10px', border: 'transparent', width: '100%'}}
        mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }*/



 /* function TextMaskCustom2(props) {
    const { inputRef, ...outros } = props;

    return (
      <MaskedInput
        {...outros}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        // style={{padding: '10px', border: 'transparent', width: '100%'}}
        mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
        placeholderChar={'\u2000'}
        showMask
      />
    );
  }*/


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
        <form
          autoComplete="off"
          noValidate
        >
          {mudarCor &&
            <CardHeader
              subheader="Cadastrar prefeitura"
              title="Prefeitura"
            />
          }
          {mudarCor2 &&
            <CardHeader
              subheader="Alterar prefeitura"
              title="Prefeitura"
            />
          }
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
                <form
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    fullWidth
                    helperText="Informe o nome da prefeitura"
                    label="Nome da prefeitura"
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
                md={2}
                xs={12}
              >
                {/* <TextField
                  fullWidth
                  helperText="Informe o CNPJ da prefeitura"
                  label="CNPJ"
                  margin="dense"
                  name="cnpj"
                  //onChange={handleChange}
                  required
                  // value={values.cnpj}
                  variant="outlined"
                  inputComponent={TextMaskCustom}
                /> */}

                <TextField
                  fullWidth
                  helperText="Informe o CNPJ da prefeitura"
                  label="CNPJ"
                  margin="dense"
                  name="cnpj"
                  required
                  value={values.cnpj}
                  variant="outlined"
                  InputProps={{
                    inputComponent: cnpjMask,
                    value: values.cnpj,
                    onChange: handleChange,
                }}
                />

              </Grid>
              <Grid
                item
                md={2}
                xs={12}
              >
                <form
                  noValidate
                  autoComplete="off"
                >
                <TextField
                  fullWidth
                  helperText="Informe o CEP da prefeitura"
                  label="CEP"
                  margin="dense"
                  name="zipCode"
                  required
                  value={values.zipCode}
                  variant="outlined"
                  InputProps={{
                    inputComponent: zipCodeMask,
                    value: values.zipCode,
                    onChange: handleChange,
                }}
                />
                </form>
            </Grid>
            <Grid
              item
              md={2}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Informe o número da prefeitura"
                label="Número"
                margin="dense"
                name="number"
                onChange={handleChange}
                required
                value={values.number}
                variant="outlined"
              />
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
                  helperText="Informe o endereço de e-mail"
                  label="Endereço de e-mail"
                  margin="dense"
                  name="email"
                  required
                  onChange={handleChange}
                  required
                  value={values.email}
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
                  helperText="Informe o endereço da prefeitura"
                  label="Endereço"
                  margin="dense"
                  name="address"
                  required
                  onChange={handleChange}
                  type="text"
                  value={values.address}
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
                  helperText="Informe o bairro da prefeitura"
                  label="Bairro"
                  margin="dense"
                  name="neighborhood"
                  onChange={handleChange}
                  required
                  type="text"
                  value={values.neighborhood}
                  variant="outlined"
                />
              </form>
            </Grid>

            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Informe o estado"
                label="Estado"
                margin="dense"
                name="state"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                onChange={handleStateChange}
                value={values.state}
                variant="outlined"
              >
                <option aria-label="None" value="" />
                {states.states.map(option => (
                  <option
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Informe a cidade"
                label="Cidades"
                margin="dense"
                select
                SelectProps={{ native: true }}
                onChange={handleChange2}
                required
                name="city"
                value={values2.city}
                variant="outlined"
              >
                <option aria-label="None" value="" />
                {cities.cities.map(option => (
                  <option
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            </Grid>
          </CardContent>
        <Divider />
        <CardActions>
          {mudarCor &&
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
          }

          {mudarCor2 &&
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              <Button
                color="secondary"
                variant="contained"
                onClick={handleClickAlterar}
                style={{ float: 'right' }}
              >
                Salvar
              </Button>
            </Grid>
          }
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

const cnpjMask = props => {
  const { inputRef, ...other } = props;

  return (
  <MaskedInput
      { ...other }
      mask={[/\d/, /\d/,'.', /\d/,/\d/,/\d/,'.', /\d/, /\d/,/\d/,'/',/\d/, /\d/, /\d/,/\d/,'-',/\d/,/\d/]}
      placeholderChar={'\u2000'}
      showMask
  />
  );
}

const zipCodeMask = props => {
  const { inputRef, ...other } = props;

  return(
    <MaskedInput 
      { ...other }
      mask={[/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/]}
    />
  );
}

CityHallCreate.propTypes = {
  className: PropTypes.string,
};

/*TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};*/

export default CityHallCreate;
