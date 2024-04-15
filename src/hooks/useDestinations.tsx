import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Destino } from '../interfaces/destino';
import { number } from 'yup';

const db = connectToDatabase();

export const useDestinationsDB = () => {
 const [destinations,setDestinations] = useState<Destino[]>(
     []
 )
 let tempArray :Destino[]=[] ;

const getDestinations=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM destinos WHERE estadoDestino=1 AND activoDestino=1 OR destinoID=1", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Destino)
              }
              setDestinations(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
    
}

const getDestinationsWithClientID=async (clienteID?:number)=>{
  let tempArray :Destino[]=[] ;

  try {
let selectSentence="SELECT * FROM destinos WHERE destinoID=1"
if (clienteID){
      selectSentence = "SELECT * FROM destinos WHERE estadoDestino=1 AND activoDestino=1 AND clienteID = "+clienteID.toString() + " OR destinoID=1";
}
     (await db).transaction((tx) => {
       console.info(selectSentence)
       tx.executeSql(selectSentence, []).then(
         ([tx,results]) => {
           for (let i = 0; i <results.rows.length; i++) {
             tempArray.push(results.rows.item(i) as Destino)
           }
           setDestinations(tempArray);
 
         }
       );
     });
   } catch (error) {
     console.error(error)
     throw Error("Failed to get data from database")
   }
 
 
}


 useEffect(() => {
    //getDestinationsWithClientID();
 }, [])
 
  return {
    destinations,
    //getDestinations,
    getDestinationsWithClientID
  }
}
