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

 useEffect(() => {
    getDrivers();
 }, [])
 
  return {
    drivers,
    getDrivers
  }
}
