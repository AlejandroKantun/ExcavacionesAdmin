import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View, Dimensions, Button, StyleProp, Text, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../components/CustomText';
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
import { StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTicket } from '../hooks/useTicket';
import { dateFormated, dateFormatedff } from '../data/dateFormated';
import { AuthContext } from '../context/AuthContext';
import { getLastRowTickets } from '../data/getLastRowTickets';
import { TicketAssignDetail } from '../components/TicketAssignDetail';
import { HeaderSearchTicket } from '../components/HeaderSearchTicket';
import { SaveTicketsToLocalDB } from '../data/SaveTicketsToLocalDB';
import { ProcessSuccessModal } from '../components/ProcessSuccessModal';
import { WarningModal } from '../components/WarningModal';




const MateriasInTicket:MaterialQty[] = [];

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const NewTicketScreen = () => {
  const {authState} = useContext(AuthContext)
  const [nextRow, setNextRow] = useState(0);
  const {date}=useDate();

  //ticket Data
  const{ticket,
    setPropertyOnTicket,
    loadTicket,
    setPlacaNoTolvaNoTriturador,
    setFolioFisicoFolioDigitalFechaEntrada}=useTicket()
  const {materialsQty,
        addMaterialsQty,
        removeMaterialsQty,
        subtotal} =useMaterialQty(MateriasInTicket,setPropertyOnTicket)

  //Modals states 
  const [datePickerModalStartVisible, setDatePickerModalStartVisible] = useState(false)
  const [datePickerModalEndVisible, setDatePickerModalEndVisible] = useState(false)
  const [newMaterialVisible, setNewMaterialVisible] = useState(false)
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [signModalVisible, setSignModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [warningModalVisible, setWarningModalVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')


  //Navigation
  const navigation =useNavigation()

  const [placa, setPlaca] = useState<string | undefined>('')
  const [noTolva, setNoTolva] = useState<string |null| undefined>('')
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
 const resetAllValues=()=>{
  setPropertyOnTicket("empresaNombre",null)
  setPropertyOnTicket("empresaID",null);

 }
  useEffect(() => {
    console.log(JSON.stringify(authState))
    getLastRowTickets().then(
      (res)=>{
        setNextRow(res)
        setFolioFisicoFolioDigitalFechaEntrada(
          'FF-'+dateFormatedff()+'-'+res.toString(),
          authState.empresaID+'|'+authState.zoneID?.toString()+'|'+authState.userID!.toString()+'|'+res.toString(),
          today,
          res.toString(),
          authState.userID!,
          authState.zoneID!
        )
      }
    );
    const today= new Date()
    if (authState.ticket){
      loadTicket(authState.ticket);
      console.log('loading before ticket')
    }
  }, [])
  const today = new Date()
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView  style={localStyles.mainContainer}>
        
        <HeaderSearchTicket
          title={'Nuevo Vale'}
          
        />
        <TicketAssignDetail
          nextRow={nextRow}
          ticket={ticket}
          setPropertyOnTicket={setPropertyOnTicket}
          placa={placa}
          setPlaca={setPlaca}
          noTolva={noTolva}
          setNoTolva={setNoTolva}
          FolioFisico={ticket.folioFisico}
          setPlacaNoTolvaNoTriturador={setPlacaNoTolvaNoTriturador}
        />
          <View>
            <View style={localStyles.headerMaterialsToDispatch}>
                
                <TouchableOpacity 
                      style={localStyles.AddMaterialBtntStyle}
                      onPress={()=>
                        {
                          setNewMaterialVisible(true)
                        }
                      }>
                      <Icon style={{marginTop:3}} name="add-outline" size={windowWidth*0.075} color="#fff" />
                      <CustomText style={{color:'#fff'}} >Material</CustomText>
                </TouchableOpacity>
                <AddMaterialToTicketModal 
                    visible={newMaterialVisible} 
                    setIsVisible={setNewMaterialVisible} 
                    addMaterialsQty={addMaterialsQty} 
                    materialsQty={materialsQty}
                    lengthData={materialsQty.length} />
            </View>
            <View style={localStyles.flatListContainer}> 
        
              <FlatList
                    data={materialsQty}
                    ListHeaderComponent={<View style={{justifyContent:'center', alignItems:'center'}}>
                      <CustomText  style={{fontSize:20,fontWeight:'200'}}>Materiales en la unidad:</CustomText>
                      </View>}
                    ListFooterComponent={<View><CustomText>Total: {materialsQty.length}</CustomText></View>}
                    keyExtractor={(item) => item.ID.toString()}
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
                  defaultValue={ticket.Importe?.toString()}
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
                  disabled={true}
                  onPress={()=>{setDatePickerModalStartVisible(true)}}>
                  <Icon style={{marginRight:10}} name="time-outline" size={windowWidth*0.055} color="#000" />
                  <CustomText>
                    {(ticket.fechaEntradaVehiculo && ticket.fechaEntradaVehiculo.toString().length==19)?
                    ticket.fechaEntradaVehiculo 
                    :(ticket.fechaEntradaVehiculo)?
                    dateFormated(ticket.fechaEntradaVehiculo).substring(0,dateFormated(ticket.fechaEntradaVehiculo).length-3)
                    :'Selecciona'}</CustomText>
                </TouchableOpacity>
              </View>              
              <View style={localStyles.PayInfoRow}>
                <CustomText> Nombre de despachador: </CustomText>
                <View>
                  <CustomText> {authState.userName} </CustomText>
                </View>
              </View>
              <View style={localStyles.PayInfoRow}>
                      <TextInput style={localStyles.textInpuComments}
                        multiline={true}
                        value={ticket.observaciones}
                        placeholder=  {'Observaciones'}
                        placeholderTextColor='rgba(0,0,0,0.5)'
                        onChangeText={(text)=>{setPropertyOnTicket("observaciones",text)}}
                        >
                        </TextInput>
              </View>
              <View style={localStyles.BtnPayRow}>
              <TouchableOpacity 
                      style={localStyles.btnSave}
                      onPress={()=>{
                      let alertMessageAux=''

                        //setSaveModalVisible(true)
                      if((ticket.folioFisico.length<1)
                        ||(!ticket.empresaID)
                        ||(!ticket.clienteID)
                        ||(!ticket.destinoID)
                        ||(!ticket.vehiculoID)
                        ||(materialsQty.length<1)

                        ){
                          if(ticket.folioFisico.length<1){alertMessageAux=alertMessageAux+'\n'+'- Agregar Folio Físico'}
                          if(!ticket.empresaID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Empresa'}
                          if(!ticket.clienteID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Cliente'}
                          if(!ticket.destinoID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Destino'}
                          if(!ticket.vehiculoID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Vehículo'}
                          if(materialsQty.length<1){alertMessageAux=alertMessageAux+'\n'+'- Agregar Material'}

                          setAlertMessage(alertMessageAux)
                          setWarningModalVisible(true);
                      }
                      else{
                        SaveTicketsToLocalDB(ticket!,materialsQty).then(
                          (res)=>{
                             if (res>0){
                                                    setSuccessModalVisible(true); 
                                                    setTimeout(() => { 
                                                        setSuccessModalVisible(false);
                                                        navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))

                                                    }, 2000);
                                                    
                                                }
                          }
                        )
                      }

                        

                        }}>
                      <Icon style={{marginTop:3, paddingRight:10}} name="save-outline" size={windowWidth*0.07} color="#fff" />
                      <CustomText style={{color:'#fff'}} >Guardar</CustomText>
                </TouchableOpacity>
                <TouchableOpacity 
                      style={localStyles.btnSave}
                      onPress={()=>{setSignModalVisible(true)}}>
                      <Icon style={{marginTop:3,  paddingRight:10}} name="thumbs-up-outline" size={windowWidth*0.065} color="#fff" />
                      <CustomText style={{color:'#fff'}} >Guardar {'\n'}Firmar</CustomText>
                </TouchableOpacity>
              </View>
              <View/>
            </View> 
            <SaveTicketModal setIsVisible={setSaveModalVisible} visible={saveModalVisible} ticket={ticket} MaterialsInTicket={materialsQty}/>       
            <SignAndSaveModal 
                    ticket={ticket}
                    materialsQty={materialsQty}
                    setSuccessModalVisible={setSuccessModalVisible} 
                    setIsVisible={setSignModalVisible} 
                    visible={signModalVisible} 
                    setPropertyOnTicket={setPropertyOnTicket}/>
            <View>
              <DateTimePickerModal
                mode="time"
                isVisible={datePickerModalStartVisible}
                onConfirm={(datePicked)=>{
                  setPropertyOnTicket("fechaVale",datePicked)
                  setPropertyOnTicket("fechaEntradaVehiculo",datePicked)

                }}
                onCancel={()=>{setDatePickerModalStartVisible(false)}}
                onHide={()=>{setDatePickerModalStartVisible(false)}}
              />
            </View>
            <View>
              <DateTimePickerModal
                mode="time"
                isVisible={datePickerModalEndVisible}
                onConfirm={(datePicked)=>{
                  setPropertyOnTicket("fechaSalidaVehiculo",datePicked)
                }}
                onCancel={()=>{setDatePickerModalEndVisible(false)}}
                onHide={()=>{setDatePickerModalEndVisible(false)}}
              />
            </View>
          
            <ProcessSuccessModal
                visible={successModalVisible}
                setIsVisible={setSuccessModalVisible}
            />
            <WarningModal
            visible={warningModalVisible}
            setIsVisible={setWarningModalVisible}
            textToShow={alertMessage}
            />
    </ScrollView>
    </SafeAreaView>
    
  )
}

const localStyles = StyleSheet.create({ 
    mainContainer:{
      flex:1,
      backgroundColor:globalStyles.colors.white
    },
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
      width:windowWidth*0.35,
      height:windowHeight*0.065,
      //paddingHorizontal:25,
      //paddingVertical:10,
      borderRadius:4,
    },
    datePickerBtn:{
      flexDirection:'row',
      alignItems:'center',
      borderRadius:2,
      paddingVertical:6,
      paddingHorizontal:10, 
      //backgroundColor:globalStyles.colors.shadowBtn
    },
    AmountTextInput:{
      paddingHorizontal:35, 
      paddingVertical:4,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:8, 
      marginHorizontal:10,
      color:'#000',
    },
    textInpuComments:{
      width:windowWidth*0.85,
      height:windowHeight*0.13,
      paddingHorizontal:windowWidth*0.08, 
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:4, 
      color:'#000'}
});
