import React from 'react'
import { Modal, StyleSheet, View, Text, Button, TouchableOpacity, Dimensions } from 'react-native';
import { HeaderTitle } from './HeaderTittle'
import  Icon  from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import globalStyles from '../theme/appTheme';

const windowWidth = Dimensions.get('window').width;
const windowheight= Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: (value: React.SetStateAction<boolean>) => void
}
export const WrongUserDataModal = ({visible,setIsVisible}:Props) => {
  return (
    <View>
        <Modal
            animationType='fade'
            visible={visible}
            transparent={true}
            >
            <View
                style={localStyles.modalView}
                >
                <View
                    style={localStyles.modalContainer}
                        >
                    <View style={localStyles.headerContainer}>
                        <View style={[localStyles.headerContainerText]} >
                            <Text style={localStyles.title }>
                                Usuario o Password incorrectos
                            </Text>
                        </View>
                    </View>
                    <View style={localStyles.iconErrorModal}>
                        <Icon style={{marginTop:3}} name="close-circle-outline" size={55} color={globalStyles.colors.danger} />
                    </View>
                    <Text style={localStyles.textModal}>
                        Verifica tus datos e intenta nuevamente
                    </Text>
                    <TouchableOpacity style={localStyles.closeButton}
                        onPress={()=>{
                            setIsVisible(false)
                        }}
                            >
                                <CustomText style={localStyles.closeButtonText}>
                                    Cerrar
                                </CustomText>
                        </TouchableOpacity> 
                </View>
                

            </View>
        </Modal>
    </View>
  )
}

const localStyles = StyleSheet.create({
    modalView:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.3)',
        alignItems:'center',
        justifyContent:'center',
    },
    modalContainer:{
        backgroundColor:'white',
        height:windowheight*0.35,
        width:windowWidth*0.8,
        alignItems:'center',
        borderRadius:5,
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity:0.25,
        elevation:10,
    },
    headerContainer:{
        flexDirection:'column',
        borderTopEndRadius:5,
        borderTopStartRadius:5,
        backgroundColor:globalStyles.colors.primary,
        width:windowWidth*0.8,
        height:windowheight*0.1,
        justifyContent:'center',
        alignItems:'center',
        marginBottom: windowheight*0.04,
    },
    textModal:{
        color:'black',
        marginBottom:20,
        opacity:0.6
    },
    iconErrorModal:{
        marginBottom:15
    },
    closeButton:{
        borderRadius:15,
        paddingVertical:8,
        paddingHorizontal:25,
        backgroundColor:globalStyles.mainButtonColor.color,
        textAlign:'center',
        marginTop:-windowWidth*0.02

    },
    closeButtonText:{
        fontSize:20, 
        color:globalStyles.mainButtonColor.text, 
        textAlign:'center',
    },
    title:{
        fontSize:23,
        fontWeight:'bold',
        color:globalStyles.colors.white,
        textAlign:'center'
    },
    headerContainerText:{
        marginBottom:10,
        backgroundColor:globalStyles.colors.primary,
        flexDirection:'row'
    },
});