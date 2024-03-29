import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Cliente } from '../interfaces/cliente';

const db = connectToDatabase();

export const useClientsDB = () => {
 const [clients, setClients] = useState<Cliente[]>(
     []
 )
 let tempArray :Cliente[]=[] ;

const getClients=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM clientes WHERE estadoCliente=1 AND activoCliente=1", []).then(
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
    getClients();
 }, [])
 
  return {
    clients,
    getClients
  }
}
