import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ForumIcon from '@material-ui/icons/Forum';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InteractionHistoryCommentaries from './InteractionHistoryCommentaries';
import api from 'utils/API'


import FormControl from '@material-ui/core/FormControl';
import RateReviewIcon from '@material-ui/icons/RateReview';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import ReportStatus from 'utils/ReportStatus';

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const InteractionCard = props => {
    const { interaction, currentUserId } = props;
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const [commentaries, setCommentaries] = useState([])

    useEffect(() => {
        api.get(`/report-interaction-history/${interaction.id}/commentary`)
            .then((result) => {
                setCommentaries(result.data.reverse())
            })
    }, [])  

    const [userCommentary, setUserCommentary] = useState({
      commentary: ''
    })

    const handleCommentaryChange = sender => {
      setUserCommentary({
          ...userCommentary,
          commentary: sender.target.value
      })
    }    

    const enviarComentario = () => {
      const commentaryToSend = {
          userId: currentUserId,
          reportInteractionHistoryId: interaction.id,
          commentary: userCommentary.commentary            
      }
      api.post('/report-interaction-history/commentary', commentaryToSend)
          .then((result) => {
              setUserCommentary({
                  commentary: ''
              })
              api.get(`/report-interaction-history/${interaction.id}/commentary`)
              .then((result) => {
                  setCommentaries(result.data.reverse())
                  setExpanded(true);
              })
          })
    }

    const keyDown = sender => {
      if (sender.key === 'Enter') {
          enviarComentario()
      }
    }    

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

  return (
    <Card className={classes.root}>
      {interaction.newReportStatusId != ReportStatus.EmAnalise() &&
      <CardHeader
        avatar={
          <Avatar src={interaction.user.profileUrl} aria-label="recipe" className={classes.avatar}>            
          </Avatar>
        }
        title={interaction.user.firstName}
        subheader={interaction.creationDate}        
      />
      }

      <CardContent>
        <Chip size="small" icon={<DoneIcon />} />
        <Typography variant="body2" color="textSecondary" component="p">
            {interaction.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <FormControl fullWidth className={classes.margin} variant="outlined">                     
          <OutlinedInput
              type="text"
              onKeyDown={keyDown}
              placeholder="Incluir resposta"
              value={userCommentary.commentary}
              onChange={handleCommentaryChange}
              endAdornment={
              <InputAdornment position="end">
                  <IconButton
                  onClick={enviarComentario}
                  >
                      <RateReviewIcon />
                  </IconButton>
              </InputAdornment>
              }
          />
        </FormControl>        
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
            {/* Coments */}
          <ForumIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
            <InteractionHistoryCommentaries interactionId={interaction.id} currentUserId={currentUserId} commentaries={commentaries}>

            </InteractionHistoryCommentaries>
        </CardContent>
      </Collapse> 
    </Card>
  );
}

export default InteractionCard;