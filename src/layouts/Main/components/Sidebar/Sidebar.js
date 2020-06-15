import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import CreateIcon from '@material-ui/icons/Create';
import Forum from '@material-ui/icons/Forum';
import Face from '@material-ui/icons/Face';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GroupIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Category from '@material-ui/icons/Category';
import {logout} from 'utils/auth';
import HistoryIcon from '@material-ui/icons/History'

import { Profile, SidebarNav } from './components';
import firebase from 'firebase/app'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className,history, ...rest } = props;

  const xlogout = event => {
    event.preventDefault();
    firebase.auth().signOut().then(function() {
      logout();
      history.push('/sign-in')
    }).catch(function(error) {
      // An error happened.
    });    
  }  


  const classes = useStyles();
  const [menuPages, setMenuPages] = useState({
    items:
      [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: <DashboardIcon />
        },

      ]
  });

  // {
  //   title: 'Dashboard',
  //   href: '/dashboard',
  //   icon: <DashboardIcon />
  // },   
  // {
  //   title: 'Usuários',
  //   href: '/users',
  //   icon: <PeopleIcon />
  // },
  // /* SIDEBAR MODERADOR */
  // {
  //   title: 'Comentários',
  //   href: '/reporting-comments',
  //   icon: <Forum />
  // },    
  // {
  //   title: 'Alterar perfil',
  //   href: '/profile',
  //   icon: <Face />
  // },
  // /* SIDEBAR COORDENADOR */

  //    /* SIDEBAR MASTER */
  //    {

  //   {
  //     title: 'Alterar perfil Master',
  //     href: '/profile-master',
  //     icon: <Face />
  //   },
  // {
  //   title: 'Sair',
  //   href: '/sign-in',
  //   icon: <ExitToApp />
  // },
  // {
  //   title: 'Typography',
  //   href: '/typography',
  //   icon: <TextFieldsIcon />
  // },
  // {
  //   title: 'Icons',
  //   href: '/icons',
  //   icon: <ImageIcon />
  // },
  // {
  //   title: 'Account',
  //   href: '/account',
  //   icon: <AccountBoxIcon />
  // },
  // {
  //   title: 'Settings',
  //   href: '/settings',
  //   icon: <SettingsIcon />
  // }


  // {
  //   title: 'Cadastrar Usuário',
  //   href: '/novo-usuario',
  //   icon: <PersonAddIcon />
  // },

  const [user, setUser] = useState({
  })


  const masterMenu = (menu) => {
    menu.push(


      {
        title: 'Gerenciar Prefeituras',
        href: '/prefeituras',
        icon: <AccountBalanceIcon />
      },
      {
        title: 'Gerenciar Usuários',
        href: '/usuarios',
        icon: <GroupIcon />
      },

    )
  }

  const cityHallMenu = (menu) => {
    menu.push(

      {
        title: 'Lista Cood/Mod',
        href: '/gerenciar-usuarios',
        icon: <PersonAddIcon />
      },

    )
  }

  const coordinadorMenu = (menu) => {
    menu.push(
      {
        title: 'Denúcias',
        href: '/denuncias',
        icon: <RecordVoiceOverIcon />
      },
      {
        title: 'Gerenciar Cat/Sub',
        href: '/categorias',
        icon: <Category />
      },

    )
  }


  const moderatorMenu = (menu) => {
    menu.push(
      {
        title: 'Denúcias',
        href: '/denuncias-moderador',
        icon: <RecordVoiceOverIcon />
      },
    )
  }


  const userMenu = (menu) => {
    menu.push(
      {
        title: 'Mapa de Denúncia',
        href: '/mapa-de-denuncias',
        icon: <RoomIcon />
      },
      {
        title: 'Histórico',
        href: '/historico-de-denuncias',
        icon: <HistoryIcon />
      },

    )
  }

  function onChange(firebaseUser) {
    if (firebaseUser) {
      firebaseUser.getIdTokenResult().then((token) => {

        let novoMenu = menuPages.items;

        const claims = token.claims;

        if (claims.admin) {
          masterMenu(novoMenu);
        }

        if (claims.city_hall) {
          cityHallMenu(novoMenu);
        }

        if (claims.coordinator) {
          coordinadorMenu(novoMenu);
        }

        if (claims.moderator) {
          moderatorMenu(novoMenu);
        }

        if (claims.user && !claims.moderator && !claims.coordinator && !claims.city_hall && !claims.admin) {
          userMenu(novoMenu);
        }
        // Apenas no menu de usuário cidadão
        novoMenu.push(
          {
            title: 'Alterar perfil',
            href: '/meu-perfil',
            icon: <Face />
          },
          {
            title: 'Sair',
            href: '/sign-in',
            icon: <ExitToApp/>
          },
        )

        setMenuPages({
          items: novoMenu
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
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={menuPages.items}
        />
      </div>
    </Drawer>
  );
  return null
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
