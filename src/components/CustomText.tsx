import React from 'react'
import { StyleProp, StyleSheet,Text, TextStyle } from "react-native";
import globalStyles from '../theme/appTheme';
interface Props{
    style?: StyleProp<TextStyle>
    children:any
}
export default function CustomText(Props:Props){
    const textStyles =[
        styles.text,
    ]
    return(
        <Text style={[textStyles, Props.style]}>
            {Props.children}
        </Text>
    )
}

const styles= StyleSheet.create({
    text:{
        fontSize:globalStyles.fontSizes.subheading,
        color:'black'
        },

})