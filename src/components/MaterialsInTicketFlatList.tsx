import React from 'react'
import { FlatList, View } from 'react-native'
import { MaterialQty } from '../hooks/useMaterialQty';
import { MaterialQuantityFlatListItem } from './MaterialQuantityFlatListItem';

interface Props{
    data: ArrayLike<MaterialQty> | null | undefined,
    removeMaterialsQty: (index: number) => void
}
export const MaterialsInTicketFlatList = ({data,removeMaterialsQty}:Props) => {
  return (
    <View>
        <FlatList
                    data={data}
                    renderItem={({item,index})=> 
                    <MaterialQuantityFlatListItem 
                        material={item} 
                        index={index} 
                        removeMaterialsQty={()=>removeMaterialsQty(index)}/>
                    }
              ></FlatList>
    </View>
  )
}
