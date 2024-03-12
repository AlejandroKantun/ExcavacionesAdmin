import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Vale } from '../interfaces/vale';

const db = connectToDatabase();

export const useTicket = () => {

 const [ticket,setTicket] = useState<Vale>({
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

                                                    
 })

const setPropertyOnTicket=(field:keyof Vale,value:any)=>{
    setTicket({
        ...ticket,
        [field]:value
    })
}

 
  return {
    ticket,
    setPropertyOnTicket
  }
}   
