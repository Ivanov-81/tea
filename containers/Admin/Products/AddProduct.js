import React, {createRef, Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {makeStyles} from "@material-ui/core/styles";
import {createStyles, IconButton, Theme} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import MCatchError from "../../../methods/MCatchError";
import {
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction,
    switchLoader
} from "../../../actions/actionCreator";

import {URL_ADD_PRODUCT} from "../../../js/Urls";
import {Close} from "@material-ui/icons";
import clsx from "clsx";
import Zoom from "@material-ui/core/Zoom";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import {ERROR_COLOR} from "../../../js/constants";
import ListSubheader from "@material-ui/core/ListSubheader";
import models from "../../../js/models";
import {string} from "prop-types";

const CssTextField = withStyles({
    root: {
        borderWidth: "2px",
        '& label.Mui-focused': {
            color: '#EBEBEB',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#EBEBEB',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#EBEBEB',
            },
            '&:hover fieldset': {
                borderColor: '#EBEBEB',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#EBEBEB',
            },
        },
    },
})(TextField);

const useStyles = makeStyles((Theme) =>
    createStyles({
        form: {
            position: "absolute",
            width: 500,
            height: "70%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            background: "#fff",
            top: "15%",
            left: "50%",
            margin: "0 0 0 -320px",
            padding: "0 70px",
            borderRadius: 5,
            overflowX: "hidden",
            overflowY: "auto",
            transition: "all .2s ease-in-out !important",
            boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
            [Theme.breakpoints.down('lg')]: {
                width: 500,
                margin: "0 0 0 -320px",
            },
            [Theme.breakpoints.down('md')]: {
                width: 500,
                margin: "0 0 0 -300px",
                padding: "0 50px",
            },
            [Theme.breakpoints.down('sm')]: {
                width: 500,
                margin: "0 0 0 -300px",
            },
            [Theme.breakpoints.down('xs')]: {
                width: "calc(100% - 80px)",
                padding: "0 30px",
                margin: 0,
                left: 10,
                right: 10,
            }
        },
        input: {
            width: "100%",
            "& p.Mui-error": {
                position: "absolute",
                top: 43,
                background: "#FFF",
                padding: "0 5px",
            }
        },
        name: {
            marginTop: 0,
        },
        vendorCode: {
            marginTop: 10,
            marginBottom: 0
        },
        labels: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            margin: "15px 0",
        },
        pht: {
            width: 105,
            height: 105,
            minHeight: 105,
            minWidth: 105,
            borderRadius: 5,
            background: "rgba(97, 59, 231, 0.3)",
            marginRight: 21,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            "&:hover": {
                background: "rgba(97, 59, 231, 0.3)",
            },
            [Theme.breakpoints.down('xs')]: {
                width: 95.5,
                height: 95.5,
                marginRight: 10
            }
        },
        submit: {
            width: "50%",
            height: 56,
            color: "#444",
            textTransform: "none",
            background: "#FFF",
            border: "2px solid rgba(97, 59, 231, 0.3)",
            fontSize: "16px",
            margin: "15px 0 30px",
            borderRadius: 11,
            "&:hover": {
                background: "#FFF",
            },
        },
        close: {
            position: "absolute",
            right: 15,
            top: 15,
            color: "rgba(97, 59, 231, 0.3)",
            "&:hover": {
                color: ERROR_COLOR,
            }
        },
        body: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "75%",
            padding: "2px 0",
            overflowX: "hidden",
            overflowY: "auto",
        },
        textareaDiv: {
            width: "calc(100% - 4px)",
            height: 94,
            minHeight: 94,
            border: "2px solid #EBEBEB",
            borderRadius: 4,
            overflow: "hidden",
            margin: "10px 0 0",
            display: "flex",
            justifyContent: "flex-start",
        },
        textarea: {
            resize: "none",
            width: "calc(100% + 20px)",
            height: "80px !important",
            border: "2px solid #EBEBEB",
            borderRadius: 4,
            margin: "-2px -2px 0px -2px",
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            padding: 7,
            outline: "none",
            fontSize: "0.875em",
            color: "#444",
            overflow: "auto !important",
        },
        formControl: {
            height: 54,
            position: "relative",
            display: "flex",
            minHeight: 54,
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "18px",
            lineHeight: "24px",
            letterSpacing: "0.15px",
            borderRadius: 4,
            zIndex: 10,
            textAlign: "left",
            "& div": {
                height: 54,
                "& div": {
                    height: 34,
                    padding: "17px 0 3px 15px"
                }
            },
            "& p.Mui-error": {
                position: "absolute",
                top: 41,
                background: "#FFF",
                padding: "0 5px",
            }
        },
        fC1: {
            width: "100%",
        },
        loader: {
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -12,
            marginLeft: -12,
            color: "#fff !important",
        },
    })
);

export default function AddProduct(props) {

    const files = createRef()

    const classes = useStyles()
    const dispatch = useDispatch()

    const loader = useSelector(store => store.app.loader)
    const groups = useSelector(store => store.catalogs.groups)

    const [close, setClose] = useState(false)
    const [open_select, setOpenSelect] = useState(false)

    const [name, setName] = useState("")
    const [error_name, setErrorName] = useState(false)
    const [helper_name, setHelperName] = useState("")

    const [vendor_code, setVendorCode] = useState("")
    const [error_vendor_code, setErrorVendorCode] = useState(false)
    const [helper_vendor_code, setHelperVendorCode] = useState("")

    const [unit, setUnit] = useState("")
    const [error_unit, setErrorUnit] = useState(false)
    const [helper_unit, setHelperUnit] = useState("")

    const [price, setPrice] = useState("")
    const [error_price, setErrorPrice] = useState(false)
    const [helper_price, setHelperPrice] = useState("")

    const [group, setGroup] = useState("18")
    const [error_group, setErrorGroup] = useState(false)
    const [helper_group, setHelperGroup] = useState("")

    const [description, setDescription] = useState("")
    const [error_description, setErrorDescription] = useState(false)
    const [helper_description, setHelperDescription] = useState("")

    const [recipe, setRecipe] = useState("")
    const [error_recipe, setErrorRecipe] = useState(false)
    const [helper_recipe, setHelperRecipe] = useState("")

    const [image_view1, setImageView1] = useState("");
    const [image_view2, setImageView2] = useState("");
    const [image_view3, setImageView3] = useState("");
    const [image_view4, setImageView4] = useState("");

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);

    const [cut_coef, setCutCoef] = useState(false);

    const [plus] = useState("../images/plus.png");

    const editNumber = (target) => {

        let num = target.replace(/[^,^.0-9]/gim, '')

        num = num.replace(/,/, '.')

        if (num.indexOf("..") !== -1) {
            num = num.split("..").join(".")
        }

        if (cut_coef) {
            if (num.split(".").length > 2) {
                if (num.slice(-1) === ".") {
                    num = num.slice(0, -1)
                }
            }
        }

        if (num.indexOf(".") !== -1) {
            setCutCoef(true)
        } else {
            setCutCoef(false)
        }

        return num.split(".")
    }

    const handlerFocusGroup = (e) => {
        if(e.target.value) {
            console.log(String(e.target.value))
            setGroup(String(e.target.value))
        }
        setOpenSelect(false)
        setErrorGroup(false)
        setHelperGroup("")
    };

    const handlerOpen = () => {
        setOpenSelect(true)
    };

    const handlerClose = () => {
        setOpenSelect(false)
    };

    const handlerChangeInputText = (e) => {

        switch (e.target.name) {

            case "name": {
                setName(e.target.value);
                break;
            }

            case "vendor_code": {
                setVendorCode(e.target.value);
                break;
            }

            case "unit": {
                setUnit(e.target.value);
                break;
            }

            case "price": {

                let num = editNumber(e.target.value)

                if (num.length === 2) {
                    if (num[1].length < 5) {
                        setPrice(num.join("."));
                    }
                } else {
                    setPrice(num.join("."));
                }

                break;
            }

            case "description": {
                setDescription(e.target.value);
                break;
            }

            case "recipe": {
                setRecipe(e.target.value);
                break;
            }

            default: {
            }

        }

    }

    const handlerFocusInputText = (e) => {

        switch (e.target.name) {

            case "name": {
                setErrorName(false);
                setHelperName("");
                break;
            }

            case "vendor_code": {
                setErrorVendorCode(false);
                setHelperVendorCode("");
                break;
            }

            case "unit": {
                setErrorUnit(false);
                setHelperUnit("");
                break;
            }

            case "price": {
                setErrorPrice(false);
                setHelperPrice("");
                break;
            }

            case "description": {
                setErrorDescription(false);
                setHelperDescription("");
                break;
            }

            case "recipe": {
                setErrorRecipe(false);
                setHelperRecipe("");
                break;
            }

            default: {
            }

        }

    }


    const sendProduct = (e) => {
        e.preventDefault();

        let form = new FormData(e.target);
        let status = true;

        form.delete("images")

        if (name === "") {
            setErrorName(true);
            setHelperName("Заполните название товара!");
            status = false;
        }

        if (image1 === null) {
            enqueueSnackbar({
                message: "Выберите хотя бы одно изображение",
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'warning',
                    action: (key) => (
                        <Button onClick={() => closeSnackbar(key)}>х</Button>
                    ),
                },
            });
            status = false;
        }

        if (group === "null") {
            setErrorGroup(true);
            setHelperGroup("Выберите группу!");
            status = false;
        }

        if (vendor_code === "") {
            setErrorVendorCode(true);
            setHelperVendorCode("Заполните артикул!");
            status = false;
        }

        if (unit === "") {
            setErrorUnit(true);
            setHelperUnit("Заполните единицы измерения!");
            status = false;
        }

        if (price === "") {
            setErrorPrice(true);
            setHelperPrice("Заполните цену!");
            status = false;
        }

        if (!status) return

        dispatch(switchLoader(true));

        form.set("id", models.generateID(18));
        form.set("data", new Date().getTime());
        form.set("promotion", "0");

        if (typeof image_view1 === "string") {
            if (image_view1.length > 500) {
                form.set("image1", image1);
            }
        }

        if (typeof image_view2 === "string") {
            if (image_view2.length > 500) {
                form.set("image2", image2);
            }
        }

        if (typeof image_view3 === "string") {
            if (image_view3.length > 500) {
                form.set("image3", image3);
            }
        }

        if (typeof image_view4 === "string") {
            if (image_view4.length > 500) {
                form.set("image4", image4);
            }
        }

        let options = {
            method: "POST",
            url: URL_ADD_PRODUCT,
            // headers: {'Authorization': 'Bearer ' + models.getCookie('Authorization')},
            data: form
        }

        axios(options)
            .then(result => {

                const {status} = result;

                if (status === 200) {

                    form.reset()

                    enqueueSnackbar({
                        message: "Изменения сохранены",
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                            action: (key) => (
                                <Button onClick={() => closeSnackbar(key)}>х</Button>
                            ),
                        },
                    });

                }

            })
            .catch((error) => {
                MCatchError(dispatch, error)
            })
            .finally(() => {
                dispatch(switchLoader(false));
            });


    }

    const selectedFile = (event) => {

        if (typeof event.target.files[0] !== "undefined") {

            let reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]);
            setImage1(event.target.files[0])

            reader.onload = () => {
                setImageView1(reader.result);
            };

        } else {
            setImageView1("");
            setImage1(null)
        }

        if (typeof event.target.files[1] !== "undefined") {

            let reader = new FileReader();

            reader.readAsDataURL(event.target.files[1]);
            setImage2(event.target.files[1])

            reader.onload = () => {
                setImageView2(reader.result);
            };

        } else {
            setImageView2("");
            setImage2(null)
        }

        if (typeof event.target.files[2] !== "undefined") {

            let reader = new FileReader();

            reader.readAsDataURL(event.target.files[2]);
            setImage3(event.target.files[2])

            reader.onload = () => {
                setImageView3(reader.result);
            };

        } else {
            setImageView3("");
            setImage3(null)
        }

        if (typeof event.target.files[3] !== "undefined") {

            let reader = new FileReader();

            reader.readAsDataURL(event.target.files[3]);
            setImage4(event.target.files[3])

            reader.onload = () => {
                setImageView4(reader.result);
            };

        } else {
            setImageView4("");
            setImage4(null)
        }

    };

    const closeModal = () => {
        setClose(false)
        setTimeout(() => {
            props.closeModal()
        }, 300)
    }

    const enqueueSnackbar = (...args) => {
        dispatch(enqueueSnackbarAction(...args))
    };

    const closeSnackbar = (...args) => {
        dispatch(closeSnackbarAction(...args));
    };

    useEffect(() => {

    }, []);

    useEffect(() => {
        if (props.state) {
            setClose(true)
        }
    }, [props.state]);

    return (

        <Zoom
            in={close}
            style={{
                transitionDelay: close
                    ? '150ms'
                    : '0ms'
            }}
        >

            <form
                method="POST"
                onSubmit={sendProduct}
                encType="multipart/form-data"
                className={classes.form}
            >

                <h2 style={{marginTop: 26}}>Добавление товара</h2>

                <IconButton
                    className={classes.close}
                    onClick={closeModal}
                >
                    <Close/>
                </IconButton>

                <section className={clsx(classes.body, "scrollbar")}>

                    <CssTextField
                        error={error_name}
                        helperText={helper_name}
                        placeholder="Название товара"
                        name="name"
                        type="text"
                        value={name}
                        className={clsx(classes.input, classes.name)}
                        margin="normal"
                        variant="outlined"
                        onChange={handlerChangeInputText}
                        onFocus={handlerFocusInputText}
                        autoComplete="name"
                        InputProps={{
                            inputProps: {
                                maxLength: 150,
                            },
                        }}

                    />

                    <input
                        ref={files}
                        accept="image/*"
                        style={{display: "none"}}
                        id="file"
                        multiple
                        type="file"
                        name="images"
                        onChange={(e) => selectedFile(e)}
                    />
                    <label htmlFor="file" className={classes.labels}>

                        <Button className={classes.pht} component="div">
                            <img alt="plus" src={image_view1 === "" ? plus : image_view1} style={{maxHeight: 112}}/>
                        </Button>

                        <Button className={classes.pht} component="div">
                            <img alt="plus" src={image_view2 === "" ? plus : image_view2} style={{maxHeight: 112}}/>
                        </Button>

                        <Button className={classes.pht} component="div">
                            <img alt="plus" src={image_view3 === "" ? plus : image_view3} style={{maxHeight: 112}}/>
                        </Button>

                        <Button className={classes.pht} component="div" style={{marginRight: 0}}>
                            <img alt="plus" src={image_view4 === "" ? plus : image_view4} style={{maxHeight: 112}}/>
                        </Button>

                    </label>


                    <FormControl
                        error={error_group}
                        variant="outlined"
                        className={clsx(classes.formControl, classes.fC1)}
                    >


                        {/*<Select*/}
                        {/*    value={group}*/}
                        {/*    name="group_id"*/}
                        {/*    onClick={handlerFocusGroup}*/}
                        {/*    onChange={handlerChangeGroup}*/}
                        {/*>*/}
                        {/*    <MenuItem*/}
                        {/*        disabled*/}
                        {/*        key="0000"*/}
                        {/*        value="null"*/}
                        {/*        style={{color: "#444"}}*/}
                        {/*    >*/}
                        {/*        Выберите группу*/}
                        {/*    </MenuItem>*/}
                        {/*    {*/}
                        {/*        groups.map((item) => {*/}
                        {/*            return <MenuItem*/}
                        {/*                key={item.id}*/}
                        {/*                value={item.id}*/}
                        {/*                style={{fontSize: "16px", color: "#444444"}}*/}
                        {/*            >*/}
                        {/*                {item.name}*/}
                        {/*            </MenuItem>*/}
                        {/*        })*/}
                        {/*    }*/}
                        {/*</Select>*/}


                        <Select
                            value={group}
                            open={open_select}
                            onOpen={handlerOpen}
                            onClose={handlerClose}
                            onClick={handlerFocusGroup}
                            name="group_id"
                        >
                            <MenuItem
                                disabled
                                key="0000"
                                value="null"
                                style={{color: "#444"}}
                            >
                                Выберите группу
                            </MenuItem>
                            {
                                groups.map((item) => {

                                    if (item.parent_id === "0") {
                                        return <>
                                            <MenuItem
                                                disabled
                                                key={item.id}
                                                style={{fontSize: "16px", color: "#444444", opacity: 1}}
                                            >
                                                {item.name}
                                            </MenuItem>
                                            {
                                                groups.map((it) => {
                                                    if (it.parent_id === item.id) {
                                                        return <MenuItem
                                                            key={it.id}
                                                            value={it.id}
                                                            style={{fontSize: "14px", color: "#555555"}}
                                                        >
                                                            {it.name}
                                                        </MenuItem>
                                                    }
                                                })
                                            }
                                        </>
                                    }

                                })
                            }
                        </Select>
                        <FormHelperText>{helper_group}</FormHelperText>
                    </FormControl>


                    <CssTextField
                        error={error_vendor_code}
                        helperText={helper_vendor_code}
                        placeholder="Артикул"
                        name="vendor_code"
                        type="text"
                        value={vendor_code}
                        className={clsx(classes.input, classes.vendorCode)}
                        margin="normal"
                        variant="outlined"
                        onChange={handlerChangeInputText}
                        onFocus={handlerFocusInputText}
                        autoComplete="vendor_code"
                        InputProps={{
                            inputProps: {
                                maxLength: 150,
                            },
                        }}

                    />

                    <CssTextField
                        error={error_unit}
                        helperText={helper_unit}
                        placeholder="Ед. измерения"
                        name="unit"
                        type="text"
                        value={unit}
                        className={clsx(classes.input, classes.vendorCode)}
                        margin="normal"
                        variant="outlined"
                        onChange={handlerChangeInputText}
                        onFocus={handlerFocusInputText}
                        autoComplete="unit"
                        InputProps={{
                            inputProps: {
                                maxLength: 150,
                            },
                        }}

                    />

                    <CssTextField
                        error={error_price}
                        helperText={helper_price}
                        placeholder="Цена"
                        name="price"
                        type="text"
                        value={price}
                        className={clsx(classes.input, classes.vendorCode)}
                        margin="normal"
                        variant="outlined"
                        onChange={handlerChangeInputText}
                        onFocus={handlerFocusInputText}
                        autoComplete="price"
                        InputProps={{
                            inputProps: {
                                maxLength: 10,
                            },
                        }}

                    />

                    <div className={classes.textareaDiv}>

                        <TextareaAutosize
                            placeholder="Описание продукта"
                            value={description}
                            className={clsx(classes.textarea, "scrollbar")}
                            name="description"
                            onChange={handlerChangeInputText}
                            onFocus={handlerFocusInputText}
                            autoComplete="description"
                        />
                        {
                            error_description && <span className={classes.shotDesc}>{helper_description}</span>
                        }

                    </div>

                    <div className={classes.textareaDiv}>

                        <TextareaAutosize
                            placeholder="Рецепт приготовления"
                            value={recipe}
                            className={classes.textarea}
                            style={{}}
                            name="recipe"
                            onChange={handlerChangeInputText}
                            onFocus={handlerFocusInputText}
                            autoComplete="recipe"
                        />
                        {
                            error_recipe && <span className={classes.shotDesc}>{helper_recipe}</span>
                        }

                    </div>

                </section>

                <Button
                    type="submit"
                    className={classes.submit}
                    disabled={loader}
                >
                    {
                        loader &&
                        <CircularProgress size={24} className={classes.loader}/>
                    }
                    Сохранить
                </Button>

            </form>

        </Zoom>

    );
}