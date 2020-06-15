import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {
  DashboardUser,
  DashboardAdmin
} from './components';

import currentUser from 'utils/AppUser';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    currentUser().then(usuario => {
      setUser(usuario);
      console.log(usuario)     
    })    
  }, []);

  const DashboardContent = () => {
    if (user.cityHall)
      return <DashboardAdmin></DashboardAdmin>
    else
  return <DashboardUser></DashboardUser>  
  }

  return (
    DashboardContent()
  )
};

export default Dashboard;
