import React, {useEffect, useState} from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, createStyles, Paper} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {useDispatch, useSelector} from "react-redux";
import {switchSubmenu} from "../../../actions/actionCreator";
import axios from "axios";
import {URL_GET_PRODUCTS} from "../../../js/Urls";
import Zoom from '@material-ui/core/Zoom';
import Slide from '@material-ui/core/Slide';
import Avatar from "@material-ui/core/Avatar";
import {red} from "@material-ui/core/colors";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) =>
    createStyles({
        menu: {
            position: "fixed",
            left: 0,
            top: 0,
            height: "calc(100vh - 0px)",
            width: 0,
            overflow: "hidden",
            margin: 0,
            display: "flex",
            transition: "all .2s ease-in-out",
            zIndex: 1250,
            background: "#f5f5f5",
            color: "#041715",
            flexDirection: 'column'
        },
        openMenu: {
            width: "95%",
            boxShadow: "-4px 4px 25px rgba(0, 0, 0, 0.2)",
        },
        closeWin: {
            position: "absolute",
            left: 20,
            top: 27,
            width: 40,
            height: 40,
            padding: 8
        },
        backWin: {
            position: "absolute",
            right: 20,
            top: 27,
            width: 40,
            height: 40,
            padding: 8
        },
        body: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            padding: "5px 15px",
            overflowX: "hidden",
            overflowY: "auto",
        },
        head: {
            textAlign: 'center',
            padding: '10px 50px',
            fontSize: '15px',
            fontWeight: 500,
            height: 70,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 15,
            lineHeight: '18px'
        },
        product: {
            margin: 10,
            width: 'calc(100% - 20px)',
            minHeight: 145,
            flexDirection: 'row'
        },
        root: {
            width: '100%',
            minHeight: 420,
            marginBottom: 15
        },
        media: {
            height: 185,
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
        cardHeader: {
            height: 92,
            '& .MuiCardHeader-content': {
                '& span': {
                    lineHeight: '15px',
                    marginBottom: 3
                }
            }
        },
        look: {
            fontSize: 15
        },
        favorite: {

        }
    })
);

export default function Submenu(props) {

    const classes = useStyles();
    const dispatch = useDispatch();

    const [update, setUpdate] = useState(false)
    const [group, setGroup] = useState(props.data)
    const [goods, setGoods] = useState([]);
    const [obj, setObj] = useState(JSON.parse(localStorage.getItem('favorite')));

    const onChangeState = () => {
        dispatch(switchSubmenu(false))
    };

    const onChangeStateBack = () => {
        props.changeSubWindowState(false)
    };

    const onGetProducts = (gpr) => {
        setGroup(gpr)
        axios.post(URL_GET_PRODUCTS, {subgroup: Number(gpr.id), count: false}, {})
            .then((result) => {
                const {status, data} = result;
                if (status === 200) {
                    data.products.forEach((v) => {
                        v['expanded'] = false
                    })
                    setGoods(data.products)
                }
            })
    }

    // const handleExpandClick = (id) => {
    //     let o = goods
    //     o.some((v) => {
    //         if(v.id === id) {
    //             v.expanded = !v.expanded
    //             return true
    //         }
    //     })
    //     setGoods(o);
    //     setUpdate(!update);
    // };

    const handlerShowProduct = (el) => {
        props.handlerShowProduct(el);
    };

    const handlerFavorite = (id) => {
        console.log(id)
        if(typeof obj[id] !== "undefined") {
            delete obj[id]
            setObj(obj)
        }
        else {
            obj[id] = null
            setObj(obj);
        }
        setUpdate(!update)
        localStorage.setItem('favorite', JSON.stringify(obj))
    };

    useEffect(() => {

        if(props.data) {
            if(Object.keys(props.data).length !== 0) {
                onGetProducts(props.data)
                // if(Object.keys(group).length === 0) {
                //     onGetProducts(props.data)
                // }
                // else {
                //     onGetProducts(props.data)
                // }
            }
        }

    }, [props.data])

    useEffect(() => {
        console.log(goods)
    }, [goods])

    let count = 2

    return (
        <section className={props.open_submenu ? clsx(classes.menu, classes.openMenu) : classes.menu}>

            <Zoom in={props.open_submenu} style={{ transitionDelay: props.open_submenu ? '300ms' : '0ms' }}>
                <IconButton
                    aria-label="delete"
                    className={classes.closeWin}
                    onClick={onChangeState}
                >
                    <CloseIcon/>
                </IconButton>
            </Zoom>

            <Zoom in={props.open_submenu} style={{ transitionDelay: props.open_submenu ? '300ms' : '0ms' }}>
                <IconButton
                    aria-label="back"
                    className={classes.backWin}
                    onClick={onChangeStateBack}
                >
                    <ChevronRightIcon/>
                </IconButton>
            </Zoom>

            <Zoom in={props.open_submenu} style={{ transitionDelay: props.open_submenu ? '300ms' : '0ms' }}>
                <Card className={classes.head}>
                    {
                        props.data.name
                            ? props.data.name
                            : "Нет данных"
                    }
                </Card>
            </Zoom>
            <div key={(564537376).toString()} className={classes.body}>

                {
                    goods.length > 0 &&
                        goods.map((item, index) => {
                            count++
                            return <Slide direction='left'
                                          style={{ transitionDelay: props.open_submenu ? `${count}00ms` : '0ms' }}
                                          in={props.open_submenu}
                                          mountOnEnter
                                          unmountOnExit
                                          key={(index + 1).toString()}
                            >
                                <Card id={`#${item.id}`} className={classes.root}>
                                    <CardHeader
                                        className={classes.cardHeader}
                                        avatar={
                                            <Avatar variant="rounded" aria-label="recipe" className={classes.avatar}>
                                                {item.name && item.name.charAt(0) === ' ' ? item.name.charAt(1) : item.name.charAt(0)}
                                            </Avatar>
                                        }
                                        // action={
                                        //     <IconButton aria-label="settings">
                                        //         <MoreVertIcon />
                                        //     </IconButton>
                                        // }
                                        title={item.name && item.name}
                                        subheader={`${item.price} руб/${item.unit}`}
                                    />
                                    <CardMedia
                                        className={classes.media}
                                        image={
                                            item.photo && item.photo.split(',')[0]
                                        }
                                        title={item.name && item.name}
                                    />
                                    <CardContent style={{height: 72, overflowX: 'hidden'}}>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {item.recipe && item.recipe}
                                        </Typography>
                                    </CardContent>
                                    <CardActions disableSpacing style={{height: 64, justifyContent: 'space-between'}}>
                                        {/*<IconButton aria-label="add to favorites">*/}
                                        {/*    <FavoriteIcon />*/}
                                        {/*</IconButton>*/}
                                        <IconButton aria-label="share" onClick={() => handlerShowProduct(item)}>
                                            <span className={classes.look}>Посмотреть</span>
                                            {/*<ShareIcon />*/}
                                        </IconButton>
                                        {/*<IconButton*/}
                                        {/*    className={clsx(classes.expand, {*/}
                                        {/*        [classes.expandOpen]: item.expanded && item.expanded,*/}
                                        {/*    })}*/}
                                        {/*    onClick={() => handleExpandClick(item.id && item.id)}*/}
                                        {/*    aria-expanded={item.expanded && item.expanded}*/}
                                        {/*    aria-label="show more"*/}
                                        {/*>*/}
                                        {/*    <ExpandMoreIcon />*/}
                                        {/*</IconButton>*/}
                                        <IconButton
                                            aria-label="add to favorites"
                                            className={classes.favorite}
                                            onClick={() => handlerFavorite(item.id)}
                                        >
                                            {
                                                typeof obj[item.id] !== "undefined"
                                                    ? <FavoriteIcon style={{color: '#3f51b5'}} />
                                                    : <FavoriteBorderIcon />
                                            }
                                        </IconButton>
                                    </CardActions>
                                    <Collapse in={item.expanded && item.expanded} timeout="auto" unmountOnExit>
                                        <CardContent>
                                            <Typography paragraph>Описание:</Typography>
                                            <Typography paragraph>
                                                {item.description && item.description}
                                            </Typography>
                                            <Typography paragraph>
                                                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                                                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                                                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                                                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                                                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                                                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                                            </Typography>
                                            <Typography paragraph>
                                                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                                                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                                                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                                                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                                                minutes more. (Discard any mussels that don’t open.)
                                            </Typography>
                                            <Typography>
                                                Set aside off of the heat to let rest for 10 minutes, and then serve.
                                            </Typography>
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            </Slide>
                        })
                }

            </div>

        </section>
    )

}
