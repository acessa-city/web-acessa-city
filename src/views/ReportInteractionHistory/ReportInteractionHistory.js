import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import api from 'utils/API';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Divider,
  Grid,
  TextField,
  Backdrop,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  InputLabel,
  FormControl
} from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import IconButton from '@material-ui/core/IconButton';
import InteractionCard from './InteractionCard';
import ReportStatus from 'utils/ReportStatus'
import currentUser from 'utils/AppUser'

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  //modal
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    overflow: 'scroll'

  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    marginRight: 10,
    marginTop: 10,
  },
  //FIM modal
}));


const ReportInteractionHistory = props => {
  const { reportId, currentUserId } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [roles, setRoles] = useState({});

  const loadInteractions = () => {
    api.get('/report-interaction-history/report/' + reportId)
      .then((result) => {
        setInteractions(result.data)
        setActiveStep(result.data.length - 1)
        console.log(result.data)
      })
  }

  useEffect(() => {


    currentUser().then(user => {
      setRoles({
        ...roles,
        loaded: true,
        admin: user.roles.includes('admin'),
        coordinator: user.roles.includes('coordinator'),
        moderator: user.roles.includes('moderator'),
        city_hall: user.roles.includes('city_hall'),
        user: user.roles.includes('user')
      })
    })
    loadInteractions()
  }, []);

  const [interactions, setInteractions] = useState([]);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [values, setValues] = useState({
    description: '',
  });


  ///modal reabertura
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleReabertura = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const limparForm = () => {
    setValues({
      description: '',
    })
  }

  const reopenReport = () => {

    const request = {
      userId: currentUserId,
      reportStatusId: ReportStatus.Aprovado(),
      description: values.description
    }

    if (values.description == '') {
      setErrors([
        "Decreva o motivo da reabertura."
      ])
      setErrorsStatus(false)
      setTimeout(() => {
        setErrors([]);
      }, 1000);
    } else {
      api.post(`/report/${reportId}/status-update`, request)
        .then((result) => {

          setErrors([
            "Denúncia Reaberta com sucesso."
          ])
          setErrorsStatus(true)
          setTimeout(() => {
            setErrors([]);
          }, 2000);
          loadInteractions();
          limparForm();
          setOpen(false);
          props.atualizarTela();
        })
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
    <div className={classes.root}>
      <Stepper nonlinear activeStep={activeStep} orientation="vertical">
        {interactions.map(interaction => (
          <Step key={interaction.id}>
            <StepLabel>{interaction.newReportStatus.description}
            </StepLabel>
            <StepContent>
              <InteractionCard currentUserId={currentUserId} interaction={interaction}></InteractionCard>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Voltar
                    {/* {reportId} */}
                  </Button>
                  <Button
                    variant="contained"
                    disabled={activeStep === interactions.length - 1}
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    Próximo
                  </Button>
                  {
                    (ReportStatus.Finalizada() == interaction.newReportStatusId
                      || ReportStatus.Negado() == interaction.newReportStatusId)
                    &&
                    roles.moderator
                    &&
                    (activeStep === interactions.length - 1)
                    &&

                    <Button
                      variant="contained"
                      color="primary"
                      style={{ background: '#1b5e20' }}
                      onClick={handleOpen}
                      className={classes.button}
                    >
                      Reabrir
                    </Button>
                  }
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {/* Modal reabrir */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>

            <Grid container spacing={1}>

              <Grid item xs={12} sm={12}>
                <InputLabel>Descreva o motivo da Reabertura:</InputLabel>
              </Grid>

              <Grid
                item
                lg={12}
                md={12}
                xl={12}
                xs={12}
              >
                <TextareaAutosize style={{ width: '100%', fontSize: '15px', borderRadius: '4px', padding: '5px 13px 10px 13px' }}
                  rowsMin={3}
                  aria-label="empty textarea"
                  name="description"
                  onChange={handleReabertura}
                  value={values.description}
                  placeholder="Descreva o motivo da reabertura.*"
                />

              </Grid>

              <FormControl margin="dense" fullWidth>
                <Grid item md={12} xs={12}>
                  <Button style={{ float: 'right', background: '#1b5e20' }} onClick={reopenReport} variant="contained" color="secondary">Enviar</Button>
                </Grid>
              </FormControl>
            </Grid>
          </div>
        </Fade>
      </Modal>


      <Snackbar style={{zIndex: 99999999999999999}} open={errors.length} onClick={handleSnackClick}>
        {erros()}
      </Snackbar>
    </div>
  );
}

export default ReportInteractionHistory;