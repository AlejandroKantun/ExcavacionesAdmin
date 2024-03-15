import React, { useState } from 'react'
export interface MaterialQty{
    ID:number,
    materialName:string,
    quantity:number,
    materialID:number,
    importUpdated:boolean,
    newImport:number
  }

export const useMaterialQty = (data:MaterialQty[]) => {
  const [materialsQty, setMaterialsQty] = useState<MaterialQty[]>(data)
  
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
  }
}
