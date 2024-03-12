
import React from 'react'
import { StyleSheet, View } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import globalStyles from '../theme/appTheme';
import CustomText from './CustomText';

interface Props{
    label?:string
    value?: boolean
    onValueChange: (value: boolean) => void
}

export const CustomCheckBox = ({value,onValueChange,label}:Props) => {
  return (
    <View style={localStyles.mainContainer}>
        <CheckBox
            disabled={false}
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