import React, { useContext } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import globalStyles from '../theme/appTheme';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { string } from 'yup';

interface Props{
  title:string
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const HeaderSearchTicket = ({title}:Props) => {
    const navigation =useNavigation()
    const {logOut} = useContext(AuthContext)

    const logOutHandler=()=>{
        navigation.dispatch(StackActions.replace('SplashScreen'))
        logOut();
      }
  return (
    <View style={localStyles.headerContainer}
    >
      {
        title=='Nuevo Vale'?
        <TouchableOpacity 
        style={localStyles.logOutButton}
        onPress={()=>{
          navigation.navigate('SearchTicketScreen' as never)
        }}>
        <Icon  name="search-outline" size={windowWidth*0.055} color="#fff" />
        <CustomText style={{color:'#fff'}}>Buscar</CustomText>
      </TouchableOpacity>
     :title=='Cambiar Contraseña'?
        null
      :<TouchableOpacity 
        style={localStyles.logOutButton}
        onPress={()=>{
          title =='Editar Vale'
                  ? navigation.navigate("SearchTicketScreen" as never)
                  :navigation.goBack()

        }}>
        <Icon  name="arrow-back-outline" size={windowWidth*0.055} color="#fff" />
        <CustomText style={{color:'#fff'}}>Regresar</CustomText>
      </TouchableOpacity>
      }
        {
        title=='Nuevo Vale'?
        <View style={localStyles.headerTextContainer}>
          <CustomText style={localStyles.headerText} >
          {title}
          </CustomText>
        </View>

        
        :title==='Cambiar Contraseña'?
        <View style={localStyles.headerTextNewPassContainer}>
          <CustomText style={localStyles.headerTextNewPass} >
          Nueva Contraseña 
        </CustomText>
        </View>
        
         :title==='Editar Vale'?
         <View style={localStyles.headerTextContainer}>
           <CustomText style={localStyles.headerText} >
            Editar Vale
          </CustomText>
        </View>
         
        :
        <View style={localStyles.headerTextContainer}>
            <CustomText style={localStyles.headerText} >
            Buscar Vale  
          </CustomText>
        </View>
        
        }
     

      {

        title!='Cambiar Contraseña'?
        <TouchableOpacity 
        style={localStyles.logOutButton}
        onPress={()=>{
          logOutHandler()
        }}>
        <Icon  name="log-out-outline" size={windowWidth*0.055} color="#fff" />
        <CustomText style={{color:'#fff'}}>Salir</CustomText>
        </TouchableOpacity>
      :null

      }
     
          
        </View>
  )
}


const localStyles = StyleSheet.create({
    headerContainer:{
        height:windowHeight*0.068,
        width:windowWidth*1,
        paddingTop:windowHeight*0.02,
        paddingBottom:windowHeight*0.015,
        backgroundColor:globalStyles.colors.primary,
        flexDirection:'row',
        justifyContent:'center',
    
      },
      SearchTicketButton:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'baseline',
        borderRadius:2,
        paddingVertical:6,
        //paddingHorizontal:windowWidth*0.03,
        backgroundColor:globalStyles.colors.primary
      },
      logOutButton:{
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'baseline',
        borderRadius:2,
        backgroundColor:globalStyles.colors.primary,
      },
      HeaderTitleText:{
        justifyContent:'center', 
        alignItems:'center',
        },
        headerTextContainer:{
          width:windowWidth*0.33,
          justifyContent:'center',
          alignItems:'center',
          marginHorizontal:windowWidth*0.084,
        },
      headerTextNewPassContainer:{
        width:windowWidth*0.6,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:windowWidth*0.084,
      },
      headerText:{
          fontSize:windowWidth*0.061,
          marginTop:- windowHeight*0.005,

          color:globalStyles.colors.white
        },
      headerTextNewPass:{
          fontSize:windowWidth*0.061,
          marginTop:- windowHeight*0.005,

          color:globalStyles.colors.white
        },
});