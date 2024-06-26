import React, { useContext, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, TextInput, View } from 'react-native'
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
import { useFocusEffect } from '@react-navigation/core';
import { Destino } from '../interfaces/destino';
import { Empresa } from '../interfaces/empresa';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props{
    nextRow: number,
    ticket: Vale,
    setPropertyOnTicket: (field: keyof Vale, value: any) => void,
    placa: string | undefined,
    setPlaca: React.Dispatch<React.SetStateAction<string | undefined>>,
    noTolva:string | null | undefined,
    setNoTolva: React.Dispatch<React.SetStateAction<string | null | undefined>>,
    FolioFisico:string,
    getDriversWithVehicleID: (vehicleID?: number | undefined) => Promise<void>,
    setPlacaNoTolvaNoTriturador: (placa: string, numerotolva: string,vehiculoID:number,tipoUnidad:string, ticket?:Vale) => void,
}
export const TicketAssignDetail = ({
                                    ticket,
                                    setPropertyOnTicket,
                                    placa,
                                    setPlaca,
                                    noTolva,
                                    setPlacaNoTolvaNoTriturador,
                                    getDriversWithVehicleID
                                  }:Props) => {
    const {authState} = useContext(AuthContext)
    const{companies,getCompanies}=useCompaniesDB()
    const{vehicles,getVehiclesWithEmpresaID}=useVehiclesDB()
    const{clients,getClientsWithEmpresaID}=useClientsDB()
    const{destinations,getDestinationsWithClientID}=useDestinationsDB()
    const{vehicles:vehiclesById,getVehicles,}=useVehiclesByVehicleID()
  
   
    useFocusEffect(
      React.useCallback(() => {
        getCompanies().then(()=>{
         
        })
            
      }, [])

      
    );
    useEffect(() => {
      if (ticket.empresaID){getClientsWithEmpresaID(ticket.empresaID);
        getVehiclesWithEmpresaID(ticket.empresaID);}
    }, [companies])
    
    

    useEffect(() => {
          if (ticket.clienteID){getDestinationsWithClientID(ticket.clienteID)}

    }, [clients])

    useEffect(() => {
          if (ticket.vehiculoID){getDriversWithVehicleID(ticket.vehiculoID)}
    }, [vehicles])

    useEffect(() => {
      console.log(JSON.stringify(destinations.find((element:Destino)=>{ return element.destinoID===ticket.destinoID})))
      if (!destinations.find((element:Destino)=>{ return element.destinoID===ticket.destinoID})){
        getClientsWithEmpresaID(ticket.empresaID);

            }
            
    }, [destinations])
    
   
    
  return (
    <View style={localStyles.companyClientContainer}>
          <View style={localStyles.dateFolioNumberView}>
            <View style={localStyles.folioFisicoContainer}>
                <View style={localStyles.companyClientItemContainer}> 
                <CustomText  >   Folio Fisico:</CustomText>
                <TextInput style={localStyles.textInputFolioFisico}
                
                maxLength={15}
                multiline={true}
                defaultValue={ticket.folioFisico}
                //value={ticket.folioFisico}
                placeholder=  {'aa-mm-dd-#'}
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{setPropertyOnTicket("folioFisico",text)}}
                editable={ticket.firma?false:true}
                >
                </TextInput>
            </View>      
          </View>
          </View>
            <AssignRowTo 
                label='Asignado a' 
                assignTo='empresa' 
                data={companies} 
                setPropertyOnTicket={setPropertyOnTicket}
                getVehiclesWithEmpresaID={getVehiclesWithEmpresaID} 
                getClientsWithEmpresaID={getClientsWithEmpresaID}
                ticket={ticket} />
          {ticket.empresaID==1?
          <View>  
            <TextInput style={localStyles.textInputDataHeader}
                editable={ticket.firma?false:true}
                placeholder=  {'Nombre Empresa'}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                defaultValue={ticket.empresaNombre?ticket.empresaNombre:''}
                onChangeText={(text)=>{setPropertyOnTicket("empresaNombre",text)}}>
            </TextInput>
            </View>
          :null
          }
            <AssignRowTo 
              label='Cliente' 
              assignTo='cliente' 
              data={clients} 
              setPropertyOnTicket={setPropertyOnTicket}
              getDestinationsWithClientID={getDestinationsWithClientID} 
              ticket={ticket}/>
          {ticket.clienteID==1?
          <View>  
            <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {'Nombre Cliente'}  
                editable={ticket.firma?false:true}
                placeholderTextColor='rgba(0,0,0,0.5)'
                defaultValue={ticket.clienteNombre?ticket.clienteNombre:''}
                onChangeText={(text)=>{setPropertyOnTicket("clienteNombre",text)}}>
            </TextInput>
            </View>
          :null
          }
          <AssignRowTo label='Destino' assignTo='destino' data={destinations} setPropertyOnTicket={setPropertyOnTicket} ticket={ticket}/>
          {ticket.destinoID==1?
          <View>  
            <TextInput style={localStyles.textInputDataHeader}
                placeholder=  {'Nombre destino'}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                defaultValue={ticket.destinoNombre?ticket.destinoNombre:''}
                editable={ticket.firma?false:true}
                onChangeText={(text)=>{setPropertyOnTicket("destinoNombre",text)}}>
            </TextInput>
            </View>
          :null
          }
          <AssignRowTo                 
                      setPlacaNoTolvaNoTriturador={setPlacaNoTolvaNoTriturador}
                      label='Unidad' 
                      assignTo='unidad' 
                      data={vehicles} 
                      setPropertyOnTicket={setPropertyOnTicket} 
                      ticket={ticket}
                      getVehicles={getVehicles} 
                      getDriversWithVehicleID={getDriversWithVehicleID}/>
          {ticket.vehiculoID==1?
          <View>  
            <TextInput style={localStyles.textInputDataHeader}
                editable={ticket.firma?false:true}
                placeholder=  {'Nombre vehiculo'}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                defaultValue={ticket.vehiculoNombre?ticket.vehiculoNombre:''}
                onChangeText={(text)=>{setPropertyOnTicket("vehiculoNombre",text)}}>
            </TextInput>
            </View>
          :null
          }
          <View style={localStyles.vehicleDetailMainRow}> 
           
            <View style={localStyles.columnVehicleContainer}>
            <CustomText  >Placas :</CustomText>
              <TextInput style={localStyles.textInputPlacaTolvaTriturador}
                placeholder=  {'N/A'}  
                placeholderTextColor='rgba(0,0,0,0.5)'
                onChangeText={(text)=>{
                                        setPlaca(text);
                                        setPropertyOnTicket("placa",text)
                                      }}
                editable={
                          ticket.firma? false
                          :ticket.vehiculoID==1?true
                          :false}
                value={ticket.placa?ticket.placa:''}
                >
              </TextInput>
            </View>
            <View style={localStyles.columnVehicleContainer}>
              <CustomText  >No Tolva:</CustomText>
              <TextInput style={localStyles.textInputPlacaTolvaTriturador}
                placeholder=  {'S / N'}
                placeholderTextColor='rgba(0,0,0,0.5)'
                defaultValue={vehiclesById[0]?.numeroTolva?vehiclesById[0]?.numeroTolva.toString():noTolva?.toString()}
                value={ticket.placa?ticket.numeroTolva?.toString():''}
                editable={ticket.firma?false:true}
                maxLength={20}
                onChangeText={(text)=>{
                  setPropertyOnTicket("numeroTolva",text)

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
                editable={ticket.firma?false:true}
                defaultValue={ticket.placa?ticket.numeroValeTriturador:''}
                onChangeText={(text)=>{
                  setPropertyOnTicket("numeroValeTriturador",text)
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