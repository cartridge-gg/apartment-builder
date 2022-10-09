import { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
    baseStyle: {
        imageRendering: 'pixelated',
        minHeight:"40",
        backgroundColor:"transparent" ,
        fontFamily:"Retro",
        textShadow:"-2px 0 black, 0 3px black, 2px 0 black, 0 -2px black",
        fontSize:"12",
        px:"8",
        color:"white",
        _hover:{},
        _active:{
            _before: {
                backgroundImage: '/Apt_Ui_ButtonA_GreyPressed.png',
                bgPos: "center 50%",
                filter:"grayscale(100%) brightness(40%) sepia(62%) hue-rotate(72deg) saturate(300%) contrast(0.8)",
        },
        },
        _before:{
            bgImage:"/Apt_Ui_ButtonA_GreyIdle.png",
            bgPos:"center 55%",
            bgSize:"160% 60%",
            bgRepeat:"no-repeat",
            content:'""',
            position:"absolute",
            top:"0px",
            left:"0px",
            right:"0px",
            bottom:"0px",
            zIndex:"-1",
            filter:"grayscale(100%) brightness(40%) sepia(69%) hue-rotate(185deg) saturate(600%) contrast(0.8)",
            transition:"filter 0.2s ease, background-position 0.2s ease",
        },
    },
    variants: {
        primary: {
        },
        secondary: {
            _before: {
                filter:"grayscale(100%) brightness(40%) sepia(80%) hue-rotate(105deg) saturate(600%) contrast(0.8)",
            }
        },
    },
    defaultProps: {
        variant: "primary",
    },
};