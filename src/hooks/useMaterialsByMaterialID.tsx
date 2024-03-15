import React, { useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Material } from '../interfaces/material';

const db = connectToDatabase();


export const useMaterialsByMaterialID = () => {

    const [materials, setMaterials] = useState<Material[]>([])
    let tempArray :Material[]=[] ;

    const getMaterialById=async (materialID:number)=>{
        try {
    
            await (await db).transaction((tx) => {
                tx.executeSql("SELECT * FROM materiales WHERE materialID=?", [materialID]).then(
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
        return{
            materials,
            getMaterialById
        }
}
