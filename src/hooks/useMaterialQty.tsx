import React, { useEffect, useState } from 'react'
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

export const useMaterialQty = (data:MaterialQty[],setPropertyOnTicket: (field: keyof Vale, value: any) => void) => {
  
  
const [materialsQty, setMaterialsQty] = useState<MaterialQty[]>(data)
const [subtotal, setSubtotal] = useState(0)
  useEffect(() => {
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
  }, [materialsQty])


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
    subtotal
  }
}
