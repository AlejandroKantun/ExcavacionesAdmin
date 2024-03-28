import React, { useEffect, useState } from 'react'
import { connectToDatabase } from '../data/dbStructure';
import { Vale } from '../interfaces/vale'
export interface MaterialQty{
    ID:number,
    materialName:string,
    quantity:number,
    materialID:number,
    importUpdated:boolean,
    newImport:number
  }
  interface FieldsOnSetProperty{
    field: keyof Vale, value: any
  }

  const db = connectToDatabase();

export const useMaterialQty = (data:MaterialQty[],setPropertyOnTicket: (field: keyof Vale, value: any) => void, valeID?:number) => {
  const [materialsQty, setMaterialsQty] = useState<MaterialQty[]>(data)
  const [subtotal, setSubtotal] = useState(0) 
  
  const getTicketsMaterialsFromDB=async ()=>{
    let tempArray : MaterialQty[]=[];

    const selectSentenceQuery="SELECT" 
          //+" ROW_NUMBER() OVER (ORDER BY valesmateriales.costom3) as ID,"
          +" '1' as ID,"
          +" valesmateriales.materialID as materialID,"
          +" COALESCE (valesmateriales.materialNombre , materiales.nombreMaterial) as materialName ,"
          +" valesmateriales.cantidadm3 as quantity,"
          +" 'true' as importUpdated,"
          +" valesmateriales.costom3 as newImport"
          +" FROM valesmateriales "
          +" INNER JOIN materiales ON valesmateriales.materialID=materiales.materialID"
          +" WHERE valesmateriales.valeID =?"
          +" ORDER BY valesmateriales.valematerialID DESC";
      try {
   console.log(selectSentenceQuery)
        await (await db).transaction((tx) => {
          tx.executeSql(selectSentenceQuery
          , [valeID]).then(
            ([tx,results]) => {
                console.log('RESULTS: ' +JSON.stringify(results.rows.raw()))
                if (results.rows.length>0){
                    for (let i = 0; i <results.rows.length; i++) {
                        let materialAux:MaterialQty =results.rows.item(i) as MaterialQty
                        tempArray.push({
                          ID:i,
                          importUpdated:materialAux.importUpdated,
                          materialID:materialAux.materialID,
                          materialName:materialAux.materialName,
                          newImport:materialAux.newImport,
                          quantity:materialAux.quantity,
                        })
                    }
                    setMaterialsQty(tempArray);
                    }
                else{setMaterialsQty([])}
                }
                
          );
        });
      } catch (error) {
        console.error(error)
        throw Error("Failed to get data from database")
      }
    }
  


  useEffect(() => {
    if(materialsQty){
      if (materialsQty.length>0){
        let sub=0;
        for (let i =0; i<materialsQty.length ; i++){
          sub=sub + (materialsQty[i].newImport * materialsQty[i].quantity)
        }
        setSubtotal(sub);
        setPropertyOnTicket("Importe",sub);
      }else
      {
       setPropertyOnTicket("Importe",0);
 
      }
    }
     
  }, [materialsQty])

  useEffect(() => {
    // Setting first time an element
    if(valeID){
       getTicketsMaterialsFromDB();
    }
    else{}

    
  }, [])
  

  const addMaterialsQty=(newMaterialQty:MaterialQty)=>{
    setMaterialsQty([...materialsQty , newMaterialQty])
  }
  const removeMaterialsQty=(index:number)=>{
    setMaterialsQty(materialsQty.filter((element=>element!=materialsQty[index])))    ;
}
  return {
    materialsQty,
    addMaterialsQty,
    removeMaterialsQty,
    subtotal,
    getTicketsMaterialsFromDB
  }
}
