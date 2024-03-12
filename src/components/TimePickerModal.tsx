import React, { useCallback, useState } from "react";
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

import globalStyles from "../theme/appTheme";
import CustomText from './CustomText';
import RNDateTimePicker from "@react-native-community/datetimepicker";
 

const windowWidth = Dimensions.get('window').width;
const windowHeigth = Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,

}
export const TimePickerModal = ({visible,setIsVisible}:Props) => {
    const [dateBegin, setDateBegin] = useState(new Date())
    
    return (
    <View>
        <Modal
            animationType='slide'
            visible={visible}
            transparent={true}
            >
            <View
                style={localStyles.modalView}>
                <View
                    style={localStyles.modalContainer}
                    >
                    <CustomText style={{marginBottom:10, }}> Seleccione hora  </CustomText>
                   
                    <RNDateTimePicker 
                        minimumDate={new Date(2023, 3, 1)}
                        value={dateBegin} 
                        timeZoneName={'America/CMDX'}
                        mode="time"
                        
                        dayOfWeekFormat={'{dayofweek.abbreviated(2)}'} />
                      <View style={localStyles.buttonsContainer}>
                            <TouchableOpacity 
                              style={localStyles.btnCancel}
                              onPress={()=>{
                                  setIsVisible(false)
                              }}>
                              <Icon style={{marginTop:3, paddingRight:10}} name="close-outline" size={30} color="#fff" />
                              <CustomText style={{color:'#fff'}} >Cancelar</CustomText>
                          </TouchableOpacity>
                          <TouchableOpacity 
                              style={localStyles.btnSave}
                              onPress={()=>{
                  
                                  setIsVisible(false);
                              }}>
                              <Icon style={{marginTop:3, paddingRight:10}} name="save-outline" size={30} color="#fff" />
                              <CustomText style={{color:'#fff'}} >Guardar</CustomText>
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
    buttonsContainer:{
        flexDirection:'row',
        paddingTop:windowWidth*0.05
    },
    btnSave:{
        backgroundColor:globalStyles.mainButtonColor.color,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:15,
        paddingVertical:12,
        borderRadius:4,
        marginHorizontal:30,
  
      },
      btnCancel:{
        backgroundColor:globalStyles.colors.danger,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:15,
        paddingVertical:12,
        borderRadius:4,
        marginHorizontal:30,
  
      },
      
  });

