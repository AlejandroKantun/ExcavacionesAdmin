import React, { useContext } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import globalStyles from '../theme/appTheme';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const HeaderNewTicket = () => {
    const navigation =useNavigation()
    const {logOut} = useContext(AuthContext)

    const logOutHandler=()=>{
        navigation.dispatch(StackActions.replace('SplashScreen'))
        logOut();
      }
  return (
    <View style={localStyles.headerContainer}>
        <View style={{
          flexDirection:'row',
          justifyContent:'flex-end',
        
          }}>
             <TouchableOpacity 
                  style={localStyles.SearchTicketButton}
                  onPress={()=>{
                    navigation.navigate('SearchTicketScreen' as never)
                    //navigation.dispatch(StackActions.push('SearchTicketScreen'))

                  }}>
                  <Icon style={{marginRight:10}} name="search-outline" size={30} color="#fff" />
                  <CustomText style={{color:'#fff'}}>Buscar</CustomText>
                </TouchableOpacity>
          <View style={localStyles.HeaderTitleText}>
          <CustomText style={localStyles.headerText} >
                        Nuevo Vale 
          </CustomText>
        </View>
            <TouchableOpacity 
                  style={localStyles.logOutButton}
                  onPress={()=>{
                    logOutHandler()
                  }}>
                  <Icon style={{marginRight:10}} name="log-out-outline" size={30} color="#fff" />
                  <CustomText style={{color:'#fff'}}>Salir</CustomText>
                </TouchableOpacity>
        </View>
        
          
        </View>
  )
}


const localStyles = StyleSheet.create({
    headerContainer:{
        flex:1,
        height:windowHeight*0.07,
        paddingTop:windowHeight*0.01,
        paddingBottom:windowHeight*0.015,
        backgroundColor:globalStyles.colors.primary,
        flexDirection:'row',
        justifyContent:'space-around',
      },
      SearchTicketButton:{
        flex:0,
        flexDirection:'row',
        //justifyContent:'flex-end',
        alignItems:'center',
        alignSelf:'baseline',
        borderRadius:2,
        paddingVertical:6,
        //marginRight:50, 
        paddingHorizontal:windowWidth*0.03,
        backgroundColor:globalStyles.colors.primary
      },
      logOutButton:{
        flex:0,
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'baseline',
        borderRadius:2,
        paddingVertical:6,
        paddingHorizontal:windowWidth*0.04, 
        backgroundColor:globalStyles.colors.primary
      },
      HeaderTitleText:{
        justifyContent:'center', 
        alignItems:'center'},
      headerText:{
          fontSize:25,
          marginHorizontal:windowWidth*0.08,
          color:globalStyles.colors.white
        },
});