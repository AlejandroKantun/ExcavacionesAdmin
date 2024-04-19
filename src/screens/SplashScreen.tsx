import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import  globalStyles from '../theme/appTheme';
import CustomText from '../components/CustomText';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import { createDatabaseStructure } from '../data/dbStructure';
import { requestResetDeviceID } from '../api/operationsToDB';
import DeviceInfo from 'react-native-device-info';

const userSession='UserSession'
const dbCreatedSession ='dbCreatedSession';

export const SplashScreen = () => {
    const [animating, setAnimating] = useState(true);
    const navigation= useNavigation()
    

    async function validateSession() {
        try {   
            const session = await EncryptedStorage.getItem(userSession);
            console.log(session)
                    navigation.dispatch(
                        StackActions.replace('LoginScreen')
                        //StackActions.replace('MainDrawerNavigator')
                    )
                
            
        } catch (error) {
            console.log(error)
        }
    }

    async function getIsDBCreated (appUniqueID:string){
        await EncryptedStorage.getItem(dbCreatedSession).then(
        result=>{
          if(result !=null){
              if (result.includes(':true}')){
                  console.log('DB already created')
              }else{
                createDatabaseStructure().then(()=>{
                    requestResetDeviceID(appUniqueID)
                })
              }
          }
          else{
            createDatabaseStructure().then(()=>{
                requestResetDeviceID(appUniqueID)
            })
           }
        }
       );
 }
    
    useEffect(() => {
        DeviceInfo.getUniqueId().then((result)=>{
            getIsDBCreated(result).then(()=>{
                validateSession();
                setTimeout(() => {setAnimating(false);}, 5000);
            });
                    
        });

        
    }, []);
    return (
    <View
        style={localStyles.mainContainer}
        >
        <ActivityIndicator
        size='large' 
        color={globalStyles.mainButtonColor.color}
        animating={animating}
        />
        <CustomText >
            Cargando información...
        </CustomText>
    </View>
  )
}

const localStyles = StyleSheet.create({
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
});