import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Vale } from '../interfaces/Vale';
import { number } from 'yup';

const db = connectToDatabase();
interface KeyValueVale{
  field:keyof Vale,
  value:any
}
export const useTicket = (previousTicket?:Vale) => {
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

 const [ticket,setTicket] = useState<Vale>(previousTicket?previousTicket:ticketToStart)


const setPropertyOnTicket=(field:keyof Vale,value:any)=>{
    setTicket({
        ...ticket,
        [field]:value
    })
}

const setPlacaNoTolvaNoTriturador=(placa:string,numerotolva:string,vehiculoID:number,tipoUnidad:string)=>{
  setTicket({...ticket, 
            placa:placa,
            numeroTolva:numerotolva ,
            vehiculoID:vehiculoID,
            tipoUnidad:tipoUnidad
          })
}
const setFolioFisicoFolioDigitalFechaEntrada=(folioFisico:string,folioDigital:string,IncommingDate:Date,folio:string,creadoPor:number,bancoID:number)=>{
  setTicket({...ticket, 
            folioFisico:folioFisico,
            folioDigital:folioDigital ,
            fechaEntradaVehiculo:IncommingDate,
            folio:folio,
            creadoPor:creadoPor,
            bancoID:bancoID
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
