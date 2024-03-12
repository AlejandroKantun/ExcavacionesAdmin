import { useNavigation } from '@react-navigation/core'
import React from 'react'
import {View, TouchableOpacity, StyleSheet } from 'react-native'
import CustomText from '../components/CustomText';
import globalStyles from '../theme/appTheme';

export const MainMenuScreen = () => {
  const navigation = useNavigation();
  
  return (
    <View style={localSytles.mainContainer}>
        <TouchableOpacity style={localSytles.loginButton}
            onPress={()=>{
                navigation.navigate('NewTicketScreen' as never);
            }}
                >
                    <CustomText style={localSytles.logginButtonText}>
                        Nueva boleta 
                    </CustomText>
            </TouchableOpacity> 
      <TouchableOpacity style={localSytles.loginButton}
            onPress={()=>{
                navigation.navigate('SketchCanvasWithInteraction' as never);
            }}
                >
                    <CustomText style={localSytles.logginButtonText}>
                        Registrar un vale 
                    </CustomText>
            </TouchableOpacity> 
      <TouchableOpacity style={localSytles.loginButton}
            onPress={()=>{
                navigation.navigate();
            }}
                >
                    <CustomText style={localSytles.logginButtonText}>
                        Registrar un vale 
                    </CustomText>
            </TouchableOpacity> 
    </View>
  )
}


const localSytles= StyleSheet.create({
  mainContainer:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
  },
  
  loginButton:{
      borderRadius:15,
      paddingVertical:20,
      paddingHorizontal:25,
      backgroundColor:globalStyles.mainButtonColor.color,
      textAlign:'center',
      marginTop:40,
  },
  logginButtonText:{
      fontSize:20, 
      color:globalStyles.mainButtonColor.text, 
      textAlign:'center'
  }
})

