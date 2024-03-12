import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View, Dimensions, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../components/CustomText';
import { AssignRowTo } from '../components/AssignRowTo';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import useDate from '../hooks/useDate';
import globalStyles from '../theme/appTheme';
import { AddMaterialToTicketModal } from '../components/AddMaterialToTicketModal';
import { FlatList } from 'react-native';
import { MaterialQuantityFlatListItem } from '../components/MaterialQuantityFlatListItem';
import { useMaterialQty, MaterialQty } from '../hooks/useMaterialQty';
import { CustomCheckBox } from '../components/CustomCheckBox';
import { SaveTicketModal } from '../components/SaveTicketModal';
import { SignAndSaveModal } from '../components/SignAndSaveModal';
import { useNavigation } from '@react-navigation/core';
import { useCompaniesDB } from '../hooks/useCompaniesDB';
import { useClientsDB } from '../hooks/useClientsDB';
import { useDestinationsDB } from '../hooks/useDestinations';
import { useVehiclesDB } from '../hooks/useVehicles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTicket } from '../hooks/useTicket';
import { dateFormated } from '../data/dateFormated';



const MateriasInTicket:MaterialQty[] = [];

const windowWidth = Dimensions.get('window').width;

export const NewTicketScreen = () => {
  const [newMaterialVisible, setNewMaterialVisible] = useState(false)
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [signModalVisible, setSignModalVisible] = useState(false)
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false)
  const {date}=useDate();
  const {materialsQty,addMaterialsQty,removeMaterialsQty} =useMaterialQty(MateriasInTicket)
  const navigation =useNavigation()
  const{companies}=useCompaniesDB()
  const{clients}=useClientsDB()
  const{destinations}=useDestinationsDB()
  const{vehicles}=useVehiclesDB()
  const{ticket,setPropertyOnTicket}=useTicket()
  const [placa, setPlaca] = useState(false)
  const [noECO, setNoECO] = useState(false)
  const [paymentSelected, setPaymentSelected] = useState({
    cash:false,
    credit:false
  })
  const setPaymentType=(paymentSelected:string)=>{
    paymentSelected==='cash'?
    setPaymentSelected({
      cash:true,
      credit:false
    })
    :
    setPaymentSelected({
      cash:false,
      credit:true
    })
    setPropertyOnTicket("formadepago",paymentSelected)
  }

  useEffect(() => {
    setPropertyOnTicket("creadoPor",1)
  }, [])
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView  style={localStyles.mainContainer}>
        
        <View style={localStyles.headerContainer}>
        <View style={{
          flexDirection:'row',
          justifyContent:'flex-end'
          }}>
            <View style={localStyles.HeaderTitleText}>
          <CustomText style={localStyles.headerText} >
                        Nuevo Vale 
          </CustomText>
        </View>
        <TouchableOpacity 
                  style={localStyles.SearchTicketButton}
                  onPress={()=>{
                    navigation.navigate('SearchTicketScreen' as never)
                  }}>
                  <Icon style={{marginRight:10}} name="search-outline" size={30} color="#fff" />
                  <CustomText style={{color:'#fff'}}>Buscar</CustomText>
                </TouchableOpacity>
        </View>
        
          
        </View>
        <View style={localStyles.companyClientContainer}>
          <View style={localStyles.dateFolioNumberView}>
            <View style={{flexDirection:'row', marginHorizontal:10}}>
                <CustomText style={{textAlign:'center', fontSize:18}} >
                            fecha:{'   '} 
                </CustomText>
                <CustomText style={{textAlign:'center', fontWeight:'bold',fontSize:16}} >
                            {date}
                </CustomText>
            </View>
            <View style={{flexDirection:'row', marginHorizontal:10}}>
                <View style={localStyles.companyClientItemContainer}> 
                <CustomText  >   Folio Fisico:</CustomText>
                <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {'N/A'}
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{setPropertyOnTicket("folioFisico",text)}}
                >
                </TextInput>
            </View>      
          </View>
          </View>
          <AssignRowTo label='Asignado a' assignTo='empresa' data={companies} setPropertyOnTicket={setPropertyOnTicket} />
          {ticket.empresaID==1?
          <View>  
            <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {'Nombre Empresa'}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{setPropertyOnTicket("empresaNombre",text)}}>
            </TextInput>
            </View>
          :null
          }
          <AssignRowTo label='Cliente' assignTo='cliente' data={clients} setPropertyOnTicket={setPropertyOnTicket} />
          {ticket.clienteID==1?
          <View>  
            <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {'Nombre Cliente'}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{setPropertyOnTicket("clienteNombre",text)}}>
            </TextInput>
            </View>
          :null
          }
          <AssignRowTo label='Destino' assignTo='destino' data={destinations} setPropertyOnTicket={setPropertyOnTicket} />
          {ticket.destinoID==1?
          <View>  
            <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {'Nombre destino'}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{setPropertyOnTicket("destinoNombre",text)}}>
            </TextInput>
            </View>
          :null
          }
          <AssignRowTo label='Unidad' assignTo='unidad' data={vehicles} setPropertyOnTicket={setPropertyOnTicket} setPlaca={setPlaca} setNoECO={setNoECO}/>
          {ticket.vehiculoID==1?
          <View>  
            <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {'Nombre vehiculo'}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{setPropertyOnTicket("vehiculoNombre",text)}}>
            </TextInput>
            </View>
          :null
          }
          <View style={localStyles.companyClientItemContainer}> 
            <View style={{flex:1, flexDirection:'row',alignItems:'center'}}>
              <CustomText  >Placas :</CustomText>
              <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {''}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{setPropertyOnTicket("placa",text)}}

                >
              </TextInput>
            </View>
            <View style={{flex:1, flexDirection:'row',alignItems:'center'}}>
              <CustomText  >No. ECO:</CustomText>
              <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {'S / U'}
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{setPropertyOnTicket("numeroEconomico",text)}}

                >
              </TextInput>
            </View>
          </View>
          <View style={localStyles.companyClientItemContainer}> 
            
          </View>
          </View>
          <View>
            <View style={localStyles.headerMaterialsToDispatch}>
                
                <TouchableOpacity 
                      style={localStyles.AddMaterialBtntStyle}
                      onPress={()=>
                        {
                          setNewMaterialVisible(true)
                        }
                      }>
                      <Icon style={{marginTop:3}} name="add-outline" size={30} color="#fff" />
                      <CustomText style={{color:'#fff'}} >Material</CustomText>
                </TouchableOpacity>
                <AddMaterialToTicketModal 
                    visible={newMaterialVisible} 
                    setIsVisible={setNewMaterialVisible} 
                    addMaterialsQty={addMaterialsQty} 
                    lengthData={materialsQty.length} />
            </View>
            <View style={localStyles.flatListContainer}> 
        
              <FlatList
                    data={materialsQty}
                    ListHeaderComponent={<View style={{justifyContent:'center', alignItems:'center'}}>
                      <CustomText  style={{fontSize:20,fontWeight:'200'}}>Materiales en la unidad:</CustomText>
                      </View>}
                    ListFooterComponent={<View><CustomText>Total: {materialsQty.length}</CustomText></View>}
                    renderItem={({item,index})=> 
                    <MaterialQuantityFlatListItem 
                        material={item} 
                        index={index} 
                        removeMaterialsQty={()=>removeMaterialsQty(index)}/>
                    }
              ></FlatList>
              </View>
            </View>
            
            <View style={localStyles.PayInfoContainer}>
              <View style={localStyles.PayInfoRow}>
                <CustomText > Importe ($): </CustomText>
                <TextInput 
                  style={localStyles.AmountTextInput}
                  placeholder={''}
                  placeholderTextColor='rgba(0,0,0,0.5)'
                  keyboardType='number-pad'
                  onChangeText={(text)=>{setPropertyOnTicket("Importe",text)}}
                  ></TextInput>
              </View>
              <View style={[localStyles.PayInfoRow, ]}>
                <CustomText> Forma de pago :</CustomText>
                <CustomCheckBox
                    label='Efectivo '
                    value={paymentSelected.cash}
                    onValueChange={()=>{setPaymentType('cash')}}
                    
                />
                <CustomCheckBox
                    label='Crédito'
                    value={paymentSelected.credit}
                    onValueChange={()=>{setPaymentType('credit')}}
                />
              </View>
              <View style={localStyles.PayInfoRow}>
                <CustomText> Hora de entrada : </CustomText>
                <TouchableOpacity 
                  style={localStyles.datePickerBtn}
                  onPress={()=>{setDatePickerModalVisible(true)}}>
                  <Icon style={{marginRight:10}} name="time-outline" size={30} color="#000" />
                  <CustomText>{ticket.fechaVale?dateFormated(ticket.fechaVale):'Selecciona'}</CustomText>
                </TouchableOpacity>
              </View>
              <View style={localStyles.PayInfoRow}>
                <CustomText> Nombre de despachador: </CustomText>
                <View>
                  <CustomText> CodyExpert </CustomText>
                </View>
              </View>
              <View style={localStyles.BtnPayRow}>
              <TouchableOpacity 
                      style={localStyles.btnSave}
                      onPress={()=>{
                        setSaveModalVisible(true)
                        }}>
                      <Icon style={{marginTop:3, paddingRight:10}} name="save-outline" size={30} color="#fff" />
                      <CustomText style={{color:'#fff'}} >Guardar</CustomText>
                </TouchableOpacity>
                <TouchableOpacity 
                      style={localStyles.btnSave}
                      onPress={()=>{setSignModalVisible(true)}}>
                      <Icon style={{marginTop:3,  paddingRight:10}} name="thumbs-up-outline" size={30} color="#fff" />
                      <CustomText style={{color:'#fff'}} >Guardar {'\n'}Firmar</CustomText>
                </TouchableOpacity>
              </View>
              <View/>
            </View> 
            <SaveTicketModal setIsVisible={setSaveModalVisible} visible={saveModalVisible} ticket={ticket} MaterialsInTicket={materialsQty}/>       
            <SignAndSaveModal setIsVisible={setSignModalVisible} setIsVisibleSave={setSaveModalVisible} visible={signModalVisible} setPropertyOnTicket={setPropertyOnTicket}/>
            <View>
              <DateTimePickerModal
                mode="time"
                isVisible={datePickerModalVisible}
                onConfirm={(datePicked)=>{
                  setPropertyOnTicket("fechaVale",datePicked)
                }}
                onCancel={()=>{setDatePickerModalVisible(false)}}
                onHide={()=>{setDatePickerModalVisible(false)}}
              />
            </View>
    </ScrollView>
    </SafeAreaView>
    
  )
}

const localStyles = StyleSheet.create({ 
    mainContainer:{
      flex:1,
      backgroundColor:globalStyles.colors.white
    },
    headerContainer:{
      paddingTop:20,
      paddingBottom:10,
      backgroundColor:globalStyles.colors.primary,
    },
    HeaderTitleText:{
      justifyContent:'center', 
      alignItems:'center'},
    SearchTicketButton:{
      flex:0,
      flexDirection:'row',
      justifyContent:'flex-end',
      alignItems:'center',
      alignSelf:'baseline',
      borderRadius:2,
      paddingVertical:6,
      marginRight:5, 
      paddingHorizontal:15, 

      backgroundColor:globalStyles.colors.primary
    },
    headerText:{
      fontSize:25,
      marginRight:windowWidth*0.08,
      color:globalStyles.colors.white
    },
    companyClientContainer:{
      borderWidth:1,
      borderRadius:8,
      borderColor:'rgba(0,0,0,0.5)',
      marginVertical:5,
      marginHorizontal:10,
      paddingBottom:12,
      width:windowWidth*0.95,
      backgroundColor:globalStyles.colors.white
    },
    dateFolioNumberView:{
      flexDirection:'row', 
      justifyContent:'space-between', 
      alignItems:'center', 
      paddingVertical:4,
      }
    ,
    companyClientItemContainer:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
      paddingVertical:3,
      marginHorizontal:10
    },
    textInputDataHeader:{
      paddingHorizontal:windowWidth*0.1, 
      paddingVertical:4,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:8, 
      marginHorizontal:10,
      color:'#000'},
    headerMaterialsToDispatch:{
      flex:1,
      flexDirection:'row', 
      justifyContent:'flex-end',
      marginVertical:10
    },
    AddMaterialBtntStyle:{
      backgroundColor:globalStyles.mainButtonColor.color,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      paddingRight:10,
      borderRadius:4,
      marginLeft:100,
      marginRight:10,
      
    },
    flatListContainer:{
      flex:1,
      borderWidth:1,
      borderRadius:4,
      width:windowWidth*0.95,
      justifyContent:'center',
      alignContent:'center',
      marginHorizontal:10,
      backgroundColor:globalStyles.colors.white

    },
    PayInfoContainer:{
      flex:1,
      flexDirection:'column',
      borderWidth:1,
      borderRadius:8,
      borderColor:'rgba(0,0,0,0.5)',
      marginVertical:5,
      marginHorizontal:10,
      paddingBottom:12,
      width:windowWidth*0.95,
      backgroundColor:globalStyles.colors.white

    },
    PayInfoRow:{
      flexDirection:"row",
      justifyContent:'center',
      alignItems:'center',
      paddingTop:5
    },
    BtnPayRow:{
      flexDirection:"row",
      paddingTop:20,
      paddingBottom:10,
      justifyContent:'space-around',
      alignItems:'center'
    },
    btnSave:{
      backgroundColor:globalStyles.mainButtonColor.color,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      paddingHorizontal:25,
      paddingVertical:10,
      borderRadius:4,
    },
    datePickerBtn:{
      flexDirection:'row',
      alignItems:'center',
      borderRadius:2,
      paddingVertical:6,
      paddingHorizontal:10, 
      backgroundColor:globalStyles.colors.shadowBtn
    },
    AmountTextInput:{
      paddingHorizontal:35, 
      paddingVertical:4,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:8, 
      marginHorizontal:10,
      color:'#000',
      
         
    }
});