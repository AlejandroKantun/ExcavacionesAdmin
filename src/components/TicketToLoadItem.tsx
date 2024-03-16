import React from 'react'
import { TouchableOpacity, View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { Vale } from '../interfaces/vale';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../theme/appTheme';

interface Props{
    ticketByID: Vale[]
}


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const TicketToLoadItem = ({ticketByID}:Props) => {

  return (
    <View style={localStyles.ticketToLoadContainer}>
        <View style={localStyles.ticketItemsContainer}>
            <View style={localStyles.itemsColumns}>
                <CustomText>
                valeId: {JSON.stringify(ticketByID[0]?ticketByID[0].valeID:null)}
                </CustomText>
                <CustomText>
                ClienteID:{JSON.stringify(ticketByID[0]?ticketByID[0].clienteID:null)}
                </CustomText>
                <CustomText>
                fecha vale: {JSON.stringify(ticketByID[0]?ticketByID[0].fechaVale:null)}
                </CustomText>
                {
                    !ticketByID[0]?.firma?
                    <CustomText>
                        Estado: Pendiente por firmar
                    </CustomText>
                    :null
                }
            </View>

            <View  style={localStyles.itemsColumns}>
                <View style={localStyles.imageContainer}>
                    
                </View>
                {
                    !ticketByID[0]?.firma?
                    <TouchableOpacity 
                    style={localStyles.btnCancel}
                    onPress={()=>{
                        
                    }}>
                    <Icon style={{marginTop:3, paddingRight:10}} name="trash-outline" size={25} color="#fff" />
                    <CustomText style={{color:'#fff'}} >Borrar</CustomText>
                    </TouchableOpacity>
                    :null
                }
            </View>
                    
                    
        </View>
                     
    </View>
  )
}

const localStyles = StyleSheet.create({
    ticketToLoadContainer:{
        width:windowWidth*0.9,
        height:windowHeight*0.25,
        backgroundColor:'rgba(0,0,0,0.1)',
        borderRadius:4,
    },
    ticketItemsContainer:{
        flex:1,
        flexDirection:'row'
    },
    itemsColumns:{
        flexDirection:'column'
    },
    imageContainer:{
            backgroundColor:'rgba(1,1,1,0.2)',
            width:windowWidth*0.3,
            height:windowHeight*0.15,
            marginHorizontal:windowWidth*0.015,
            marginVertical:windowHeight*0.01,
            borderRadius:4
         },
    btnCancel:{
        
        backgroundColor:globalStyles.colors.danger,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:windowWidth*0.025,
        paddingVertical:windowHeight*0.01,
        borderRadius:4,
        marginHorizontal:windowWidth*0.025,
    }
    
});