import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  UsersByDevice,
  LatestOrders
} from '../';
import api from 'utils/API';
import currentUser from 'utils/AppUser';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

const DashboardAdmin = () => {
  const classes = useStyles();

  const [info, setInfo] = React.useState({});
  const [reportsTotal, setReportsTotal] = React.useState(0);
  const [user, setUser] = React.useState({});

  const updateInfo = (cityId) => {
    console.log('cidade:::', cityId)
    api.get(`/report/city/${cityId}/dashboard-info`)
      .then(result => {
        setInfo(result.data)
        const dados = result.data;
        let total = dados.inProgress + dados.denied + dados.finished + dados.inAnalysis + dados.approved;

        setReportsTotal(total);
      })
  }

  const getProgress = (currentStatus) => {
    if (reportsTotal == 0)
    {
      return 0;
    }

    return (currentStatus / reportsTotal) * 100;
  }

  React.useEffect(() => {
    currentUser().then(usuario => {
      setUser(usuario);
      console.log(usuario)
      updateInfo(usuario.cityHall.city.id);            
    })    
  }, []);

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
        <TasksProgress progress={getProgress(info.inAnalysis)} label={'Em análise'} value={info.inAnalysis} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TasksProgress progress={getProgress(info.approved)} label={'Aprovadas'} value={info.approved} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TasksProgress progress={getProgress(info.inProgress)} label={'Em progresso'} value={info.inProgress} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TasksProgress progress={getProgress(info.denied)} label={'Negadas'} value={info.denied} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TasksProgress progress={getProgress(info.finished)} label={'Finalizadas'} value={info.finished} />
        </Grid>                
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Budget label={`Total de denúncias para ${user?.cityHall?.city?.name}`} value={reportsTotal} />          
        </Grid>
  
        {/* <Grid
          item
          lg={12}
          md={12}
          xl={12}
          xs={12}
        >
          <LatestOrders />
        </Grid> */}
      </Grid>
    </div>
  );
};

export default DashboardAdmin;
