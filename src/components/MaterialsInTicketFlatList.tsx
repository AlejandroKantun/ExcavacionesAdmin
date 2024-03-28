import React from 'react'
import { FlatList, View } from 'react-native'
import { MaterialQty } from '../hooks/useMaterialQty';
import { Vale } from '../interfaces/vale';
import { MaterialQuantityFlatListItem } from './MaterialQuantityFlatListItem';

interface Props{
    data: ArrayLike<MaterialQty> | null | undefined,
    removeMaterialsQty: (index: number) => void,
    ticket?:Vale
}
export const MaterialsInTicketFlatList = ({data,removeMaterialsQty,ticket}:Props) => {
  return (
    <View>
        <FlatList
                    data={data}
                    renderItem={({item,index})=> 
                    <MaterialQuantityFlatListItem
                        ticket={ticket}
                        material={item} 
                        index={index} 
                        removeMaterialsQty={()=>removeMaterialsQty(index)}/>
                    }
              ></FlatList>
    </View>
  )
}
