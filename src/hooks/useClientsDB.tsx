import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Cliente } from '../interfaces/cliente';
import { number } from 'yup';

const db = connectToDatabase();

export const useClientsDB = () => {
 const [clients, setClients] = useState<Cliente[]>(
     []
 )
 let tempArray :Cliente[]=[] ;

const getClients=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM clientes WHERE estadoCliente=1 AND activoCliente=1 OR clienteID=1", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Cliente)
              }
              setClients(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
    
}

const getClientsWithEmpresaID=async (empresaID?:number)=>{
  let tempArray :Cliente[]=[] ;

  try {
    let selectSentence="SELECT * FROM clientes WHERE estadoCliente=1 AND activoCliente=1 AND clienteID=1"
    if (empresaID){
          selectSentence = "SELECT * FROM clientes WHERE estadoCliente=1 AND activoCliente=1 AND empresaID = "+empresaID.toString() + " OR clienteID=1";
    }

     (await db).transaction((tx) => {
       tx.executeSql(selectSentence, []).then(
         ([tx,results]) => {
           for (let i = 0; i <results.rows.length; i++) {
             tempArray.push(results.rows.item(i) as Cliente)
           }
           setClients(tempArray);
 
         }
       );
     });
   } catch (error) {
     console.error(error)
     throw Error("Failed to get data from database")
   }
 
 
}
 useEffect(() => {
    //getClients();
    getClientsWithEmpresaID();
 }, [])
 
  return {
    clients,
    getClients,
    getClientsWithEmpresaID
  }
}
