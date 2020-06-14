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
  FormControl,
  InputLabel
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


  console.log("AQUIII ola ola ", prefecturesId);

  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    cityId: '7ae590f1-c6a4-4bb3-91bf-1e82ea45bb4b',
    cnpj: '',
    address: '',
    neighborhood: '',
    zipCode: '',
    number: '',
    email: ''
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

  console.log("Aquii os values")

  const limparForm = () => {
    setValues({
      name: '',
      cnpj: '',
      email: '',
      address: '',
      neighborhood: '',
      zipCode: '',
      number: '',
      cityId: '',
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
      stateId: stateId
    })
    api.get('/state/' + stateId + '/cities').then((result) => {
      setCities({
        cities: result.data
      });
      if (result.data.length) {
        setValues({
          ...values,
          stateId: stateId,
          cityId: result.data[0].id
        })
      }
    })
    console.log(values);
  }

  const [controlePrefecture, setControlePrefecture] = useState('');

  const carregarPrefecture = (id) => {
    api.get(`/city-hall/${id}`).then((result) => {

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
          stateId: result.data[0].id
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

  const [vazio, setVazios] = useState('');

  const campoVazio = values => {
    values.name === '' ||
      values.cnpj === '' ||
      values.email === '' ||
      values.address === '' ||
      values.neighborhood === '' ||
      values.zipCode === '' ||
      values.number === '' ||
      values.cityId === ''
      ?
      setVazios(false) :
      setVazios(true)
  }
  const handleClick = () => {
    setOpen(true)
    setOpenValidador(true)
    if (values.name === '' || values.cnpj === '' || values.email === '' || values.address === '' || values.neighborhood === '' || values.zipCode === '' || values.number === '' || values.cityId === '') {
      setOpenValidador(false)
      setErrorsStatus(false)
      setErrors([
        "Há campos vazios"
      ])
      setTimeout(() => {
        setErrors([]);
      }, 2000);

    } else {
      var newCityHall = values;
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
          limparForm()
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

  const handleClickAlterar = () => {
    console.log(values);
    setOpenValidador(true)
    api.put(`/city-hall/${prefecturesId}`, values)
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
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
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
              </Grid>
              <Grid
                item
                md={2}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText="Informe o CNPJ da prefeitura"
                  label="CNPJ"
                  margin="dense"
                  name="cnpj"
                  onChange={handleChange}
                  required
                  value={values.cnpj}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={2}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText="Informe o CEP da prefeitura"
                  label="CEP"
                  margin="dense"
                  name="zipCode"
                  onChange={handleChange}
                  required
                  value={values.zipCode}
                  variant="outlined"
                />
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
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
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
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
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
                >{states.states.map(option => (
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
                  name="state"
                  select
                  onChange={handleChange}
                  required
                  value={values.cityId}
                  variant="outlined"
                >{cities.cities.map(option => (
                  <option
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                  </option>
                ))}
                
                </TextField>
              </Grid>

              <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="age-native-simple">Categoria</InputLabel>
              <Select
                native
                value={values.cityId}
                inputProps={{
                  name: 'state',
                }}
              >
                <option aria-label="None" value="" />
                {cities.cities.map(cidade => {
                  return (
                    <option value={values.cityId}>{cidade.name}</option>
                  )
                })
                }
              </Select>
            </FormControl>
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
    </div>
  );
};

CityHallCreate.propTypes = {
  className: PropTypes.string
};

export default CityHallCreate;
