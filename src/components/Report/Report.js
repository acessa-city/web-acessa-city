import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useEffect } from 'react';
import { useState } from 'react';
import api from 'utils/API';
import Carousel from 'react-material-ui-carousel'
import ReactStars from 'react-rating-stars-component'
import ReportInteractionHistory from 'views/ReportInteractionHistory'
import currentUser from 'utils/AppUser'

const useStyles = makeStyles({
    root: {
      maxWidth: 600,
    },
    media: {
      height: 280,
    },
  });

const Report = props => {
    const { reportId } = props;
    const classes = useStyles();

    const [report, setReport] = useState({});
    const [user, setUser] = useState({});
    const [rating, setRating] = useState(0);
    const [media, setMedia] = useState({
        hasMedia: false,
        photos: [],
        videos: []
    })

    const ratingChanged = (newRating) => {
        const userRating = {
            userId: user.id,
            reportId: reportId,
            rating: newRating
        }

        api.post('/report-classification', userRating)
            .then(result => {
                setRating(newRating)
            })
    }

    const updateMediaLinks = attachments => {
        const photos = media.photos;
        if (attachments) {
            setMedia({
                ...media,
                hasMedia: true
            });
            attachments.forEach(element => {
                photos.push(element.url)
            });
        }
    }

    useEffect(() => {
        api.get('/report/'+reportId)
            .then((result) => {
                console.log(result.data)
                updateMediaLinks(result.data.attachments)
                setReport(result.data);
            })
            .catch(error => {

            })

        currentUser().then(result => {            
            setUser(result);
            api.get(`/report-classification?userId=${result.id}&reportId=${reportId}`)
                .then(result => {
                    setRating(result.data.rating);
                })
        })            
    }, [])

    return (
        <Card className={classes.root}>
            {media.hasMedia &&
                <Carousel>
                 {
                        media.photos.map(item => (
                            <div>
                                {item.includes('.mp4') &&
                                    <video controls
                                        width='100%'
                                        height='auto'
                                    >
                                        <source src={item} />
                                    </video>
                                }

                                {!item.includes('.mp4') &&

                                    <CardMedia
                                        width='100%'
                                        height='auto'
                                        className={classes.media}
                                        image={item}
                                        title={item}
                                    />

                                }
                            </div>
                        ))
                    }
                </Carousel>
            }
            <CardContent>
            <ReactStars
                count={5}
                onChange={ratingChanged}
                half={false}
                size={24}
                value={rating}
                color2={'#ffd700'} 
            />
                <Typography gutterBottom variant="h3" component="h2">
                    {report.title}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                    Categoria: {report.category ? report.category.name : ''}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {report.description}
                </Typography>
                
                {user &&
                    <ReportInteractionHistory reportId={reportId} currentUserId={user.id} ></ReportInteractionHistory>
                }                
            </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              Share
            </Button>
            <Button size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>
    );

}

export default Report;