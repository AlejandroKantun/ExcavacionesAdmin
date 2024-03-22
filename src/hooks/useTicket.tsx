import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Vale } from '../interfaces/Vale';
import { number } from 'yup';

const db = connectToDatabase();
interface KeyValueVale{
  field:keyof Vale,
  value:any
}
export const useTicket = () => {
  let ticketToStart:Vale={
    vehiculoNombre:'',
    destinoNombre : '',
    empresaID :                   0,
    destinoID :                   0,
    clienteID :                   0,
    fechaEntradaVehiculo :        null,
    estadoVale :                  0,
    activoVale :                  0,
    fechaEliminacion :            null,
    fechaSincronizacion :         null,
    fechaUltimaModificacion :     null,
    fechaSalidaVehiculo :         null,
    fechaVale :                   null,
    firma :                       null,
    numeroEconomico :             '',
    tipoUnidad :                  '',
    creadoPor :                   0,
    fechaCreacion :               null,
    EnviadoABaseDeDatosCentral :  0,
    valeID :                      0,
    folio :                       '',
    folioFisico :                 '',
    clienteNombre :               null,
    serie :                       '',
    bancoID :                     0,
    numeroValeTriturador :        '',
    placa :                       '',
    choferNombre :                null,
    choferID :                    null,
    observaciones :               '',
    vehiculoID :                  0,
    folioDigital :                '',    
    Importe:                   null,
    formadepago:               null,
    empresaNombre:               ''     
  }

 const [ticket,setTicket] = useState<Vale>(ticketToStart)


const setPropertyOnTicket=(field:keyof Vale,value:any)=>{
    setTicket({
        ...ticket,
        [field]:value
    })
}

const setPlacaNoTolvaNoTriturador=(placa:string,numerotolva:string,vehiculoID:number)=>{
  setTicket({...ticket, 
            placa:placa,
            numeroTolva:numerotolva ,
            vehiculoID:vehiculoID
          })
}
const setFolioFisicoFolioDigitalFechaEntrada=(folioFisico:string,folioDigital:string,IncommingDate:Date)=>{
  setTicket({...ticket, 
            folioFisico:folioFisico,
            folioDigital:folioDigital ,
            fechaEntradaVehiculo:IncommingDate
          })
}

 const loadTicket=(ticketOutside:Vale)=>{
   setTicket(ticketOutside)
 }
  return {
    ticket,
    setPropertyOnTicket,
    loadTicket,
    setPlacaNoTolvaNoTriturador,
    setFolioFisicoFolioDigitalFechaEntrada
  }
}   
