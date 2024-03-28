import React, { useContext, useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { Vale } from '../interfaces/vale';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../theme/appTheme';
import { DeleteTicketModal } from './DeleteTicketModal';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';

interface Props{
    ticketByID: Vale,
    reloadItem: () => void
}


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const TicketToLoadItem = ({ticketByID,reloadItem}:Props) => {
    const [visible, setIsVisible] = useState(false)
    const {authState,ChangeTicket} = useContext(AuthContext)
    const navigation =useNavigation()

    return (
      <View style={localStyles.mainContainer}>
        <View style={localStyles.ticketToLoadContainer}>
            <View style={localStyles.ticketItemsContainer}>
            <View style={localStyles.itemsColumns}>
                <CustomText style={localStyles.customTextStyle}>
                Folio Físico: {JSON.stringify(ticketByID?ticketByID.folioFisico:null)}
                </CustomText>
                <CustomText style={localStyles.customTextStyle}>
                Placas :{JSON.stringify(ticketByID?ticketByID.placa:null)}
                </CustomText>
                <CustomText style={localStyles.customTextStyle}>
                Numero Tolva: {ticketByID.numeroTolva?ticketByID.numeroTolva:'No disponible'}
                </CustomText>
                <CustomText style={localStyles.customTextStyle}>
                fecha vale: {JSON.stringify(ticketByID?ticketByID.fechaVale:null)}
                </CustomText>
                {
                    !ticketByID?.firma?
                    <CustomText style={localStyles.customTextStyle}>
                        Estado: Pendiente por firmar
                    </CustomText>
                    :<CustomText style={localStyles.customTextStyle}>
                        Estado: Firmado
                    </CustomText>
                }
            </View>

                <View style={localStyles.signImageContainer}>
                    {
                        ticketByID.firma?
                        <Image  source={{uri: "data:image/png;base64,"+ticketByID.firma } }
                                                  style={localStyles.signImage}/>
                        :null
                    }
                </View>
                
                                    
                    
        </View>
            <View style={localStyles.btnContainer}>
                    {
                        !ticketByID?.firma?
                        <TouchableOpacity 
                        style={localStyles.btnCancel}
                        onPress={()=>{
                            setIsVisible(true)
                        }}>
                        <Icon style={{marginTop:3, paddingRight:10}} name="trash-outline" size={25} color="#fff" />
                        <CustomText style={{color:'#fff'}} >Borrar</CustomText>
                        </TouchableOpacity>
                        :null
                    }

                    <TouchableOpacity 
                        style={localStyles.btnLoad}
                        onPress={()=>{
                            ChangeTicket(ticketByID);
                            navigation.navigate("UpdateTicketScreen" as never)


                        }}>
                        <Icon style={{marginTop:3, paddingRight:10}} name="arrow-up-circle-outline" size={windowHeight*0.028} color="#fff" />
                        <CustomText style={{color:'#fff'}} >Cargar</CustomText>
                    </TouchableOpacity>
                </View>           
        </View>
        <DeleteTicketModal
         setIsVisible={setIsVisible}
         visible={visible}   
         ticketByID={ticketByID}
         reloadItem={reloadItem}
        />
      </View>
   
  )
}

const localStyles = StyleSheet.create({
    mainContainer:{
            justifyContent:'center',
            alignItems:'center'
    },
    ticketToLoadContainer:{
        width:windowWidth*0.9,
        height:windowHeight*0.21,
        backgroundColor:'rgba('+globalStyles.colors.primaryRGB+',0.1)',
        borderRadius:4,
    },
    ticketItemsContainer:{
        flexDirection:'row',
        height:windowHeight*0.15,

    },
    itemsColumns:{
        flexDirection:'column',
        marginHorizontal:windowWidth*0.02,
        marginVertical:windowHeight*0.01,
        
    },
    imageContainer:{
            flex:1,
            backgroundColor:'rgba(1,1,1,0.2)',
            width:windowWidth*0.12,
            height:windowHeight*0.13,
            marginRight:windowWidth*0.02,
            marginVertical:windowHeight*0.01,
            borderRadius:4
         },
    btnContainer:{
        flexDirection:'row',
        flex:1,
        justifyContent:'flex-end'
        //backgroundColor:'red',
    },
    btnCancel:{
        
        backgroundColor:globalStyles.colors.danger,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:windowWidth*0.4,
        height:windowHeight*0.05,
        borderRadius:4,
        marginHorizontal:windowWidth*0.025,
    },
    btnLoad:{
        backgroundColor:globalStyles.colors.primary,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:windowWidth*0.4,
        height:windowHeight*0.05,
        borderRadius:4,
        marginHorizontal:windowWidth*0.025,
    },
    signImageContainer:{
        justifyContent:'center',
        alignSelf:'center',
        borderRadius:5,
        backgroundColor:'rgba(1,1,1,0.15)',
        height: windowHeight*0.13, 
        width: windowHeight*0.13,
        },
    signImage:{
          height: windowHeight*0.13, 
          width: windowHeight*0.13, 
          resizeMode:'contain'},
    customTextStyle:{fontSize:windowHeight*0.019}
});