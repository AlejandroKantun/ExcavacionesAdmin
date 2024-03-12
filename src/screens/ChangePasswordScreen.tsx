import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react'
import {Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import CustomText from '../components/CustomText'
import { requestToken } from '../data/UserLogin';
import globalStyles from '../theme/appTheme';
import { StackActions } from '@react-navigation/native';
import { Formik } from "formik";
import { changePasswordSchema } from '../validationsSchemas/changePasswordSchema';
import { useEffect } from 'react';
import { useTokenByUserPass } from '../hooks/useTokenByUserPass';

import DeviceInfo from 'react-native-device-info';
import { changePassResult, ChangePassWordRequest } from '../api/operationsToDB';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../navigation/StackNavigator';
import { SavePassModal } from '../components/SavePassModal';

const userName= 'Checador1';
const pass='PasswordApp';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props extends StackScreenProps<RootStackParams,'ChangePasswordScreen'>{}


export const ChangePasswordScreen = ({route}:Props) => {

   const navigation =useNavigation()
   const {token,getToken} =useTokenByUserPass();
   const [deviceId, setdeviceId] = useState('')
   const ChangePassParams= route.params;
    const [isVisible, setIsVisible] = useState(false)

   const submitChangeRequest=async(newPassValidated:string)=>{
    const  changeResult:changePassResult = await ChangePassWordRequest(ChangePassParams.userId,newPassValidated,token,deviceId);
    if (changeResult.success){
        setIsVisible(true);
        setTimeout(() => {
                navigation.dispatch(StackActions.replace(changeResult.path))
        }, 3000);
    }
    else{
        Alert.alert('Ha ocurrido un error en el proceso de actualización');
    }
   }
   useEffect( () => {
    DeviceInfo.getUniqueId().then((result)=>{
        setdeviceId(result)
    });
    const executeToken=async()=>{
        await getToken(
                        ChangePassParams.userName,
                        ChangePassParams.pass)//replace for new ones
    }
    executeToken();
   }, [])
   


  return (
    <View style={localStyles.mainCointainer}>
        
        <View style={localStyles.itemsContainer}>
            {/*
                            <CustomText> user: {userName} pass: {pass} token: {token} deviceId: {deviceId}</CustomText>
            */}
                <Formik
                        initialValues={{ password:'' , confirmPassword:'null'}}
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
                                    style={localStyles.textInputDataHeader}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    autoCorrect={false}
                                    secureTextEntry
                                />
                                {errors.password &&
                                    <Text style={{ fontSize: 13, color: 'red' }}>{errors.password}</Text>
                                }
                            </View>
                           
                            <View style={localStyles.textInputcontainer}>                  
                                <TextInput
                                    placeholder="Repita nueva contraseña"
                                    placeholderTextColor='rgba(0,0,0,0.5)'
                                    style={localStyles.textInputDataHeader}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    autoCorrect={false}
                                    secureTextEntry
                                />
                                {errors.confirmPassword &&
                                    <Text style={{ fontSize: 13, color: 'red' }}>{errors.confirmPassword}</Text>
                                }
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
    
  )
}

const localStyles = StyleSheet.create({
    mainCointainer:{
        flex:1,
        justifyContent:'center',
        alignContent:'center',
    },
    itemsContainer:{
        alignItems:'center',
        justifyContent:'center',
        height:windowHeight*0.5,
        borderRadius:15,
    },
    submitReplaceButton:{
        borderRadius:15,
        paddingVertical:windowHeight*0.012,
        paddingHorizontal:windowWidth*0.08,
        marginHorizontal:windowWidth*0.03,
        marginBottom:windowHeight*0,
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
});