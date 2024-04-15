import React, { useContext, useState } from 'react'
import { Image, TouchableOpacity, View, Platform } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { Vale } from '../interfaces/vale';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../theme/appTheme';
import { DeleteTicketModal } from './DeleteTicketModal';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';
import { dateFormated } from '../data/dateFormated';

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
                Fecha vale:  {ticketByID.fechaVale?ticketByID.fechaVale:null}
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
                        <Icon style={{marginTop:3, paddingRight:10}} 
                        name={ticketByID?.firma?'eye-outline':'pencil-outline'}
                        size={windowHeight*0.028} color="#fff" />
                        <CustomText style={{color:'#fff'}} >
                            {!ticketByID?.firma?'Editar':'Ver'}
                        </CustomText>
                    </TouchableOpacity>
                </View>
                <View style={localStyles.isLoadContainer}>
                    <CustomText>
                        Enviado:
                    </CustomText>
                    <Icon 
                        style={{marginTop:3, paddingRight:10}} 
                        name={ticketByID.EnviadoABaseDeDatosCentral?
                            "cloud-done-outline"
                            :"close-circle-outline"} 
                        size={windowHeight*0.03} 
                        color={
                                ticketByID.EnviadoABaseDeDatosCentral?
                                globalStyles.colors.primary
                                :globalStyles.colors.dangerShadow} />
 
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
        height:windowHeight*0.227,
        backgroundColor:'rgba('+globalStyles.colors.primaryRGB+',0.1)',
        borderRadius:4,
        
    },
    ticketItemsContainer:{
        flexDirection:'row',
        height:windowHeight*0.15,
        justifyContent:'center',
    },
    itemsColumns:{
        flexDirection:'column',
        marginRight:windowWidth*0.008,
        marginVertical:windowHeight*0.01,

        
    },
    imageContainer:{
            flex:1,
            backgroundColor:'rgba(1,1,1,0.2)',
            width:windowWidth*0.12,
            height:windowHeight*0.13,
            marginRight:windowWidth*0.02,
            marginVertical:windowHeight*0.01,
            borderRadius:4,
            justifyContent:'center',
            alignItems:'center'
         },
    btnContainer:{
        flexDirection:'row',
        flex:1,
        justifyContent:'flex-end'
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
    customTextStyle:{
        fontSize:Platform.OS==='ios'?windowHeight*0.0165:windowHeight*0.019,
    },
    isLoadContainer:{
        flexDirection:'row',
        alignSelf:'flex-end',
        alignItems:'center',
        justifyContent:'center',
        marginRight:windowWidth*0.02,
        marginTop:windowHeight*0.045
    }
});