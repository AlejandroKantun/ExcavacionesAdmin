import React, {useEffect, useState } from 'react'
import { Modal, StyleSheet, View,Text, TextInput, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { SaveTicketsToLocalDB } from '../data/SaveTicketsToLocalDB';
import { Vale } from '../interfaces/vale';
import globalStyles from '../theme/appTheme';
import CustomText from './CustomText';
import { useTicket } from '../hooks/useTicket';
import { MaterialQty } from '../hooks/useMaterialQty';

const windowWidth = Dimensions.get('window').width;
const windowHeigth = Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    textToShow:string
}



export const WarningModal = ({visible,setIsVisible,textToShow}:Props) => {
    const [value, setValue] = useState(0);
    const [animating, setAnimating] = useState(visible);
    useEffect(() => {
      if (visible){

      }  
    }, [visible])
    
 
  return (
      <View>
          <Modal
            animationType='slide'
            visible={visible}
            transparent={true}
            >
            <View
                style={localStyles.modalView}
                >
                
                <View
                    style={localStyles.modalContainer}
                        >
                    <View
                    style={{
                            flexDirection:'column',
                            marginRight:-(windowWidth*0.85), 
                            marginTop:-(windowHeigth*0.08) 

                            }}>
                    <TouchableOpacity
                        
                        onPress={()=>{
                            setIsVisible(false);
                        }}>
                           
                        
                    </TouchableOpacity>
                    </View> 
                    <View style={{alignItems:'center',marginTop:windowHeigth*0.07}}>
                            
                            <CustomText style={{fontSize:windowHeigth*0.02, flexWrap:'wrap'}}>
                                {textToShow}
                            </CustomText>
                            <TouchableOpacity
                                onPress={()=>{
                                    setIsVisible(false)
                                }}>
                                  
                                <Icon 
                                    name="alert-circle-outline" 
                                    size={windowHeigth*0.09} 
                                    color={globalStyles.colors.ambar} />
                            </TouchableOpacity>
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
        height:windowHeigth*0.35,
        width:windowWidth*0.95,
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
    closeButton:{
        borderRadius:windowHeigth*0.004,
        width:windowWidth*0.25,
        height:windowHeigth*0.04,
        backgroundColor:globalStyles.mainButtonColor.color,
        textAlign:'center',
        justifyContent:'center',

    },
    closeButtonText:{
        fontSize:windowHeigth*0.022, 
        color:globalStyles.mainButtonColor.text, 
        textAlign:'center',

    },
    
});

