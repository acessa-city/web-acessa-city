import React from 'react'
import { Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import api from 'utils/API';
import Divider from '@material-ui/core/Divider';
import currentUser from 'utils/AppUser';

const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));


const Notifications = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [notifications, setNotifications] = React.useState([]);
    const [userId, setUserId] = React.useState('');

    const markAsRead = notificationId => {
      api.put('/notifications/'+notificationId+'/mark-as-read')
        .then(result => {
          updateNotifications(userId)
        })
    }

    const updateNotifications = userId => {
      api.get('user/'+userId+'/notifications')
      .then(result => {
        const messages = result.data;
        setNotifications(messages)
      })
    }

    React.useEffect(() => {
      currentUser().then(user => {
        setUserId(user.id);
        updateNotifications(user.id)
        const interval = setInterval(() => {
          updateNotifications(user.id)
        }, 10000);
        return () => interval;        
      })      
    }, [])

    const notificationText = notification => {
      return (
        <div>
          <p><strong>{notification.report.title}</strong></p>
          <p><strong>Novo status:</strong> {notification.report.reportStatus.description}</p>
          <button onClick={() => markAsRead(notification.id)}>Marcar como lida</button>
        </div>
      );
    }

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <div>            
            <Badge
                aria-describedby={id}
                badgeContent={notifications.length}
                color="secondary"
                variant=""
                onClick={handleClick}
                showZero={true}
            >
                <NotificationsIcon />
            </Badge>
            <Popover
                id={id}
                open={open && notifications.length > 0}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
                }}
            >
                {notifications.map(notification => (
                  <div>
                    <Typography className={classes.typography}>
                      {notificationText(notification)}
                      <p></p>
                    </Typography>
                    <Divider />
                  </div>
                ))}                
            </Popover>                        
        </div>
    );
}

export default Notifications;