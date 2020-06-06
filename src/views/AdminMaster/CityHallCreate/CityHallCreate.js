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
  SnackbarContent
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
  const { className,onCreatePrefecture,prefecturesId, ...rest } = props;


  console.log("AQUIII ola ola " , prefecturesId);

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

  const [errors, setErrors] = useState([]);

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
      cityId: '',
      state: ''
    })
  }

  const handleSnackClick = () => {
    setErrors([]);
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

  const[controlePrefecture, setControlePrefecture] = useState('');

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

  const campoVazio = values =>{
    values.name === '' ||
    values.cnpj=== ''||
    values.email=== ''||
    values.address=== ''||
    values.neighborhood=== ''||
    values.zipCode=== ''||
    values.number=== ''||
    values.cityId=== ''
    ?  
    setErrors([
      "Existem campos vazios."
    ]) : 
    setErrors([
      "A prefeitura " + values.name + ", e o usuário " +
      values.email + " foram criados com sucesso."
    ])
  }
  const handleClick = () => {
    setOpen(true)
    console.log(values);
    campoVazio(values) 
    var newCityHall = values;
    api.post('/city-hall', newCityHall)
      .then((result) => {
        setOpen(false)
        setErrors([
          "A prefeitura " + values.name + ", e o usuário " +
          values.email + " foram criados com sucesso."
        ])

        if (onCreatePrefecture) {
          onCreatePrefecture(result.data)
        }
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

        setOpen(false)
      })
  }

  const teste = () => {
    return (<div>
      {errors.map(error => (
        <div>
        <SnackbarContent message={<h3>{error}</h3>} />
        </div>
      ))}
    </div>)
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
          <CardHeader
            subheader="Cadastrar prefeitura"
            title="Cadastrar prefeitura"
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
                  label="Cidade"
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
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={handleClick}
            >
              Cadastrar
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
    </div>
  );
};

CityHallCreate.propTypes = {
  className: PropTypes.string
};

export default CityHallCreate;
