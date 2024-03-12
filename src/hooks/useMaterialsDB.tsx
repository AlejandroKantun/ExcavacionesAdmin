
import {useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Material } from '../interfaces/material'

const db = connectToDatabase();
export const useMaterialsDB = () => {
 const [materials, setMaterials] = useState<Material[]>(
     []
 )
 let tempArray :Material[]=[] ;

const getMaterials=async ()=>{
     try {
   
        (await db).transaction((tx) => {
          tx.executeSql("SELECT * FROM materiales", []).then(
            ([tx,results]) => {
              for (let i = 0; i <results.rows.length; i++) {
                tempArray.push(results.rows.item(i) as Material)
              }
              console.log(JSON.stringify(tempArray))

              setMaterials(tempArray);
    
            }
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    
    
}

 useEffect(() => {
    getMaterials();
 }, [])
 
  return {
      materials,
      getMaterials
  }
}
