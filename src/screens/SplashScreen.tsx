import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import  globalStyles from '../theme/appTheme';
import CustomText from '../components/CustomText';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import { createDatabaseStructure } from '../data/dbStructure';

const userSession='UserSession'
const dbCreatedSession ='dbCreatedSession';

export const SplashScreen = () => {
    const [animating, setAnimating] = useState(true);
    const navigation= useNavigation()
    

    async function validateSession() {
        try {   
            const session = await EncryptedStorage.getItem(userSession);
            console.log(session)

            if (session !== undefined) {
                // data extracted
                
                    navigation.dispatch(
                        StackActions.replace(session===null?'LoginScreen':'MainDrawerNavigator')
                    )
                
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getIsDBCreated (){
        await EncryptedStorage.getItem(dbCreatedSession).then(
        result=>{
          if(result !=null){
              if (result.includes(':true}')){
                  console.log('DB already created')
              }
          }
          else{
            createDatabaseStructure();
           }
        }
       );
 }
    
    useEffect(() => {
        getIsDBCreated() 
        validateSession();
        setTimeout(() => {
        setAnimating(false);
       
        }, 5000);
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