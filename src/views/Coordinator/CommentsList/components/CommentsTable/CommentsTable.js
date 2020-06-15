import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, withStyles } from '@material-ui/styles';
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
  Typography,
  CardHeader,
  TablePagination,
  Box
} from '@material-ui/core';

//Modal
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
//Fim Modal

//Icone 3 bolinhas
import MoreIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
//FIM Icone 3 bolinhas

import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';


import { Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
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
  Card: {
    marginTop: 50
  }

}));

//Abrir opções dos 3 pontinho
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);
//FIM Abrir opções dos 3 pontinho

const CommentsTable = props => {
  const { className, comments, ...rest } = props;
  const classes = useStyles();


  /// Salvar comentários
  const [commetsSave, setCommetsSave] = useState({
      message: ''
  });


  const handleDenyChange = (sender) => {
    setCommetsSave({
      ...commetsSave,
      message: sender
    })

  }

  const submitComents = (event) => {
    event.preventDefault();

    const comentarios = {
      commentary: commetsSave.message
    }
    props.envioComentarios(comentarios);

    setCommetsSave({message:''});

  }
  //////////////////////


  //Modal de envio Coordenador de fora
  const [openModalComments, setOpenModalComments] = useState({
    comments: {}

  });

  const [open, setOpen] = React.useState(false);

  const handleOpen = (commentsp) => {
    console.log("denunciasss" + JSON.stringify(commentsp))
    setOpenModalComments({
      ...comments,
      comments: commentsp
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //FIM Modal de envio Coordenador






  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuários</TableCell>
                  <TableCell>Comentários</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {comments.map(commentary => {
                  return (
                    <TableRow key={commentary.id}
                    hover={true}
                    style={{cursor: 'pointer'}}
                    >
                      <TableCell onClick={() => handleOpen(commentary)}>{commentary.id}</TableCell>
                      <TableCell>{commentary.name}</TableCell>
                    </TableRow>

                  )
                })
                }

                {open &&

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
                    {/* Modal da Dereita */}
                    <Fade in={open}>
                      <div className={classes.paper}>
                        <Card className={classes.root}
                          style={{
                            textAlign: 'center',
                            maxWidth: 500,
                            maxHeight: 500,
                          }}>

                          <CardContent>
                            <div>
                              <div>
                                <div>
                                  <CardHeader title={openModalComments.comments.name} />
                                </div>
                              </div>
                            </div>
                            <div>
                            </div>
                          </CardContent>

                        </Card>
                        <Card className={classes.root}
                          style={{
                            maxWidth: 700
                          }}
                        >
                          <CardContent>
                            <div>
                              <CardHeader title="Descrição:" />
                              {/* <div>
                                <Typography align="justify">{openModalComments.comments.description}</Typography>
                              </div> */}
                            </div>
                          </CardContent>
                        </Card>


             
                        <TextareaAutosize
                          onChange={e => handleDenyChange(e.target.value)}
                          rowsMax={4}
                          aria-label="maximum height"
                          placeholder="Cometários"
                          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                          ut labore et dolore magna aliqua."
                          value={commetsSave.message}
                        />

                        <Grid item xs={12} sm={4}>
                          <FormControl margin="dense" fullWidth>
                            <Button onClick={submitComents} variant="contained" color="secondary">Enviar</Button>
                          </FormControl>
                        </Grid>


                      </div>
                    </Fade>
                  </Modal>
                  // {/* FIM Abri Modal envio coordenador  */}
                }

              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  );
};

CommentsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default CommentsTable;
