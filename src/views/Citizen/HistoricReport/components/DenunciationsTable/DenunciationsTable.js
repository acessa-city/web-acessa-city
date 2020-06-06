import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles, withStyles } from '@material-ui/styles';
import Report from 'components/Report';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Box,
  Paper,
  Rows,
  TableContainer
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
import ForumIcon from '@material-ui/icons/Forum';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import firebase from 'firebase/app'


import API from '../../../../../utils/API';
import { ReportCommentaries } from '../../../../../components/';
import { getInitials } from 'helpers';

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

const DenunciationsTable = props => {
  const { className, denunciations, statusProgressDenunciation, coodenadores, ...rest } = props;
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');
  console.log("Aquiiii stou euuuuuuuuuuuuuuu status" + JSON.stringify(statusProgressDenunciation));


  /// Salvar coodenadores
  const [coodenador, setCoodenador] = useState({
    id: {}
  });


  const handleCoordinatorChange = (sender) => {

    setCoodenador({
      id: sender
    })

  }

  const submit = (event) => {
    event.preventDefault();

    const coordenadores = {

      coordinatorId: coodenador.id,
      reportId: openModalDenunciations.denunciations.id

    }
    props.envioCoordenador(coordenadores);
    setOpenAprove(false);
    setOpen(false);

  }


  //Modal de Aprovação
  const [openAprove, setOpenAprove] = React.useState(false);

  const handleOpenAprove = () => {
    setOpenAprove(true);
  };

  const handleCloseAprove = () => {
    setOpenAprove(false);
  };


  //Modal de Negação
  const [openDeny, setOpenDeny] = React.useState(false);

  const handleOpenDeny = () => {
    setOpenDeny(true);
  };

  const handleCloseDeny = () => {
    setOpenDeny(false);
  };


  /// negar uma denuncia


  function getFirebase(user) {
    console.log(1)
    let uId = ''
    if (user) {
      console.log('' + JSON.stringify(user))
      user.getIdTokenResult().then((result) => {
        uId = result.claims.app_user_id
        setDeny({
          ...deny,
          userId: uId
        })
      })
    } else {

    }

  }


  const [deny, setDeny] = useState({
    message: '',
    userId: ''
  });

  const handleDenyChange = (sender) => {
    setDeny({
      ...deny,
      message: sender
    })

  }

  const submitDeny = (event) => {
    event.preventDefault();

    const denyDenunciations = {
      userId: deny.userId,
      denunciationsId: openModalDenunciations.denunciations.id,
      reportStatusId: '52ccae2e-af86-4fcc-82ea-9234088dbedf',
      description: deny.message

    }
    props.envioDeny(denyDenunciations);
    setDeny({ message: '', userId: '' });
    setOpenDeny(false);
    setOpen(false);
  }

  React.useEffect(() => {
    
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(getFirebase)
    console.log(3)
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  //////////////////////


  //Envio aprovação (em análise).
  const [progress, setProgress] = useState({
    description: '',
    data: ''
  });

  const handleProgress = (sender) => {
    setProgress({
      ...progress,
      description: sender
    })
  }

  const handleProgress2 = (sender) => {
    setProgress({
      ...progress,
      data: sender
    })
  }

  const submitProgress = (event) => {
    event.preventDefault();

    const progressAprove = {

      denunciationsId: openModalDenunciations.denunciations.id,
      description: progress.description,
      data: progress.data

    }
    props.envioProgress(progressAprove);
    setProgress({ denunciationsId: '', reportStatusId: '', description: '', data: '', });
    setOpenAprove(false);
    setOpen(false);

  }


  //Modal de envio Coordenador de fora
  const [openModalDenunciations, setOpenModalDenunciations] = useState({
    denunciations: {}

  });

  const [open, setOpen] = React.useState(false);
  const [idReportModal, setidReportModal] = useState('')

  const handleOpen = props => {

    /* FUNÇÃO QUE RETORNA UM VALOR PARA A VARIAVEL */
    setidReportModal(props)
    console.log(props);
    setOpen(true, props);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //FIM Modal de envio Coordenador






  ////Modal de Denuncias 3 pontinho
  const [openDenunciation, setOpenDenunciation] = React.useState(false);

  const handleOpenDenunciation = () => {
    setOpenDenunciation(true);
  };

  const handleCloseDenunciation = () => {
    setOpenDenunciation(false);
  };



  ////Modal Negar de Denuncias 3 pontinho
  const [openDenunciationDeny, setOpenDenunciationDeny] = React.useState(false);

  const handleOpenDenunciationDeny = () => {
    setOpenDenunciationDeny(true);
  };

  const handleCloseDenunciationDeny = () => {
    setOpenDenunciationDeny(false);
  };
  //FIM Modal de Denuncias



  //Abrir opções dos 3 pontinho
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
  };
  //FIM Abrir opções dos 3 pontinho


  const [progressStatus, setProgressStatus] = React.useState(true);

  //Filtro denúncias em progresso
  const submitEmProgresso = (event) => {
    event.preventDefault();

    const filtroAprove = {
      id: 'c37d9588-1875-44dd-8cf1-6781de7533c3',
    }
    props.filterAprove(filtroAprove);
    setProgressStatus(false)
    setMensagem('Denúncias em progresso!');
    setOpenDialog(true);

  }

  const submitEmProgresso2 = (event) => {
    event.preventDefault();

    const filtroAprove = {
      id: '96afa0df-8ad9-4a44-a726-70582b7bd010',
    }
    props.filterAprove(filtroAprove);
    setProgressStatus(true)
    setMensagem('Denúncias não aprovadas!');
    setOpenDialog(true);
  }



  //encerrar chamado
  const [finishDenunciation, setFinishDenunciation] = useState({
    description: '',
    data: ''
  });

  const handleEncerrar = (sender) => {
    setFinishDenunciation({
      ...finishDenunciation,
      description: sender
    })
  }

  const handleEncerrar2 = (sender) => {
    setFinishDenunciation({
      ...finishDenunciation,
      data: sender
    })
  }

  const submitEncerrar = (event) => {
    event.preventDefault();

    const encerrar = {
      denunciationsId: openModalDenunciations.denunciations.id,
      description: finishDenunciation.description,
      data: finishDenunciation.data
    }

    props.enviorEncerrar(encerrar);
    setFinishDenunciation({ denunciationsId: '', description: '', data: '', });
    setOpenAprove(false);
    setOpen(false);

  }


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
                  <TableCell>Denúncias</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Bairro</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Datas</TableCell>
                  <TableCell>Status</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {denunciations.map(denunciation => {
                  return (
                    <TableRow key={denunciation.id}
                      hover={true}
                    >
                      <TableCell onClick={() => handleOpen(denunciation.id)}>{denunciation.title}</TableCell>
                      <TableCell onClick={() => handleOpen(denunciation.id)}>{denunciation.street}</TableCell>
                      <TableCell onClick={() => handleOpen(denunciation.id)}>{denunciation.neighborhood}</TableCell>
                      <TableCell onClick={() => handleOpen(denunciation.id)}>{denunciation.category.name}</TableCell>
                      <TableCell onClick={() => handleOpen(denunciation.id)}>{moment(denunciation.creationDate).format('DD/MM/YYYY')}</TableCell>
                      <TableCell onClick={() => handleOpen(denunciation.id)}>{(denunciation.reportStatus.description)}</TableCell>
                    </TableRow>

                  )
                })
                }

                {open &&

                  <div>
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
                        {/* DENTRO DO MODAL */}
                        <div className={classes.paper}>                          
                          <Report reportId={idReportModal}></Report>
                          <Button onClick={handleClose}>Voltar</Button>

                        </div>
                      </Fade>
                    </Modal>

                  </div>
                  // {/* FIM Abri Modal envio coordenador  */}
                }
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>

      <Dialog open={openDialog} onClose={e => setOpenDialog(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          {mensagem}
        </DialogContent>
        <DialogActions>
          <Button onClick={e => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
};

DenunciationsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default DenunciationsTable;
