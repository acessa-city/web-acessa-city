import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { useState } from 'react';
import firebase from 'firebase/app'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [user, setUser] = useState({
    name: '',
    avatar: '',
    bio: '',
    admin: false
  })

  function onChange(firebaseUser) {
    if (firebaseUser) {
      firebaseUser.getIdTokenResult().then((token) => {
        const claims = token.claims;
        setUser({
          ...user,
          name: claims.name,
          avatar: claims.picture,
          bio: claims.email,
          admin: claims.admin,
          coordinador:claims.coordinator,
          city_hall:claims.city_hall,
          modertor:claims.moderator
        })
      })
    } else {
      // No user is signed in.
    }
  }

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
    return () => unsubscribe()
  }, [])

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt={user.name}
        className={classes.avatar}
        component={RouterLink}
        src={user.avatar}
        to="/meu-perfil"
      />
      <Typography
        className={classes.name}
        variant="h4"
        style={{textAlign:'center'}}
      >
        {user.name}
      </Typography>
      <Typography variant="body2">
        {user.bio}
      </Typography>
      <Typography variant="body2">
        {
          user.admin &&
          <Typography variant="body2">
            ADMINISTRADOR
        </Typography>
        }
        {
          user.coordinator &&
          <Typography variant="body2">
            COORDENADOR
        </Typography>
        }
        {
          user.moderator &&
          <Typography variant="body2">
            MODERADOR
        </Typography>
        }
           {
          user.city_hall &&
          <Typography variant="body2">
            PREFEITURA
        </Typography>
        }
      </Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
