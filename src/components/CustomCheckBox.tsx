
import React from 'react'
import { StyleSheet, View } from 'react-native'
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

export const CustomCheckBox = ({value,onValueChange,label,ticket}:Props) => {
  return (
    <View style={localStyles.mainContainer}>
        <CheckBox
            disabled={ticket?.firma?true:false}
            tintColors=
                {{true: globalStyles.colors.primary, 
                false:'rgba(0,0,0,0.5)'}}
            tintColor='rgba(0,0,0,0.5)'
            onCheckColor={globalStyles.colors.primary}
            value={value}
            onValueChange={(newValue) => onValueChange(newValue)}
            />
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
    }
});