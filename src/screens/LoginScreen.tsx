import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Text, Modal, Button,TouchableOpacity} from 'react-native';
import CustomText from '../components/CustomText'
import globalStyles from '../theme/appTheme';
import { StackActions } from '@react-navigation/native';
import { HeaderTitle } from '../components/HeaderTittle';
import  Icon  from 'react-native-vector-icons/Ionicons';
import { getUserLogin, loginResult } from '../data/UserLogin';
import { connectToDatabase } from '../data/dbStructure';
global.Buffer = require('buffer').Buffer;

const db = connectToDatabase();




export const LoginScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [isVisible, setIsVisible] = useState(false)
 
    
    const loginHandler=async ()=>{
        const loginResult:loginResult = await getUserLogin(user,pass);

        if (!loginResult.authorized )
            setIsVisible(true)
        else if(loginResult.authorized ) {
            if(loginResult.path=='MainDrawerNavigator'){
                navigation.dispatch(StackActions.replace(loginResult.path))
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
  return (
    <View style={localSytles.mainContainer}>
        <View style={localSytles.mainContainer}>
            <CustomText style={localSytles.tittleText}>
                Sistema {'\n' }Administrativo
            </CustomText>
            <View style={{paddingBottom:10}}>
                <TextInput
                    style={localSytles.inputText}
                    placeholder= '  Usuario  '
                    placeholderTextColor={globalStyles.colors.textLoginPlaceHolder}
                    autoCorrect={false}
                    autoCapitalize='words'
                    onChangeText={(Text)=>setUser(Text)}
                />
            <TextInput
                    style={localSytles.inputText}
                    placeholder= 'Contraseña'
                    placeholderTextColor={globalStyles.colors.textLoginPlaceHolder}
                    autoCorrect={false}
                    secureTextEntry
                    onChangeText={(Text)=>setPass(Text)}

                />
            </View>

            <TouchableOpacity style={localSytles.loginButton}
            onPress={()=>{
                loginHandler()
            }}
                >
                    <CustomText style={localSytles.loginButtonText}>
                        Iniciar sesión
                    </CustomText>
            </TouchableOpacity> 
            <Modal
            animationType='fade'
            visible={isVisible}
            transparent={true}
            >
            <View
                style={localSytles.modalView}
                >
                <View
                    style={localSytles.modalContainer}
                        >
                    <HeaderTitle title='Usuario o Password incorrectos'/>
                    <View style={localSytles.iconErrorModal}>
                        <Icon style={{marginTop:3}} name="close-circle-outline" size={55} color={globalStyles.colors.danger} />
                    </View>
                    <Text style={localSytles.textModal}>
                        Verifica tus datos e intenta nuevamente
                    </Text>
                    <Button 
                        title='Cerrar'
                        onPress={()=>{setIsVisible(false)}}
                        />
                </View>
                

            </View>
        </Modal>
        </View>    
    </View>
  )
}


const localSytles= StyleSheet.create({
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

