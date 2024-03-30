import { Platform } from "react-native";
const globalStyles = {
    mainButtonColor:{
        color:"#1572E8",
        text:"#fff"
    },
    colors:{
        textPrimary:"#24292e",
        textSecondary:"#586069",
        primary:"#0366d6",
        primaryRGB:'3,102,214',
        white:"#fefefe",
        textLoginPlaceHolder:"#495057",
        danger:'#f25961',
        sucess:'#5cb85c',
        shadowBtn:'#ededed',
        ambar:'#ffbf00',
        dangerShadow:'rgba(242, 89, 97,0.5)',
        borderColor:'rgb(216, 216, 216)'
    },
    fontSizes:{
        body:14,
        subheading:16
    },
    fonts:{
        main:Platform.select({
            ios:'Arial',
            android:'Roboto',
            default:'System'
        })
    },
    fontWeights:{
        normal:'400',
        bold:'700'
    }
};

export default globalStyles