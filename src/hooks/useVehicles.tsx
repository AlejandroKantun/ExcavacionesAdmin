import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Vehiculo } from '../interfaces/vehiculo';
import { number } from 'yup';

const db = connectToDatabase();

export const useVehiclesDB = () => {
 const [vehicles,setVehicles] = useState<Vehiculo[]>(
     []
 )
 let tempArray :Vehiculo[]=[] ;

const getVehicles=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM vehiculos WHERE estadoVehiculo=1 AND activoVehiculo=1 OR vehiculoID=1", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Vehiculo)
              }
              setVehicles(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
    
}

const getVehiclesWithEmpresaID=async (empresaID?:number)=>{
  let tempArray :Vehiculo[]=[] ;

  try {
    let selectSentence="SELECT * FROM vehiculos WHERE estadoVehiculo=1 AND activoVehiculo=1 AND vehiculoID=1"
    if (empresaID){
          selectSentence = "SELECT * FROM vehiculos WHERE estadoVehiculo=1 AND activoVehiculo=1 AND empresaID = "+empresaID.toString() + " OR vehiculoID=1";
    }
     (await db).transaction((tx) => {
       tx.executeSql(selectSentence, []).then(
         ([tx,results]) => {
           for (let i = 0; i <results.rows.length; i++) {
             tempArray.push(results.rows.item(i) as Vehiculo)
           }
           setVehicles(tempArray);
 
         }
       );
     });
   } catch (error) {
     console.error(error)
     throw Error("Failed to get data from database")
   }
 
 
}

 useEffect(() => {
  getVehiclesWithEmpresaID();
 }, [])
 
  return {
    vehicles,
    getVehicles,
    getVehiclesWithEmpresaID
  }
}
