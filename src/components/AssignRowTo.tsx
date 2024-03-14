import React from 'react'
import { Dimensions, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import globalStyles from '../theme/appTheme';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import {useState} from 'react';
import { Empresa } from '../interfaces/empresa';
import { Cliente } from '../interfaces/cliente';
import { Destino } from '../interfaces/destino';
import { Vehiculo } from '../interfaces/vehiculo';
import { Vale } from '../interfaces/vale';
import { useVehiclesByVehicleID } from '../hooks/useVehiclesByVehicleID';
import { Alert } from 'react-native';

enum AssignType{
    empresa="Empresa",
    cliente="Cliente",
    destino="Destino",
    unidad="Unidad",
}


interface Props{
  assignTo:keyof typeof AssignType,
  label:string,
  data: any[],
  setPropertyOnTicket: (field: keyof Vale, value: any) => void,
  getVehicles?: (vehicleId: number) => Promise<void>
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const AssignRowTo = ({assignTo,label,data,setPropertyOnTicket,getVehicles}:Props ) => {
  const [isFocus, setIsFocus] = useState(false);

  const onSelectVehicle=async(vehicleID:number)=>{
    setPropertyOnTicket( "vehiculoID",vehicleID);
    await getVehicles!(vehicleID)

  }
  return (
    <View style={localStyles.companyClientItemContainer}> 
            <CustomText style={{flex:1,marginLeft:10}} >
                        {label}: 
            </CustomText>
            {/*
            <TextInput style={localStyles.textInputSearch}
            placeholder={'Buscar '+AssignType[assignTo]}
            placeholderTextColor='rgba(0,0,0,0.5)'
            
            >
            </TextInput>
            */}
            {

               AssignType[assignTo]==='Empresa'? 
                        <Dropdown
                                          style={[localStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                          placeholderStyle={localStyles.placeholderStyle}
                                          selectedTextStyle={localStyles.selectedTextStyle}
                                          inputSearchStyle={localStyles.inputSearchStyle}
                                          iconStyle={localStyles.iconStyle}
                                          data={data}
                                          search
                                          maxHeight={400}
                                          labelField="nombreEmpresa"
                                          valueField="empresaID"
                                          placeholder={!isFocus ? '' : ''}
                                          searchPlaceholder=""
                                          //value={value.toString()}
                                          //onFocus={() => setIsFocus(true)}
                                          onBlur={() => setIsFocus(false)}
                                          renderItem={ (item:Empresa) => <View style={localStyles.renderItemContainer}><CustomText> {item.empresaID} - {item.nombreEmpresa}</CustomText></View>}
                                          onChange={item => {
                                            setPropertyOnTicket("empresaID",item.empresaID);
                                          }}
                                          renderLeftIcon={() => (
                                              <Icon style={localStyles.renderLeftIcon} 
                                              name="people-outline" 
                                              size={30} 
                                              color="rgba(0,0,0,0.5)" />
                                          )}
                                          />
                :AssignType[assignTo]==='Cliente'?
                <Dropdown
                                          style={[localStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                          placeholderStyle={localStyles.placeholderStyle}
                                          selectedTextStyle={localStyles.selectedTextStyle}
                                          inputSearchStyle={localStyles.inputSearchStyle}
                                          iconStyle={localStyles.iconStyle}
                                          data={data}
                                          search
                                          maxHeight={400}
                                          labelField="nombreCliente"
                                          valueField="clienteID"
                                          placeholder={!isFocus ? '' : ''}
                                          searchPlaceholder=""
                                          //value={value.toString()}
                                          //onFocus={() => setIsFocus(true)}
                                          onBlur={() => setIsFocus(false)}
                                          renderItem={ (item:Cliente) => <View style={localStyles.renderItemContainer}>
                                                                              <CustomText> {item.clienteID} - {item.nombreCliente} </CustomText>
                                                                         </View> }
                                          onChange={item => {
                                              setPropertyOnTicket("clienteID",item.clienteID);
                                          }}
                                          renderLeftIcon={() => (
                                              <Icon style={localStyles.renderLeftIcon} 
                                              name="person-outline" 
                                              size={30} 
                                              color="rgba(0,0,0,0.5)" />
                                          )}
                                          />
                :AssignType[assignTo]==='Destino'?
                <Dropdown
                                          style={[localStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                          placeholderStyle={localStyles.placeholderStyle}
                                          selectedTextStyle={localStyles.selectedTextStyle}
                                          inputSearchStyle={localStyles.inputSearchStyle}
                                          iconStyle={localStyles.iconStyle}
                                          data={data}
                                          search
                                          maxHeight={400}
                                          labelField="direccionDestino"
                                          valueField="destinoID"
                                          placeholder={!isFocus ? '' : ''}
                                          searchPlaceholder=""
                                          onBlur={() => setIsFocus(false)}
                                          renderItem={ (item:Destino) => <View style={localStyles.renderItemContainer} ><CustomText > {item.nombreDestino} - {item.direccionDestino}</CustomText></View>}
                                          onChange={item => {
                                            setPropertyOnTicket("destinoID",item.destinoID);
                                          }}
                                          renderLeftIcon={() => (
                                              <Icon style={localStyles.renderLeftIcon} 
                                              name="map-outline" 
                                              size={30} 
                                              color="rgba(0,0,0,0.5)" />
                                          )}
                                          />
                :
                <Dropdown
                                          style={[localStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                          placeholderStyle={localStyles.placeholderStyle}
                                          selectedTextStyle={localStyles.selectedTextStyle}
                                          inputSearchStyle={localStyles.inputSearchStyle}
                                          iconStyle={localStyles.iconStyle}
                                          data={data}
                                          search
                                          maxHeight={400}
                                          labelField="tipoUnidad"
                                          valueField="vehiculoID"
                                          placeholder={!isFocus ? '' : ''}
                                          searchPlaceholder=""
                                          onBlur={() => setIsFocus(false)}
                                          renderItem={ (item:Vehiculo) =>
                                                                      <View style={localStyles.renderItemContainer}>
                                                                              <CustomText> {item.vehiculoID} - {item.tipoUnidad}</CustomText>
                                                                         </View>}
                                          onChange={item => {
                                            const setting =async ()=>{
                                                    onSelectVehicle(item.vehiculoID);
                                                     
                                            } 
                                            setting()

                                          }}
                                          renderLeftIcon={() => (
                                              <Icon style={localStyles.renderLeftIcon} 
                                              name="car-outline" 
                                              size={30} 
                                              color="rgba(0,0,0,0.5)" />
                                          )}
                                          />

            }   
          </View>
  )
  
}

const localStyles = StyleSheet.create({
    
    companyClientItemContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
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
    }
});
