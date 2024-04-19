import { useNavigation } from '@react-navigation/core';
import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions, Platform, Button } from 'react-native';
import CustomText from '../components/CustomText'
import globalStyles from '../theme/appTheme';
import { getUserLogin, loginResult } from '../data/UserLogin';
import { connectToDatabase, createDatabaseStructure } from '../data/dbStructure';
import { WrongUserDataModal } from '../components/WrongUserDataModal';
import { AuthContext } from '../context/AuthContext';
import { useTokenByUserPass } from '../hooks/useTokenByUserPass';
import { useNetInfo } from "@react-native-community/netinfo";
import { getUserslogged } from '../data/persistantData';
import DeviceInfo from 'react-native-device-info';
import { getEmpresaIDwithUserID } from '../data/getEmpresaIDwithUserID';
import CheckBox from '@react-native-community/checkbox';

global.Buffer = require('buffer').Buffer;

const db = connectToDatabase();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const LoginScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [isVisible, setIsVisible] = useState(false)
    const {token,getToken} =useTokenByUserPass()
    const {changeUserName,changeUserID,changeToken,signIn,changeZoneID,changeUniqueAppID,changeEmpresaID,authState} = useContext(AuthContext)
    const [deviceId, setdeviceId] = useState('')
    const [showPass, setShowPass] = useState(false)

    //Network State
    const { type, isConnected } = useNetInfo();

    const loginHandler=async ()=>{
        console.log('is connected ' + isConnected)
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

                      getEmpresaIDwithUserID(user).then(
                        (res)=>
                        {   
                            console.log('getEmpresaIDwithUserID ' + JSON.stringify(res))

                            getUserslogged().then((usersInDB)=>{
                                console.log('users in phone: ' + usersInDB)
                                if(!usersInDB){
                                    navigation.navigate("ChangePasswordScreen" as never)
                                }
                                else if(usersInDB.toLowerCase().includes(user.toLowerCase())){
                                    //it is not the first time
                                    
                                    try {                                    
                                        changeUserID(Number(res[0]["usuarioID"]))
                                        changeEmpresaID(Number(res[0]["empresaID"]))
                                        changeZoneID(Number(res[0]["bancoID"]))
                                    } catch (error) {
                                        changeEmpresaID(1);
                                        changeZoneID(1);
                                    }

                                    navigation.navigate("RefreshDataFromDatabase" as never)
      
                                }
                                else{
                                    //first time, need to change password
                                    navigation.navigate("ChangePasswordScreen" as never)
      
                                }
                            })
                        }
                        )
                      
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
            console.info(JSON.stringify(loginResult))

            if (!loginResult.authorized )
            setIsVisible(true)
            else if(loginResult.authorized ) {
                if(loginResult.path=='RefreshDataFromDatabase'){
                    signIn();
                    changeUserName(user);
                    getEmpresaIDwithUserID(user).then(
                        (res)=>
                        {
                            changeEmpresaID(Number(res[0]["empresaID"]))
                            changeUserID(Number(res[0]["usuarioID"]))
                            changeZoneID(Number(res[0]["bancoID"]))
                            navigation.navigate("RefreshDataFromDatabase" as never)
                        }


                        )
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
        setdeviceId(result);
        console.log('device ID: '+result)
    });
    }, [])
    
  return (
    <View style={localStyles.mainContainer}>
        <View style={localStyles.itemsContainer}>
            <CustomText style={localStyles.tittleText}>
                Sistema {'\n' }Administrativo
            </CustomText>
            
            <View style={localStyles.inputsContainer}>
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
                    placeholder= '  Contraseña'
                    placeholderTextColor={globalStyles.colors.textLoginPlaceHolder}
                    autoCorrect={false}
                    secureTextEntry={showPass?false:true}
                    onChangeText={(Text)=>setPass(Text)}

                />
                <View style={localStyles.showPassContainer}>
                    <View style={localStyles.checkBoxContainer}>
                    <CheckBox
                        disabled={false}
                        value={showPass}
                        tintColors=
                            {{true: globalStyles.colors.primary, 
                            false:'rgba(0,0,0,0.5)'}}
                        tintColor='rgba(0,0,0,0.5)'
                        onCheckColor={globalStyles.colors.primary}
                        animationDuration={0.05}
                        lineWidth={1.2}
                        boxType={'circle'}
                        onValueChange={(newValue) => {setShowPass(newValue)}//onValueChange(newValue)
                        }
                    />
                    </View>
                    
                    <CustomText>
                        Mostrar contraseña
                    </CustomText>
                </View>
            </View>

            <TouchableOpacity style={localStyles.loginButton}
            onPress={()=>{
                loginHandler()
            }}
                >
                    <CustomText style={localStyles.loginButtonText}>
                        Ingresar ahora
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
    itemsContainer:{
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:windowHeight*0.125,
        paddingHorizontal:windowWidth*0.15,
        borderRadius:30,
        borderWidth:1,
        borderColor:globalStyles.colors.borderColor
    },
    imageLogin:{
        height: windowHeight*0.3, 
        width: windowHeight*0.3, 
        resizeMode:'contain',
        borderRadius:25
    },
    inputsContainer:{marginBottom:windowWidth*0.08},
    tittleText:{
        fontSize:35, 
        textAlign:'center',
        marginBottom:windowWidth*0.05
    },
    inputText:{
        height: windowHeight*0.055,
        width:windowWidth*0.55,
        margin: 6,
        borderBottomColor:'black',
        borderBottomWidth:1,
        paddingTop: 6,
        paddingBottom: 12,
        color:'black',
        borderRadius:8,
        textAlign:'center',
        fontSize:16,
    },
    loginButton:{
        borderRadius:60,
        paddingVertical:15,
        height: windowHeight*0.065,
        width:windowWidth*0.40,
        backgroundColor:globalStyles.mainButtonColor.color,
        textAlign:'center',
        justifyContent:'center'
    },
    loginButtonText:{
        fontSize:14, 
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
    },
    showPassContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',

    },
    checkBoxContainer:{
        marginHorizontal:Platform.OS=='ios'?windowWidth*0.015:0
    }
})

