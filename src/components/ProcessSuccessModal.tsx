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
}



export const ProcessSuccessModal = ({visible,setIsVisible}:Props) => {
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
                            //backgroundColor:'red',
                            marginRight:-(windowWidth*0.85), 
                            marginTop:-(windowHeigth*0.08) 

                            }}>
                    <TouchableOpacity
                        
                        onPress={()=>{
                            setIsVisible(false);
                        }}>
                           
                        <Icon 
                            name="close-circle-outline" 
                            size={30} 
                            color={globalStyles.colors.danger} />
                    </TouchableOpacity>
                    </View> 
                    <View style={{alignItems:'center',marginTop:20}}>
                        <CustomText >
                                Procesado exitosamente
                            </CustomText>
                            <TouchableOpacity
                                onPress={()=>{
                                }}>
                                  
                                <Icon 
                                    name="checkmark-circle-outline" 
                                    size={100} 
                                    color={globalStyles.colors.sucess} />
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
        height:windowHeigth*0.3,
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
    
});

