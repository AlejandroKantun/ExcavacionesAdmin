import React, {useState } from 'react'
import { Modal, StyleSheet, View,Text, TextInput, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { string } from 'yup';
import { deleteTicketLocalDB } from '../data/deleteTicketLocalDB';
import { Vale } from '../interfaces/vale';
import globalStyles from '../theme/appTheme';
import { CustomCheckBox } from './CustomCheckBox';
import CustomText from './CustomText';
import { ProcessSuccessModal } from './ProcessSuccessModal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    ticketByID: Vale,
    reloadItem: () => void

}

export const DeleteTicketModal = ({visible,setIsVisible,ticketByID,reloadItem}:Props) => {
    const [value, setValue] = useState(0);
    const [animating, setAnimating] = useState(visible);
    const [deleteBtnDisable, setDeleteBtnDisable] = useState(true)
    const [borderColorTextInput, setBorderColorTextInput] = useState('rgba(242, 89, 97,0.8)')
    const [reason, setReason] = useState('')
    const [successVisible, setSuccessVisible] = useState(false)
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
                            marginTop:-(windowHeight*0.08) 

                            }}>
                    </View> 
                    <View style={{alignItems:'center',marginTop:windowHeight*0.06}}>
                        <CustomText >
                                ¿Desea borrar el ticket seleccionado?
                        </CustomText>
                            <TouchableOpacity
                                disabled={true}
                                >
                                <Icon 
                                    name="alert-circle-outline" 
                                    size={windowWidth*0.15} 
                                    color={globalStyles.colors.ambar} />
                            </TouchableOpacity>
                            <View style={localStyles.PayInfoRow}>
                                <TextInput style={[localStyles.textInpuComments, {borderColor:borderColorTextInput}]}
                                    multiline={true}
                                    placeholder=  {'Comentarios [REQUERIDO]'}
                                    placeholderTextColor={borderColorTextInput}
                                    onChangeText={(text)=>{
                                        setReason(text)
                                        if(text.length<6){
                                            setDeleteBtnDisable(true)
                                            setBorderColorTextInput('rgba(242, 89, 97,0.5)')
                                        }
                                        if(text.length>=6){
                                            setDeleteBtnDisable(false)
                                            setBorderColorTextInput('rgba(0,0,0,0.5)')

                                        }
                                        }}/>
                            </View>
                            <View style={localStyles.btnContainer}>
                                
                                    <TouchableOpacity 
                                    style={[localStyles.btnDelete, {backgroundColor:deleteBtnDisable?globalStyles.colors.dangerShadow: globalStyles.colors.danger}]}
                                    disabled={deleteBtnDisable}
                                    onPress={()=>{
                                        deleteTicketLocalDB(ticketByID.valeID,reason).then(
                                            (res)=>{
                                                if (res==='Success'){
                                                    setIsVisible(false);
                                                    setSuccessVisible(true);
    
                                                    setTimeout(() => { 
                                                        reloadItem();
                                                        setSuccessVisible(false);
                                                    }, 1500);
                                                }
                                            }
                                        )
                                        setIsVisible(true);
                                    }}>
                                    <Icon style={{marginTop:3, paddingRight:10}} name="trash-outline" size={25} color="#fff" />
                                    <CustomText style={{color:'#fff'}} >Borrar</CustomText>
                                    </TouchableOpacity>

                                <TouchableOpacity 
                                    style={localStyles.btnBack}
                                    onPress={()=>{
                                        setIsVisible(false);
                                    }}>
                                    <Icon style={{marginTop:3, paddingRight:10}} name="arrow-back-circle-outline" size={25} color="#fff" />
                                    <CustomText style={{color:'#fff'}} >Regresar</CustomText>
                                </TouchableOpacity>
                            </View>   
                    </View>   
                    
                   
                </View>
                

            </View>
        </Modal>

        <ProcessSuccessModal
            visible={successVisible}
            setIsVisible ={setSuccessVisible}                          
        />
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
        height:windowHeight*0.3,
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
    PayInfoRow:{
        flexDirection:"row",
        justifyContent:'center',
        alignItems:'center',
      }, 
      textInpuComments:{
        width:windowWidth*0.85,
        height:windowHeight*0.09,
        paddingHorizontal:windowWidth*0.08, 
        borderWidth:1,
        borderRadius:4, 
        color:'#000'},
        btnContainer:{
            flexDirection:'row',
            flex:1,
            justifyContent:'flex-end',
            marginTop:windowHeight*0.01
            
            //backgroundColor:'red',
        },
        btnDelete:{
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:windowWidth*0.4,
            height:windowHeight*0.05,
            borderRadius:4,
            marginHorizontal:windowWidth*0.025,
        },
        btnBack:{
            backgroundColor:globalStyles.colors.primary,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:windowWidth*0.4,
            height:windowHeight*0.05,
            borderRadius:4,
            marginHorizontal:windowWidth*0.025,
        }
});

