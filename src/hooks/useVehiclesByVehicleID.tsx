import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Vehiculo } from '../interfaces/vehiculo';

const db = connectToDatabase();

export const useVehiclesByVehicleID = () => {
 const [vehicles,setVehicles] = useState<Vehiculo[]>(
     []
 )
 let tempArray :Vehiculo[]=[] ;

const getVehicles=async (vehicleId:number)=>{
     try {
   
        await(await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM vehiculos where vehiculoID=?", [vehicleId]).then(
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

 
  return {
    vehicles,
    getVehicles
  }
}
