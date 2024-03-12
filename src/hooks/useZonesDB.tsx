import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Banco } from '../interfaces/banco';

const db = connectToDatabase();

export const useZonesDB = () => {
 const [zones, setZones] = useState<Banco[]>(
     []
 )
 let tempArray :Banco[]=[] ;

const getZones=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM bancos", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Banco)
              }
              setZones(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
    
}

 useEffect(() => {
    getZones();
 }, [])
 
  return {
    zones,
    getZones
  }
}
