import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../theme/appTheme';
import { MaterialQty } from '../hooks/useMaterialQty';
import CustomText from '../components/CustomText';
import { useNavigation } from '@react-navigation/core';
import { StackActions } from '@react-navigation/native';

import { openDatabase } from 'react-native-sqlite-storage';
import { useTicketsDB } from '../hooks/useTicketsDB';
import { useTicketsDBByValeID } from '../hooks/useTicketsDBByValeID';
import { btoa } from '../data/base64BLOBConverter';

var db = openDatabase({
    name: 'UserDatabase',
    location: 'default'
   });

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    addMaterialsQty: (newMaterialQty: MaterialQty) => void
}



export const SearchTicketScreen = () => {
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState(0);
    const {tickets}=useTicketsDB()
    const navigation = useNavigation()
    const {tickets:ticketByID,getTicketsByID} =useTicketsDBByValeID()

  return (
    
            <View
                style={localStyles.mainContainer}
                >
               
                    <View style={localStyles.searchTab}>
                      
                    <Dropdown
                                style={[localStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={localStyles.placeholderStyle}
                                selectedTextStyle={localStyles.selectedTextStyle}
                                inputSearchStyle={localStyles.inputSearchStyle}
                                iconStyle={localStyles.iconStyle}
                                data={tickets}
                                search
                                maxHeight={400}
                                labelField="folioFisico"
                                valueField="valeID"
                                placeholder={!isFocus ? '            Buscar Ticket' : '...'}
                                searchPlaceholder="Buscar Ticket"
                                onBlur={() => setIsFocus(false)}
                                renderItem={ (item) => <CustomText style={{marginVertical:6, fontSize:18}}>Vale ID: {item.valeID} -  Folio Físico: {item.folioFisico}</CustomText>}
                                onChange={item => {
                                    setValue(item.valeID);
                                    getTicketsByID(item.valeID);
                                }}
                                renderLeftIcon={() => (
                                    <Icon style={localStyles.renderLeftIcon} 
                                    name="ticket-outline" 
                                    size={30} 
                                    color="rgba(0,0,0,0.5)" />
                                )}
                                />
                    
                   
                     </View>
                     <View>
                       <CustomText>
                         valeId: {JSON.stringify(ticketByID[0]?ticketByID[0].valeID:null)}
                       </CustomText>
                       <CustomText>
                         ClienteID:{JSON.stringify(ticketByID[0]?ticketByID[0].clienteID:null)}
                       </CustomText>
                       <CustomText>
                         fecha vale: {JSON.stringify(ticketByID[0]?ticketByID[0].fechaVale:null)}
                       </CustomText>
                  

                    </View>
                   

                    <View style={localStyles.buttonsContainer}>
                            <TouchableOpacity 
                            style={localStyles.btnCancel}
                            onPress={()=>{
                               

                                navigation.dispatch(
                                    //login process
                                        StackActions.replace('MainDrawerNavigator')
                                )
                            }}>
                            <Icon style={{marginTop:3, paddingRight:10}} name="close-outline" size={30} color="#fff" />
                            <CustomText style={{color:'#fff'}} >Cancelar</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={localStyles.btnSave}
                            onPress={()=>{
                                //VALIDATION


                            }}>
                            <Icon style={{marginTop:3, paddingRight:10}} name="open-outline" size={30} color="#fff" />
                            <CustomText style={{color:'#fff'}} >Cargar</CustomText>
                        </TouchableOpacity>
                    </View>
            </View>
  )

  
}

const localStyles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'space-between'
    },

    searchTab:{
        flexDirection:'row'
    }
    ,
    dropdown: {
        margin: 16,
        height: 50,
        width:windowWidth*0.9,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      icon: {
        marginRight: 5,
      },
      placeholderStyle: {
        fontSize: 16,
        color:'#000'
      },
      selectedTextStyle: {
        fontSize: 16,
        color:'#000',
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color:'#000'
      },
      renderLeftIcon:{
        marginTop:3, 
        marginRight:15, 
        justifyContent:'center', 
        alignItems:'center'},    
    textInputTon:{
      paddingHorizontal:windowWidth*0.07, 
      marginVertical:20,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:2, 
      marginHorizontal:10,
      color:'#000',
      textAlign:'center',
      fontSize:16
    },
    buttonsContainer:{
        flexDirection:'row',
        justifyContent:'flex-end',
        backgroundColor:'white',
        padding:10,
    },
    btnSave:{
        backgroundColor:globalStyles.colors.sucess,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:25,
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
  
      }
});

