import React, { useContext, useEffect, useState } from 'react'
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
import { dateFormated, dateFormatedff } from '../data/dateFormated';
import { StackActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getLastRowTickets } from '../data/getLastRowTickets';
import { useVehiclesByVehicleID } from '../hooks/useVehiclesByVehicleID';



const MateriasInTicket:MaterialQty[] = [];

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const NewTicketScreen = () => {
  const {authState,logOut} = useContext(AuthContext)
  const [nextRow, setNextRow] = useState(0);
  const [newMaterialVisible, setNewMaterialVisible] = useState(false)
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [signModalVisible, setSignModalVisible] = useState(false)
  const [datePickerModalStartVisible, setDatePickerModalStartVisible] = useState(false)
  const [datePickerModalEndVisible, setDatePickerModalEndVisible] = useState(false)
  const {date}=useDate();
  const {materialsQty,addMaterialsQty,removeMaterialsQty} =useMaterialQty(MateriasInTicket)
  const navigation =useNavigation()
  const{companies}=useCompaniesDB()
  const{vehicles}=useVehiclesDB()
  const{clients}=useClientsDB()
  const{destinations}=useDestinationsDB()
  const{ticket,setPropertyOnTicket}=useTicket()
  const{vehicles:vehiclesById,getVehicles}=useVehiclesByVehicleID()
  const [placa, setPlaca] = useState('')
  const [noTolva, setNoTolva] = useState('')
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
  const logOutHandler=()=>{
    navigation.dispatch(StackActions.replace('SplashScreen'))
    logOut();
  }
  useEffect(() => {
    getLastRowTickets().then(
      (res)=>{
        setNextRow(res)
        setPropertyOnTicket("folioDigital",authState.zoneID?.toString()+'-'+authState?.userID?.toString()+'-'+res)
        setPropertyOnTicket("folioFisico",dateFormatedff()+'-'+res.toString())
        setPropertyOnTicket("fechaEntradaVehiculo",today)

      }
    );
    const today= new Date()
  }, [])
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView  style={localStyles.mainContainer}>
        
        <View style={localStyles.headerContainer}>
        <View style={{
          flexDirection:'row',
          justifyContent:'flex-end',
        
          }}>
             <TouchableOpacity 
                  style={localStyles.SearchTicketButton}
                  onPress={()=>{
                    navigation.navigate('SearchTicketScreen' as never)
                  }}>
                  <Icon style={{marginRight:10}} name="search-outline" size={30} color="#fff" />
                  <CustomText style={{color:'#fff'}}>Buscar</CustomText>
                </TouchableOpacity>
          <View style={localStyles.HeaderTitleText}>
          <CustomText style={localStyles.headerText} >
                        Nuevo Vale 
          </CustomText>
        </View>
        <TouchableOpacity 
                  style={localStyles.logOutButton}
                  onPress={()=>{
                    logOutHandler()
                  }}>
                  <Icon style={{marginRight:10}} name="log-out-outline" size={30} color="#fff" />
                  <CustomText style={{color:'#fff'}}>Salir</CustomText>
                </TouchableOpacity>
        </View>
        
          
        </View>
        <View style={localStyles.companyClientContainer}>
          <View style={localStyles.dateFolioNumberView}>
            <View style={{flexDirection:'row', marginHorizontal:10}}>
                <CustomText style={{textAlign:'center', fontSize:18}} >
                      NoTicket:{'   '} 
                </CustomText>
                <CustomText style={{textAlign:'center', fontWeight:'bold',fontSize:16}} >
                    {authState.zoneID}-{authState.userID}-{nextRow}
                </CustomText>
            </View>
            <View style={localStyles.folioFisicoContainer}>
                <View style={localStyles.companyClientItemContainer}> 
                <CustomText  >   Folio Fisico:</CustomText>
                <TextInput style={localStyles.textInputFolioFisico}
                maxLength={15}
                multiline={true}
                value={ticket.folioFisico}
                placeholder=  {'aa-mm-dd-#'}
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
          <AssignRowTo label='Unidad' assignTo='unidad' data={vehicles} setPropertyOnTicket={setPropertyOnTicket} getVehicles={getVehicles}/>
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
                onChangeText={(text)=>{
                                        setPropertyOnTicket("placa",text)
                                        setPlaca(text);
                                      }}
                editable={vehiclesById[0]?.placa?false:true}
                value={vehiclesById[0]?.placa?vehiclesById[0]?.placa:placa}
                >
              </TextInput>
            </View>
            <View style={{flex:1, flexDirection:'row',alignItems:'center'}}>
              <CustomText  >No Tolva:</CustomText>
              <TextInput style={localStyles.textInputTolva}
                placeholder=  {'S / N'}
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{
                    setNoTolva(text);
                }}
                editable={vehiclesById[0]?.numeroTolva?false:true}
                value={vehiclesById[0]?.numeroTolva?vehiclesById[0]?.numeroTolva:noTolva}
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
                  onPress={()=>{setDatePickerModalStartVisible(true)}}>
                  <Icon style={{marginRight:10}} name="time-outline" size={30} color="#000" />
                  <CustomText>
                    {ticket.fechaEntradaVehiculo?
                    dateFormated(ticket.fechaEntradaVehiculo).substring(0,dateFormated(ticket.fechaEntradaVehiculo).length-3)
                    :'Selecciona'}</CustomText>
                </TouchableOpacity>
              </View>
              <View style={localStyles.PayInfoRow}>
                <CustomText> Hora de salida:{'    '} </CustomText>
                <TouchableOpacity 
                  style={localStyles.datePickerBtn}
                  onPress={()=>{setDatePickerModalEndVisible(true)}}>
                  <Icon style={{marginRight:10}} name="time-outline" size={30} color="#000" />
                  <CustomText> 
                      {ticket.fechaSalidaVehiculo?
                        dateFormated(ticket.fechaSalidaVehiculo).substring(0,dateFormated(ticket.fechaSalidaVehiculo).length-3)
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
                        value={ticket.folioFisico}
                        placeholder=  {'Comentarios'}
                        placeholderTextColor='rgba(0,0,0,0.5)'
                        onChangeText={(text)=>{setPropertyOnTicket("folioFisico",text)}}
                        >
                        </TextInput>
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
      flex:1,
      paddingTop:20,
      paddingBottom:10,
      backgroundColor:globalStyles.colors.primary,
      flexDirection:'row',
      justifyContent:'space-around',
    },
    HeaderTitleText:{
      justifyContent:'center', 
      alignItems:'center'},
    headerText:{
        fontSize:25,
        marginHorizontal:windowWidth*0.08,
        color:globalStyles.colors.white
      },
    SearchTicketButton:{
      flex:0,
      flexDirection:'row',
      //justifyContent:'flex-end',
      alignItems:'center',
      alignSelf:'baseline',
      borderRadius:2,
      paddingVertical:6,
      //marginRight:50, 
      paddingHorizontal:windowWidth*0.03,
      backgroundColor:globalStyles.colors.primary
    },logOutButton:{
      flex:0,
      flexDirection:'row',
      //justifyContent:'flex-end',
      alignItems:'center',
      alignSelf:'baseline',
      borderRadius:2,
      paddingVertical:6,
      //marginRight:3, 
      paddingHorizontal:windowWidth*0.04, 
      backgroundColor:globalStyles.colors.primary
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
      alignItems:'center', 
      paddingVertical:4,
      }
    ,folioFisicoContainer:{
      flexDirection:'row', 
      flex:1},
    textInputFolioFisico:{
        paddingHorizontal:windowWidth*0.03, 
        flex:1,
        paddingVertical:4,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        marginHorizontal:5,
        color:'#000'},
    companyClientItemContainer:{
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
      paddingVertical:3,
    },
    textInputDataHeader:{
      paddingHorizontal:windowWidth*0.05, 
      paddingVertical:4,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:8, 
      marginHorizontal:5,
      color:'#000'},
    textInputTolva:{
        paddingHorizontal:windowWidth*0.08, 
        paddingVertical:4,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        marginHorizontal:5,
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