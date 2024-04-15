
import React from 'react'
import { StyleSheet, View,Platform, Dimensions } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import globalStyles from '../theme/appTheme';
import CustomText from './CustomText';
import { Vale } from '../interfaces/Vale';

interface Props{
    label?:string,
    value?: boolean,
    onValueChange: (value: boolean) => void,
    ticket?:Vale
}

const windowWidth = Dimensions.get('window').width;
const windowheight= Dimensions.get('window').height;

export const CustomCheckBox = ({value,onValueChange,label,ticket}:Props) => {
  return (
    <View style={localStyles.mainContainer}>
        <View style={localStyles.checkBoxContainer}>
            <CheckBox
                        disabled={ticket?.firma?true:false}
                        tintColors=
                            {{true: globalStyles.colors.primary, 
                            false:'rgba(0,0,0,0.5)'}}
                        tintColor={Platform.OS==='ios'?'rgba(0,0,0,0.1)':'rgba(0,0,0,0.5)'}
                        onCheckColor={globalStyles.colors.primary}
                        animationDuration={0.05}
                        lineWidth={1.2}
                        boxType={'circle'}
                        value={value}
                        onValueChange={(newValue) => onValueChange(newValue)}
                        />
        </View>
        <CustomText>
            {label}
        </CustomText>
    </View>
  )
}

const localStyles = StyleSheet.create({
    mainContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    checkBoxContainer:{
        marginHorizontal:Platform.OS==='ios'?windowWidth*0.02:0,
    }
});