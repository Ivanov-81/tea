import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: "100%",
        height: '100%',
        flexGrow: 1,
        position: "relative",
        [theme.breakpoints.down('lg')]: {
            height: '100%',
        },
        [theme.breakpoints.down('md')]: {
            height: '100%',
        },
        [theme.breakpoints.down('sm')]: {
            height: '100%',
        },
        [theme.breakpoints.down('xs')]: {
            height: '100%',
        }
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 420,
        display: 'block',
        maxWidth: "100%",
        overflow: 'hidden',
        width: '100%',
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        [theme.breakpoints.down('lg')]: {
            height: 420,
        },
        [theme.breakpoints.down('md')]: {
            height: 420,
        },
        [theme.breakpoints.down('sm')]: {
            height: 198,
        },
        [theme.breakpoints.down('xs')]: {
            height: 198,
        }
    },
    stepper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "none"
    }
}));

export default function Carousel(props) {

    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [data, setData] = React.useState(props.data);
    const maxSteps = data.length;

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepChange = step => {
        setActiveStep(step);
    };

    return (
        <div className={props.style2 ? props.style2 : classes.root}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {
                    data.map((step, index) => {
                        return <div key={`step_${index}`} className={classes.root}>
                            {
                                Math.abs(activeStep - index) <= 2
                                    ? (
                                        <img className={props.style1 ? props.style1 : classes.img} src={step.imgPath ? step.imgPath : step} alt={step.label ? step.label : 'carousel'}/>
                                    )
                                    : null
                            }
                        </div>
                    })
                }
            </AutoPlaySwipeableViews>
            <MobileStepper
                className={classes.stepper}
                steps={maxSteps}
                position="static"
                variant="dots"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                    </Button>
                }
            />
        </div>
    );
}
