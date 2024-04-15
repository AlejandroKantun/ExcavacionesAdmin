import { useNavigation } from '@react-navigation/core';
import React, { useContext, useState } from 'react'
import {Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native'
import CustomText from '../components/CustomText'
import globalStyles from '../theme/appTheme';
import { StackActions } from '@react-navigation/native';
import { Formik } from "formik";
import { changePasswordSchema } from '../validationsSchemas/changePasswordSchema';
import { useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { changePassResult, ChangePassWordRequest, requestAndSaveUsers, requestAndSaveZones, requestAndZonesCompanies } from '../api/operationsToDB';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../navigation/StackNavigator';
import { SavePassModal } from '../components/SavePassModal';
import { AuthContext } from '../context/AuthContext';
import { useUsersDB } from '../hooks/useUsersDB';
import { storeUser } from '../data/persistantData';
import { HeaderSearchTicket } from '../components/HeaderSearchTicket';
import CheckBox from '@react-native-community/checkbox';
import { Platform } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props extends StackScreenProps<RootStackParams,'ChangePasswordScreen'>{}


export const ChangePasswordScreen = ({route}:Props) => {
    const {authState,changeZoneID,changeUserID}=useContext(AuthContext)
   const navigation =useNavigation()
   const [deviceId, setdeviceId] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const {users,getUserByUserName}=useUsersDB()
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

const submitChangeRequest=async(newPassValidated:string)=>{
              

    const  changeResult:changePassResult = await ChangePassWordRequest(
            users[0].usuarioID.toString(),
            newPassValidated,
            authState.token!,
            deviceId);
       
    if (changeResult.success){
        setIsVisible(true);
        //storing user for next login
        storeUser(authState.userName!);
        changeZoneID(users[0].bancoID);
        changeUserID(users[0].usuarioID);


        setTimeout(() => {
                navigation.dispatch(StackActions.replace(changeResult.path))
        }, 2000);
    }
    else{
        Alert.alert('Ha ocurrido un error en el proceso de actualización');
    }
}
const refreshAllTables=async (appUniqueID:string)=>{
    
    console.log('Recovering Users');
    await requestAndSaveUsers(authState.token!,appUniqueID!)
    console.log('Recovering Zones');
    await requestAndSaveZones(authState.token!,appUniqueID!);
    console.log('Recovering ZonesCompanies');
    await requestAndZonesCompanies(authState.token!,appUniqueID!);
}

useEffect( () => {
    

    DeviceInfo.getUniqueId().then((result)=>{

        setdeviceId(result)
        try {
            refreshAllTables(result).then(()=>{
                getUserByUserName(authState.userName!);
            })            
    
        } catch (error) {
            console.log(JSON.stringify(error))
        }
    });
    
    
   }, [authState.userName])
  return (
      <SafeAreaView style={localStyles.totalContainer}>
          <HeaderSearchTicket
        title={'Cambiar Contraseña'}
        />
        <View style={localStyles.mainCointainer}>
        
        <View style={localStyles.itemsContainer}>
                
                <Formik
                        initialValues={{ password:'' , confirmPassword:''}}
                        validationSchema={changePasswordSchema}
                        onSubmit={values => 
                            submitChangeRequest(values.confirmPassword)

                        }
                        >
                        {({ handleChange, handleBlur, handleSubmit, values,errors, }) => (
                            
                        <View style={{flexDirection:'column'}}>
                            
                            <View style={localStyles.textInputcontainer}>
                                            
                                <TextInput
                                    placeholder="Ingrese nueva contraseña"
                                    placeholderTextColor='rgba(0,0,0,0.5)'
                                    style={localStyles.inputText}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    autoCorrect={false}
                                    secureTextEntry={showPass?false:true}

                                />
                                {errors.password &&
                                    <Text style={{ fontSize: 13, color: 'red' }}>{errors.password}</Text>
                                }
                                <View style={localStyles.showPassContainer}>
                                    <CheckBox
                                        disabled={false}
                                        value={showPass}
                                        tintColors=
                                            {{true: globalStyles.colors.primary, 
                                            false:'rgba(0,0,0,0.5)'}}
                                        tintColor='rgba(0,0,0,0.5)'
                                        onCheckColor={globalStyles.colors.primary}
                                        onValueChange={(newValue) => {setShowPass(newValue)}//onValueChange(newValue)
                                        }
                                        />
                                    <CustomText style={localStyles.labalShowPass}>
                                        Mostrar contraseña
                                    </CustomText>
                                </View>
                            </View>
                           
                            <View style={localStyles.textInputcontainer}>                  
                                <TextInput
                                    maxLength={20}
                                    placeholder="Repita nueva contraseña"
                                    placeholderTextColor='rgba(0,0,0,0.5)'
                                    style={localStyles.inputText}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    autoCorrect={false}
                                    secureTextEntry={showConfirmPass?false:true}
                                    />
                                {errors.confirmPassword &&
                                    <Text style={{ fontSize: 13, color: 'red' }}>{errors.confirmPassword}</Text>
                                }
                                <View style={localStyles.showPassContainer}>
                                    <CheckBox
                                        disabled={false}
                                        value={showConfirmPass}
                                        tintColors=
                                            {{true: globalStyles.colors.primary, 
                                            false:'rgba(0,0,0,0.5)'}}
                                        tintColor='rgba(0,0,0,0.5)'
                                        onCheckColor={globalStyles.colors.primary}
                                        onValueChange={(newValue) => {setShowConfirmPass(newValue)}//onValueChange(newValue)
                                        }
                                        />
                                    <CustomText style={localStyles.labalShowPass}>
                                        Mostrar contraseña
                                    </CustomText>
                                </View>
                            </View>
                        
                        <View style={localStyles.buttonsContainer}>
                        
                            <TouchableOpacity style={localStyles.cancel}
                                onPress={()=>{
                                    
                                    navigation.dispatch(StackActions.pop())
                                    
                                }}
                                    >
                                        <CustomText style={localStyles.submitReplaceButtonText}>
                                        {' '}   Cancelar{' '}
                                        </CustomText>
                            </TouchableOpacity> 
                            <TouchableOpacity style={localStyles.submitReplaceButton}
                                disabled= {errors.confirmPassword?.length!>0}
                                
                                onPress={()=>{
                                    handleSubmit()
                                }}
                                    >
                                        <CustomText style={localStyles.submitReplaceButtonText}>
                                            Actualizar
                                        </CustomText>
                            </TouchableOpacity> 
                            </View>                        
                    </View>
                        
                        )}
                    </Formik>
                
        </View>
        <SavePassModal visible={isVisible} setIsVisible={setIsVisible}/>
        
    </View>
      </SafeAreaView>
    
    
  )
}

const localStyles = StyleSheet.create({
    totalContainer:{
        flex:1
    },
    mainCointainer:{
        justifyContent:'center',
        alignContent:'center',
        flex:1,
    },

    itemsContainer:{
        alignItems:'center',
        justifyContent:'center',
        borderRadius:30,
        borderWidth:1,
        borderColor:globalStyles.colors.borderColor,
        paddingVertical:windowHeight*0.05,
        width:windowWidth*0.95,
        alignSelf:'center'
    },
    submitReplaceButton:{
        borderRadius:15,
        paddingVertical:windowHeight*0.012,
        paddingHorizontal:windowWidth*0.08,
        marginHorizontal:windowWidth*0.03,
        backgroundColor:globalStyles.mainButtonColor.color,
        textAlign:'center'
    },
    submitReplaceButtonText:{
        fontSize:20, 
        color:globalStyles.mainButtonColor.text, 
        textAlign:'center'
    },
    buttonsContainer:{
        flexDirection:'row',
        paddingTop:windowHeight*0.05
    },
    textInputcontainer:{
        flexDirection:'column',
        paddingVertical:windowHeight*0.02,
        alignItems:'center'
    },
    textInputDataHeader:{
        flexWrap:'wrap',
        paddingVertical:windowHeight*0.007,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        color:'#000'},
    cancel:{
        borderRadius:15,
        paddingVertical:windowHeight*0.012,
        paddingHorizontal:windowWidth*0.08,
        marginHorizontal:windowWidth*0.03,
        backgroundColor:globalStyles.colors.danger,
        textAlign:'center'
    },
    inputText:{
        height: windowHeight*0.055,
        width:windowWidth*0.65,
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
    labalShowPass:{
        fontSize:windowHeight*0.016
    },
    showPassContainer:{
        flexDirection:'row',
        alignItems:'center',
        width:Platform.OS=='ios'?windowWidth*0.45:windowWidth*0.45,
        justifyContent:Platform.OS=='ios'?'space-around':'center',
    }
});