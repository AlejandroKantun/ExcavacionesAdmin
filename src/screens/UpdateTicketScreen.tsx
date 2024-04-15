import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View, Dimensions, Alert, Image} from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTicket } from '../hooks/useTicket';
import { dateFormated } from '../data/dateFormated';
import { AuthContext } from '../context/AuthContext';
import { TicketAssignDetail } from '../components/TicketAssignDetail';
import { HeaderSearchTicket } from '../components/HeaderSearchTicket';
import { ProcessSuccessModal } from '../components/ProcessSuccessModal';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerParams } from '../navigation/MainDrawerNavigator';
import { UpdateTicketsOnDB } from '../data/UpdateTicketsOnDB';
import { AddChofer } from '../components/AddChofer';
import { useDriversDB } from '../hooks/useDriversDB';



const MateriasInTicket:MaterialQty[] = [];

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props extends DrawerScreenProps<RootDrawerParams,'UpdateTicketScreen'>{}

export const UpdateTicketScreen = ({route}:Props) => {
  const {authState} = useContext(AuthContext)
  const [nextRow, setNextRow] = useState(0);
  const {date}=useDate();
 
  
  //ticket Data
  const{ticket,
    setPropertyOnTicket,
    loadTicket,
    setPlacaNoTolvaNoTriturador
    }=useTicket(//authState.ticket
      )
    const{drivers,getDriversWithVehicleID}=useDriversDB()


  const {materialsQty,
        addMaterialsQty,
        removeMaterialsQty,
        getTicketsMaterialsFromDB} =useMaterialQty(MateriasInTicket,setPropertyOnTicket,authState.ticket?.valeID)

  //Modals states 
  const [datePickerModalStartVisible, setDatePickerModalStartVisible] = useState(false)
  const [datePickerModalEndVisible, setDatePickerModalEndVisible] = useState(false)
  const [newMaterialVisible, setNewMaterialVisible] = useState(false)
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [signModalVisible, setSignModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  //Navigation
  const navigation =useNavigation()

  const [placa, setPlaca] = useState(authState.ticket?.placa)
  const [noTolva, setNoTolva] = useState(authState.ticket?.numeroTolva)
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
 
  
  const today = new Date()
  

  useEffect(() => {
    if(authState.ticket){
        if(authState.ticket?.formadepago){setPaymentType(authState.ticket?.formadepago!)}
       loadTicket(authState.ticket!)
       getTicketsMaterialsFromDB();

       
    }
  }, [authState.ticket])
  
  return (
    <View style={{flex:1,backgroundColor:'rgba('+globalStyles.colors.primaryRGB + ',1)'}}> 
      <View style={{backgroundColor:globalStyles.colors.primary}}
      >
      </View>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView  style={localStyles.mainContainer}
                  automaticallyAdjustKeyboardInsets={true}
                  >
          
          <HeaderSearchTicket
            title={'Editar Vale'}
            
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
            getDriversWithVehicleID={getDriversWithVehicleID}

            
          />
            <View>
              <View style={localStyles.headerMaterialsToDispatch}>
                  {
                    !ticket.firma?
                    <TouchableOpacity 
                        style={localStyles.AddMaterialBtntStyle}
                        onPress={()=>
                          {
                            setNewMaterialVisible(true)
                          }
                        }>
                        <Icon style={{marginTop:3}} name="add-outline" size={windowWidth*0.075}color="#fff" />
                        <CustomText style={{color:'#fff'}} >Material</CustomText>
                  </TouchableOpacity>
                    :null
                  }
                  
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
                          ticket={ticket}
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
                    editable={ticket.firma?false:true}
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
                      ticket={ticket}
                      label='Efectivo '
                      value={paymentSelected.cash}
                      onValueChange={()=>{setPaymentType('cash')}}
                      
                  />
                  <CustomCheckBox
                      ticket={ticket}
                      label='Crédito'
                      value={paymentSelected.credit}
                      onValueChange={()=>{setPaymentType('credit')}}
                  />
                </View>
                <View style={{flexDirection:'row',flex:1,justifyContent:'center'}}>
                  <View style={localStyles.dateVehicleContainer}>
                  <CustomText> Hora de entrada:</CustomText>
                  <TouchableOpacity 
                    style={localStyles.datePickerBtn}
                    disabled={true}
                    onPress={()=>{setDatePickerModalStartVisible(true)}}>
                    <CustomText>
                      {(ticket.fechaEntradaVehiculo && ticket.fechaEntradaVehiculo.toString().length==19)?
                      ticket.fechaEntradaVehiculo 
                      :(ticket.fechaEntradaVehiculo)?
                      dateFormated(ticket.fechaEntradaVehiculo).substring(0,dateFormated(ticket.fechaEntradaVehiculo).length-3)
                      :'Selecciona'}</CustomText>
                  </TouchableOpacity>
                </View>
                {ticket.fechaSalidaVehiculo?
                  
                  <View style={localStyles.dateVehicleContainer}>
                  <CustomText > Hora de salida:{''} </CustomText>
                  <TouchableOpacity 
                    style={localStyles.datePickerBtn}
                    disabled={true}
                    >
                    <CustomText > 
                    {(ticket.fechaSalidaVehiculo && ticket.fechaSalidaVehiculo.toString().length==19)?
                    ticket.fechaSalidaVehiculo 
                    :(ticket.fechaSalidaVehiculo)?
                    dateFormated(ticket.fechaSalidaVehiculo).substring(0,dateFormated(ticket.fechaSalidaVehiculo).length-3)
                    :'Selecciona'}</CustomText>
                  </TouchableOpacity>
                </View>
                :null
                }
                </View>
                
                
                
                <View style={localStyles.PayInfoRow}>
                  <CustomText> Nombre de despachador: </CustomText>
                  <View>
                    <CustomText> {authState.userName} </CustomText>
                  </View>
                </View>
                <AddChofer
                data={drivers}
                label={'Chofer'}
                setPropertyOnTicket={setPropertyOnTicket}
                ticket={ticket}
                />
                <View style={localStyles.PayInfoRow}>
                        <TextInput style={localStyles.textInpuComments}
                          editable={ticket.firma?false:true}
                          multiline={true}
                          value={ticket.observaciones}
                          placeholder=  {'Observaciones'}
                          placeholderTextColor='rgba(0,0,0,0.5)'
                          onChangeText={(text)=>{setPropertyOnTicket("observaciones",text)}}
                          >
                          </TextInput>
                </View>
                {
                  !ticket.fechaSalidaVehiculo?
                  <View style={localStyles.BtnPayRow}>

                  <TouchableOpacity 
                          style={localStyles.btnSave}
                          onPress={()=>{
                            UpdateTicketsOnDB(ticket!,materialsQty).then(
                              (res)=>{
                                if (res>0){
                                                        setSuccessModalVisible(true); 
                                                        setTimeout(() => { 
                                                            setSuccessModalVisible(false);
                                                            navigation.navigate("SearchTicketScreen" as never)
                                                        }, 2000);
                                                        
                                                    }
                              }
                            )

                            }}>
                          <Icon style={{marginTop:3, paddingRight:10}} name="save-outline" size={30} color="#fff" />
                          <CustomText style={{color:'#fff'}} >Actualizar</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                          style={localStyles.btnSave}
                          onPress={()=>{setSignModalVisible(true)}}>
                          <Icon style={{marginTop:3,  paddingRight:10}} name="thumbs-up-outline" size={30} color="#fff" />
                          <CustomText style={{color:'#fff'}} >Guardar {'\n'}Firmar</CustomText>
                    </TouchableOpacity>
                  </View>
                  :null
                }
                                      
                <View/>
                {
                  ticket.firma?
                    <View 
                        style={localStyles.signContainer}>
                      <View style={localStyles.signImageContainer}>
                                    <Image  source={{uri: "data:image/png;base64,"+ticket.firma } }
                                                    style={localStyles.signImage}/>
                    </View>                  
                    <CustomText>Firma</CustomText>
                  </View>
                  :null
                }
                
                
              </View> 
              <SaveTicketModal setIsVisible={setSaveModalVisible} visible={saveModalVisible} ticket={ticket} MaterialsInTicket={materialsQty}/>       
              <SignAndSaveModal 
                      ticket={ticket}
                      materialsQty={materialsQty}
                      setSuccessModalVisible={setSuccessModalVisible} 
                      setIsVisible={setSignModalVisible} 
                      visible={signModalVisible} 
                      setPropertyOnTicket={setPropertyOnTicket}
                      isUpdateProcess={true}/>
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

      </ScrollView>
      </SafeAreaView>
      </View>

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
      color:'#000'},
      dateVehicleContainer:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        marginTop:windowHeight*0.02
      },
      signContainer:{justifyContent:'center',
        alignItems:'center',
        paddingTop:windowHeight*0.01},
      signImageContainer:{
        justifyContent:'center',
        alignSelf:'center',
        borderColor:'black',
        borderRadius:5,
        backgroundColor:globalStyles.colors.shadowBtn,
        height: windowHeight*0.25, 
        width: windowHeight*0.25,
        },
      signImage:{
          height: windowHeight*0.25, 
          width: windowHeight*0.25, 
          resizeMode:'contain'}
});
