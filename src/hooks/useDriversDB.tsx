import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Chofer } from '../interfaces/chofer';

const db = connectToDatabase();

export const useDriversDB = () => {
 const [drivers,setDrivers] = useState<Chofer[]>(
     []
 )
 let tempArray :Chofer[]=[] ;

const getDrivers=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM choferes", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Chofer)
              }
              setDrivers(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
    
}

const getDriversWithVehicleID=async (vehicleID?:number)=>{
  let tempArray :Chofer[]=[] ;

  try {
let selectSentence="SELECT * FROM choferes WHERE estadoChofer=1 AND activoChofer=1 AND choferID=1"
if (vehicleID){
      selectSentence = " SELECT * FROM choferes WHERE estadoChofer=1 AND activoChofer=1 AND vehiculoID= "+vehicleID.toString() + " OR choferID=1";
}
     (await db).transaction((tx) => {
       tx.executeSql(selectSentence, []).then(
         ([tx,results]) => {
           for (let i = 0; i <results.rows.length; i++) {
             tempArray.push(results.rows.item(i) as Chofer)
           }
           setDrivers(tempArray);
 
         }
       );
     });
   } catch (error) {
     console.error(error)
     throw Error("Failed to get data from database")
   }
 
 
}


 useEffect(() => {
  getDriversWithVehicleID();
 }, [])
 
  return {
    drivers,
    getDrivers,
    getDriversWithVehicleID
  }
}
