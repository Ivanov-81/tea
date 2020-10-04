import React, {createRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {makeStyles} from "@material-ui/core/styles";
import {createStyles, IconButton} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import MCatchError from "../../../methods/MCatchError";
import {
    closeSnackbar,
    enqueueSnackbar,
    switchLoader
} from "../../../actions/actionCreator";
import models from "../../../js/models";
import {URL_ADD_PRODUCT} from "../../../js/Urls";
import {Close} from "@material-ui/icons";
import clsx from "clsx";
import Zoom from "@material-ui/core/Zoom";

const CssTextField = withStyles({
    root: {
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

const useStyles = makeStyles(() =>
    createStyles({
        form: {
            position: "absolute",
            width: "50%",
            height: "70%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            background: "#fff",
            top: "50%",
            left: "50%",
            margin: "-25%",
            borderRadius: "5px",
            overflowX: "hidden",
            overflowY: "auto",
        },
        input: {
            width: "calc(75% + 6px)",
        },
        name: {},
        labels: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            margin: "15px 0",
        },
        pht: {
            width: 112,
            height: 112,
            borderRadius: 5,
            background: "rgba(97, 59, 231, 0.3)",
            marginRight: 21,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            "&:hover": {
                background: "rgba(97, 59, 231, 0.3)",
            }
        },
        submit: {},
        close: {
            position: "absolute",
            right: 15,
            top: 15,
            color: "rgba(97, 59, 231, 0.3)"
        },
        vendorCode: {}
    })
);

export default function AddProduct(props) {

    const files = createRef()

    const classes = useStyles()
    const dispatch = useDispatch()

    const products = useSelector(store => store.catalogs.products)

    const [close, setClose] = useState(false)

    const [name, setName] = useState("")
    const [error_name, setErrorName] = useState(false)
    const [helper_name, setHelperName] = useState("")

    const [vendor_code, setVendorCode] = useState("")
    const [error_vendor_code, setErrorVendorCode] = useState(false)
    const [helper_vendor_code, setHelperVendorCode] = useState("")

    const [image_view1, setImageView1] = useState("");
    const [image_view2, setImageView2] = useState("");
    const [image_view3, setImageView3] = useState("");
    const [image_view4, setImageView4] = useState("");

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);

    const [plus] = useState("../images/plus.png");

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
            default: {
            }

        }

    }


    const sendProduct = (e) => {
        e.preventDefault();

        let form = new FormData(e.target)

        form.delete("images")

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
            headers: {'Authorization': 'Bearer ' + models.getCookie('Authorization')},
            data: form
        }

        console.log(options)

        // axios(options)
        //     .then(result => {
        //
        //         const {status} = result;
        //
        //         if (status === 200) {
        //
        //             enqueueSnackbar({
        //                 message: "Изменения сохранены",
        //                 options: {
        //                     key: new Date().getTime() + Math.random(),
        //                     variant: 'success',
        //                     action: (key) => (
        //                         <Button onClick={() => closeSnackbar(key)}>х</Button>
        //                     ),
        //                 },
        //             });
        //
        //         }
        //
        //     })
        //     .catch((error) => {
        //         MCatchError(dispatch, error)
        //     })
        //     .finally(() => {
        //         dispatch(switchLoader(false));
        //     });


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

                <h3 style={{marginTop: 26}}>Добавление товара</h3>

                <IconButton
                    className={classes.close}
                    onClick={closeModal}
                >
                    <Close/>
                </IconButton>

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

                <Button
                    type="submit"
                    className={classes.submit}
                >
                    Сохранить
                </Button>

            </form>

        </Zoom>

    );
}