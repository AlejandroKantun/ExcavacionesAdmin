import React, { useState } from 'react'
import { Dimensions, StyleSheet, TextInput, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { Chofer } from '../interfaces/chofer';
import { Vale } from '../interfaces/vale';
import globalStyles from '../theme/appTheme';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props{
  label:string,
  data: any[],
  setPropertyOnTicket: (field: keyof Vale, value: any) => void,
  ticket?:Vale,
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const AddChofer = ({label,data,setPropertyOnTicket,ticket}:Props) => {
    const [isFocus, setIsFocus] = useState(false);

  return (
      <View style={localStyles.mainContainer}>
        <View style={localStyles.companyClientItemContainer}>
        <CustomText  >
                    {label}: 
        </CustomText>
        <Dropdown
                                                disable={ticket?.firma?true:false}
                                                style={[localStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                                placeholderStyle={localStyles.placeholderStyle}
                                                selectedTextStyle={localStyles.selectedTextStyle}
                                                inputSearchStyle={localStyles.inputSearchStyle}
                                                iconStyle={localStyles.iconStyle}
                                                data={data}
                                                value={ticket? data.find((element:Chofer)=>{ return element.choferID===ticket.choferID}):null}
                                                search
                                                maxHeight={400}
                                                labelField="nombreChofer"
                                                valueField="choferID"
                                                placeholder={!isFocus ? 'Selecciona' : ''}
                                                searchPlaceholder=""
                                                onBlur={() => setIsFocus(false)}
                                                renderItem={ (item:Chofer) => <View style={localStyles.renderItemContainer}>
                                                                                    <CustomText> {item.choferID} - {item.nombreChofer} </CustomText>
                                                                                </View> }
                                                onChange={item => {
                                                    setPropertyOnTicket("choferID",item.choferID);
                                                }}
                                                renderLeftIcon={() => (
                                                    <Icon style={localStyles.renderLeftIcon} 
                                                    name="id-card-outline" 
                                                    size={windowWidth*0.055} 
                                                    color="rgba(0,0,0,0.5)" />
                                                )}
                                                />
      
    </View>
    {ticket?.choferID==1?
         <View>  
         <TextInput style={localStyles.textInputDataHeader}
             editable={ticket.firma?false:true}
             placeholder=  {'Nombre Chofer'}  
             placeholderTextColor='rgba(0,0,0,0.5)'
             defaultValue={ticket.choferNombre?ticket.choferNombre:''}
             onChangeText={(text)=>{setPropertyOnTicket("choferNombre",text)}}>
         </TextInput>
         </View>
        :null
        }
      </View>
    
  )
}


const localStyles = StyleSheet.create({
    mainContainer:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        paddingBottom:windowHeight*0.01,
        width:windowWidth*0.85,

    },
    companyClientItemContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:3,
      },
    textInputSearch:{
      flex:2.5,
      paddingHorizontal:35, 
      paddingVertical:4,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:8, 
      marginHorizontal:10,
      color:'#000000',
      width:windowWidth*0.5,

      },
    buttonAddToucahbleOpp:{
      backgroundColor:globalStyles.mainButtonColor.color, 
      borderRadius:4,
      marginRight:10
    },
    dropdown: {
      margin: 5,
      height: 50,
      width:windowWidth*0.6,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
      paddingRight:10
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
    renderItemContainer:{
      marginVertical:10
    },
    textInputDataHeader:{
        //paddingHorizontal:windowWidth*0.05, 
        paddingVertical:4,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        marginHorizontal:5,
        width:windowWidth*0.85,
        color:'#000'},

});
