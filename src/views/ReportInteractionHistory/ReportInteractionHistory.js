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
    TablePagination
  } from '@material-ui/core';

import InteractionCard from './InteractionCard';

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
  }
}));


const ReportInteractionHistory = props => {
    const { reportId, currentUserId } = props;
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    useEffect(() => {
        api.get('/report-interaction-history/report/' + reportId)
            .then((result) => {
                setInteractions(result.data)
                setActiveStep(result.data.length - 1)
                console.log(result.data)
            })        
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

  return (
    <div className={classes.root}>
      <Stepper  nonlinear activeStep={activeStep} orientation="vertical">          
        {interactions.map(interaction => (
          <Step key={interaction.id}>
            <StepLabel>{interaction.newReportStatus.description}</StepLabel>
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
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === interactions.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Voltar
          </Button>
        </Paper>
      )}
    </div>
  );
}

export default ReportInteractionHistory;