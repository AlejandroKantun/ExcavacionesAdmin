import React, { useContext, useEffect, useState } from 'react'
import { Button, View, ActivityIndicator } from 'react-native';
import { postTicketsToDB, requestAndSaveClients, requestAndSaveCompanies, requestAndSaveDestinations, requestAndSaveDrivers, requestAndSaveMaterials, requestAndSaveTickets, requestAndSaveUsers, requestAndSaveVehicles, requestAndSaveZones, requestAndZonesCompanies } from '../api/operationsToDB';
import CustomText from '../components/CustomText';
import { AuthContext } from '../context/AuthContext';
import globalStyles from '../theme/appTheme';
import {useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';


export const RefreshDataFromDatabase = () => {
    const {authState} = useContext(AuthContext)
    const navigation = useNavigation();
    const netInfo = useNetInfo();


    const { isConnected } = useNetInfo();
    useEffect(() => {
      if (isConnected === null) {
        console.log('refreshing...')
        NetInfo.refresh();
      }
      else{
        console.log('is CONNECTED: ' + JSON.stringify(netInfo.details))

        if (netInfo.isConnected){     
            console.log('is CONNECTED')

            try {
                refreshAllTables().then(()=>{
                    navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))
                });
            } catch (error) {
                console.log('FAIL refresh')

                    navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))

            }
            
        }
        else{
            console.log('direct to main')

            navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))
        }
      }
    }, [isConnected]);

    console.log('isConnected ', isConnected);

    const refreshAllTables=async()=>{
            console.log('Posting tickets');
            await postTicketsToDB(authState.empresaID!,authState.token!,authState.appUniqueID!)
            console.log('Recovering vehicles');
            await requestAndSaveVehicles(authState.token!,authState.appUniqueID!);
            console.log('Recovering materiales');
            await requestAndSaveMaterials(authState.token!,authState.appUniqueID!);
            console.log('Recovering drivers');
            await requestAndSaveDrivers(authState.token!,authState.appUniqueID!);
            console.log('Recovering destinations');
            await requestAndSaveDestinations(authState.token!,authState.appUniqueID!);
            console.log('Recovering clients');
            await requestAndSaveClients(authState.token!,authState.appUniqueID!);
            console.log('Recovering users');
            await requestAndSaveUsers(authState.token!,authState.appUniqueID!);
            console.log('Recovering Companies');
            await requestAndSaveCompanies(authState.token!,authState.appUniqueID!);
            console.log('Recovering Zones');
            await requestAndSaveZones(authState.token!,authState.appUniqueID!);
            console.log('Recovering ZonesCompanies');
            await requestAndZonesCompanies(authState.token!,authState.appUniqueID!);
            
    }

  
   
  return (
    <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
        <CustomText style={{fontSize:25}}> Sincronizando datos</CustomText>
        <ActivityIndicator size={40} color={globalStyles.colors.primary} ></ActivityIndicator>  
    </View>
  )
}

