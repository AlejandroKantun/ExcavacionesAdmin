import React, { useContext, useEffect, useState } from 'react'
import { Button, View, ActivityIndicator } from 'react-native';
import { postTicketsToDB, requestAndSaveClients, requestAndSaveCompanies, requestAndSaveDestinations, requestAndSaveDrivers, requestAndSaveMaterials, requestAndSaveTickets, requestAndSaveUsers, requestAndSaveVehicles, requestAndSaveZones, requestAndZonesCompanies } from '../api/operationsToDB';
import CustomText from '../components/CustomText';
import { AuthContext } from '../context/AuthContext';
import globalStyles from '../theme/appTheme';
import {useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import BackgroundFetch from "react-native-background-fetch";

export const RefreshDataFromDatabase = () => {
    const {authState} = useContext(AuthContext)
    const navigation = useNavigation();
    const netInfo = useNetInfo();


    const { isConnected } = useNetInfo();

    const initBackgroundFetch = async () => {
      console.log('[BackgroundFetch] starting... ', );        

      const status:number = await BackgroundFetch.configure({minimumFetchInterval: 20}, 
      async (taskId:string) => {
        console.log('[BackgroundFetch] taskId', taskId);        
        recurrentTaskTorefreshItems();

      }, (taskId:string) => {
        console.log('[Fetch] TIMEOUT taskId:', taskId);
        BackgroundFetch.finish(taskId);
      });
      
    }

    useEffect(() => {  
      initBackgroundFetch().then(()=>{
        BackgroundFetch.start();
      });
     
    }, )
    
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
                  console.log('navigating to MainDrawer')
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


    const recurrentTaskTorefreshItems=async()=>{
      try {
        console.log('Posting tickets in refreshing mode');
        await postTicketsToDB(authState.empresaID!,authState.token!,authState.appUniqueID!)
      } catch (error) {
          console.log('Fail refresh')
      }
    }

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
        <CustomText style={{fontSize:25}}> Sincronizando</CustomText>
        <ActivityIndicator size={40} color={globalStyles.colors.primary} ></ActivityIndicator>  
       
        
    </View>
  )
}

