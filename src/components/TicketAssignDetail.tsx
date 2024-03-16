import React, { useContext } from 'react'
import { Dimensions, StyleSheet, TextInput, View } from 'react-native'
import CustomText from './CustomText';
import { AssignRowTo } from '../components/AssignRowTo';
import globalStyles from '../theme/appTheme';
import { AuthContext } from '../context/AuthContext';
import { Vale } from '../interfaces/vale';
import { useCompaniesDB } from '../hooks/useCompaniesDB';
import { useVehiclesDB } from '../hooks/useVehicles';
import { useClientsDB } from '../hooks/useClientsDB';
import { useDestinationsDB } from '../hooks/useDestinations';
import { useVehiclesByVehicleID } from '../hooks/useVehiclesByVehicleID';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props{
    nextRow: number,
    ticket: Vale,
    setPropertyOnTicket: (field: keyof Vale, value: any) => void,
    placa: string,
    setPlaca: React.Dispatch<React.SetStateAction<string>>,
    noTolva:string,
    setNoTolva: React.Dispatch<React.SetStateAction<string>>,

}
export const TicketAssignDetail = ({
                                    nextRow,
                                    ticket,
                                    setPropertyOnTicket,
                                    placa,
                                    setPlaca,
                                    noTolva,
                                    setNoTolva}:Props) => {
    const {authState} = useContext(AuthContext)
    const{companies}=useCompaniesDB()
    const{vehicles}=useVehiclesDB()
    const{clients}=useClientsDB()
    const{destinations}=useDestinationsDB()
    const{vehicles:vehiclesById,getVehicles}=useVehiclesByVehicleID()

  return (
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
          <AssignRowTo label='Unidad' assignTo='unidad' data={vehicles} setPropertyOnTicket={setPropertyOnTicket} getVehicles={getVehicles} vehicleById={vehiclesById}/>
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
          <View style={localStyles.vehicleDetailMainRow}> 
           
            <View style={localStyles.columnVehicleContainer}>
            <CustomText  >Placas :</CustomText>
              <TextInput style={localStyles.textInputPlacaTolvaTriturador}
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
            <View style={localStyles.columnVehicleContainer}>
              <CustomText  >No Tolva:</CustomText>
              <TextInput style={localStyles.textInputPlacaTolvaTriturador}
                placeholder=  {'S / N'}
                placeholderTextColor='rgba(0,0,0,0.5)'
                defaultValue={vehiclesById[0]?.numeroTolva?vehiclesById[0]?.placa:noTolva}
                maxLength={20}
                onChangeText={(text)=>{
                }}
                >
              </TextInput>
            </View>
            <View style={localStyles.columnVehicleContainer}>
              <CustomText  >No Triturador:</CustomText>
              <TextInput style={localStyles.textInputPlacaTolvaTriturador}
                placeholder=  {'S / N'}
                placeholderTextColor='rgba(0,0,0,0.5)'
                maxLength={20}  
                defaultValue={ticket.placa?ticket.placa:''}
                onChangeText={(text)=>{
                }}
                >
              </TextInput>
            </View>
          </View>
          <View style={localStyles.companyClientItemContainer}> 
            
          </View>
        </View>
  )
}

const localStyles = StyleSheet.create({
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
        },
    folioFisicoContainer:{
        flexDirection:'row', 
        flex:1},
    companyClientItemContainer:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingVertical:3,
        },
    textInputFolioFisico:{
        paddingHorizontal:windowWidth*0.03, 
        flex:1,
        paddingVertical:4,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        marginHorizontal:5,
        color:'#000'},
    textInputDataHeader:{
        paddingHorizontal:windowWidth*0.05, 
        paddingVertical:4,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        marginHorizontal:5,
        color:'#000'},
    textInputPlacaTolvaTriturador:{
        width:windowWidth*0.29, 
        paddingVertical:4,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        marginHorizontal:5,
        color:'#000'},
    vehicleDetailMainRow:{
      paddingHorizontal:windowWidth*0.01,
        flex:1, 
        flexDirection:'row',
        alignItems:'center',
      },
    columnVehicleContainer:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        marginVertical:windowHeight*0.01,

      },
});