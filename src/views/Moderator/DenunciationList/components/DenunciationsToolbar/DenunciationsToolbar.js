import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
// import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

// import { SearchInput } from 'components';  //chamar botão de pesquisa


const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },

}));


const DenunciationsToolbar = props => {
  const { className, denunciationsSlect, ...rest } = props;

  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [reportStatusValue, setReportStatusValue] = useState('');
  const [denunciationCategory, setDenunciationCategory] = useState('');
  const [denunciationStreet, setDenunciationStreet] = useState('');
  const [denunciationNeighborhood, setDenunciationNeighborhood] = useState('');
  const [denunciationData, setDenunciationData] = useState('');

  const classes = useStyles();


  const handleData = (sender) => {
    setDenunciationData({
      ...denunciationData,
      data: sender
    })
  }
  
  const submit = (event) => {
    event.preventDefault();

    const filtro = {
      category: denunciationCategory,
      street: denunciationStreet,
      neighborhood: denunciationNeighborhood,
      creationDate: setDenunciationData,
      status: reportStatusValue
    }
    props.filter(filtro);
    setDenunciationStreet('');
    setDenunciationNeighborhood('');
    setDenunciationCategory('');
    setDenunciationData('');
  }


  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.root}>



        <Grid container spacing={1}>

          <Grid item xs={12} sm={2}>

            <FormControl className={classes.formControl} fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select native label="Categoria" value={denunciationCategory} onChange={e => setDenunciationCategory(e.target.value)}>
                <option aria-label="None" value="" />

                {denunciationsSlect.map(denunciationCategory => {
                  return (
                    <option value={denunciationCategory.category.id}>{denunciationCategory.category.name}</option>
                  )
                })
                }
              </Select>
            </FormControl>

          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="age-native-simple">Status</InputLabel>
              <Select
                native
                value={reportStatusValue}
                onChange={e => setReportStatusValue(e.target.value)}
              >
                <option aria-label="None" value="" />

                <option value={'48cf5f0f-40c9-4a79-9627-6fd22018f72c'}>Em análise</option>
                <option value={'52ccae2e-af86-4fcc-82ea-9234088dbedf'}>Negadas</option>

              </Select>
            </FormControl>

          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel>Rua</InputLabel>
              <Select native label="Endereço" value={denunciationStreet} onChange={e => setDenunciationStreet(e.target.value)}>
                <option aria-label="None" value="" />
                {denunciationsSlect.map(denunciationStreet => {
                  return (
                    <option value={denunciationStreet.street}>{denunciationStreet.street}</option>
                  )
                })
                }
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel>Bairro</InputLabel>
              <Select native label="Bairro" value={denunciationNeighborhood} onChange={e => setDenunciationNeighborhood(e.target.value)}>
                <option aria-label="None" value="" />
                {denunciationsSlect.map(denunciationNeighborhood => {
                  return (
                    <option value={denunciationNeighborhood.neighborhood}>{denunciationNeighborhood.neighborhood}</option>
                  )
                })
                }
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              onChange={e => handleData(e.target.value)}
              id="date"
              label="Data"
              type="date"
              className={classes.textField}
              value={denunciationData.data}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl margin="dense" fullWidth>
              <Button onClick={submit} variant="contained" color="secondary">Filtrar</Button>
            </FormControl>
          </Grid>

          {/* <Grid item xs={12} sm={2}>
            <div
              style={{
                textAlign: 'right',
                marginTop: 10
              }}
            >
              <NotificationsActiveIcon />
            </div>
          </Grid> */}

        </Grid>
      </div>
    </div>
  );
};

DenunciationsToolbar.propTypes = {
  className: PropTypes.string
};

export default DenunciationsToolbar;


