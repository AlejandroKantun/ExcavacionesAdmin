import { useNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, TextInput, Text, Modal, Button,TouchableOpacity} from 'react-native';
import CustomText from '../components/CustomText'
import globalStyles from '../theme/appTheme';
import { StackActions } from '@react-navigation/native';
import { HeaderTitle } from '../components/HeaderTittle';
import  Icon  from 'react-native-vector-icons/Ionicons';
import { getUserLogin, loginResult } from '../data/UserLogin';
import { connectToDatabase } from '../data/dbStructure';
import { WrongUserDataModal } from '../components/WrongUserDataModal';
import { AuthContext } from '../context/AuthContext';
import { useTokenByUserPass } from '../hooks/useTokenByUserPass';
import { useNetInfo } from "@react-native-community/netinfo";
import { getUserslogged } from '../data/persistantData';
import DeviceInfo from 'react-native-device-info';

global.Buffer = require('buffer').Buffer;

const db = connectToDatabase();

export const LoginScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [isVisible, setIsVisible] = useState(false)
    const {token,getToken} =useTokenByUserPass()
    const {changeUserName,changeUserID,changeToken,signIn,changeZoneID,changeUniqueAppID} = useContext(AuthContext)
    const [deviceId, setdeviceId] = useState('')

    //Network State
    const { type, isConnected } = useNetInfo();

    const loginHandler=async ()=>{
        if (isConnected){
            //If there is connection to internet

            getToken(user,pass).then(
                (response)=>{
                  if (response){ 
                    //if response exist, it means that user is authorized
                      changeToken(response);
                      signIn();
                      changeUserName(user);
                      changeUniqueAppID(deviceId);
                      getUserslogged().then((usersInDB)=>{
                          console.log('users in phone' + usersInDB)
                          if(usersInDB.includes(user)){
                              //it is not the first time
                              //navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))
                              navigation.navigate("RefreshDataFromDatabase" as never)

                          }
                          else{
                              //first time, need to change password
                              navigation.navigate("ChangePasswordScreen" as never)

                          }
                      })
                  }
                  else{
                      //it means that userPass is not correct
                      setIsVisible(true)
                  }
                }
              )
        }else{
            //If there is no connection to internet
            const loginResult:loginResult = await getUserLogin(user,pass);

            if (!loginResult.authorized )
            setIsVisible(true)
            else if(loginResult.authorized ) {
                if(loginResult.path=='MainDrawerNavigator'){
                    signIn();
                    changeUserName(user);
                    changeUserID(Number(loginResult.userID));
                    changeZoneID(Number(loginResult.zoneID));
                    //navigation.dispatch(StackActions.replace(loginResult.path))
                    navigation.navigate("ChangePasswordScreen" as never)
                    } 
                else{
                    navigation.navigate(loginResult.path as never,{
                        userId:loginResult.userID,
                        userName:user,
                        pass:pass,
                    } as never)
                    }
            }
        }
        }  
        
    useEffect(() => {
    DeviceInfo.getUniqueId().then((result)=>{
        setdeviceId(result)
    });
    }, [])
    
  return (
    <View style={localStyles.mainContainer}>
        <View style={localStyles.mainContainer}>
            <CustomText style={localStyles.tittleText}>
                Sistema {'\n' }Administrativo
            </CustomText>
            <View style={{paddingBottom:10}}>
                <TextInput
                    style={localStyles.inputText}
                    placeholder= '  Usuario  '
                    placeholderTextColor={globalStyles.colors.textLoginPlaceHolder}
                    autoCorrect={false}
                    autoCapitalize='words'
                    onChangeText={(Text)=>setUser(Text)}
                />
            <TextInput
                    style={localStyles.inputText}
                    placeholder= 'Contraseña'
                    placeholderTextColor={globalStyles.colors.textLoginPlaceHolder}
                    autoCorrect={false}
                    secureTextEntry
                    onChangeText={(Text)=>setPass(Text)}

                />
            </View>

            <TouchableOpacity style={localStyles.loginButton}
            onPress={()=>{
                loginHandler()
            }}
                >
                    <CustomText style={localStyles.loginButtonText}>
                        Iniciar sesión
                    </CustomText>
            </TouchableOpacity> 
        
        <WrongUserDataModal             
                visible={isVisible}
                setIsVisible={setIsVisible}/>
        </View>    
    </View>
  )
}


const localStyles= StyleSheet.create({
    mainContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    inputsContainer:{
    },
    tittleText:{
        fontSize:35, 
        textAlign:'center'
    },
    inputText:{
        height: 45,
        margin: 6,
        borderWidth: 2,
        padding: 10,
        paddingHorizontal:50,
        color:'black',
        borderRadius:8,
        borderColor:'rgba(0,0,0,0.5)',
        textAlign:'center'
    },
    loginButton:{
        borderRadius:15,
        paddingVertical:8,
        paddingHorizontal:25,
        backgroundColor:globalStyles.mainButtonColor.color,
        textAlign:'center'
    },
    loginButtonText:{
        fontSize:20, 
        color:globalStyles.mainButtonColor.text, 
        textAlign:'center'
    },
    modalView:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.3)',
        alignItems:'center',
        justifyContent:'center',
      
    },
    modalContainer:{
        backgroundColor:'white',
        height:300,
        width:300,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity:0.25,
        elevation:10,
    },
    textModal:{
        color:'black',
        marginBottom:20,
        opacity:0.6
    },
    iconErrorModal:{
        marginBottom:15
    }
})

