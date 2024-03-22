import React, { useContext, useEffect, useState } from 'react'
import { Button, View, ActivityIndicator } from 'react-native';
import { requestAndSaveClients, requestAndSaveDestinations, requestAndSaveDrivers, requestAndSaveMaterials, requestAndSaveTickets, requestAndSaveUsers, requestAndSaveVehicles } from '../api/operationsToDB';
import CustomText from '../components/CustomText';
import { AuthContext } from '../context/AuthContext';
import globalStyles from '../theme/appTheme';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { size } from '@shopify/react-native-skia';
import { Alert } from 'react-native';



export const RefreshDataFromDatabase = () => {
    const {authState} = useContext(AuthContext)
    const navigation = useNavigation();
    const { type, isConnected } = useNetInfo();

    const refreshAllTables=()=>{
            console.log('Recovering vehicles');
            requestAndSaveVehicles(authState.token!,authState.appUniqueID!);
            console.log('Recovering materiales');
            requestAndSaveMaterials(authState.token!,authState.appUniqueID!);
            console.log('Recovering drivers');
            requestAndSaveDrivers(authState.token!,authState.appUniqueID!);
            console.log('Recovering destinations');
            requestAndSaveDestinations(authState.token!,authState.appUniqueID!);
            console.log('Recovering clients');
            requestAndSaveClients(authState.token!,authState.appUniqueID!);
            console.log('Recovering users');
            requestAndSaveUsers(authState.token!,authState.appUniqueID!)

            //requestAndSaveTickets(authState.token!,authState.appUniqueID!);
    }
    useEffect(() => {
       
        setTimeout(() => {
            if (isConnected){
                
                setTimeout(() => {
                    refreshAllTables();
                    //navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))
                  }, 7000);
            }
            else{
                navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))
            }
        }, 1000);
        
    }, [isConnected])
  return (
    <View style={{justifyContent:'center', alignItems:'center', flex:1}}>

        <CustomText style={{fontSize:25}}> Sincronizando datos</CustomText>
        <ActivityIndicator size={40} color={globalStyles.colors.primary} ></ActivityIndicator>  
        <Button
            title='Press me to refresh'
            onPress={()=>{
                refreshAllTables();
            }}
        ></Button>
        <Button
            title='Press me to go main'
            onPress={()=>{
                navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))
            }}
        ></Button>
    </View>
  )
}

