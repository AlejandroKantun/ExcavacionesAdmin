import React from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../theme/appTheme';

interface MaterialQty{
    ID:number,
    materialName:string,
    quantity:number
}

interface Props{
    material:MaterialQty,
    index:number,
    removeMaterialsQty: (index: number) => void
}

export const MaterialQuantityFlatListItem = ({material,index,removeMaterialsQty}:Props) => {
  return (
    <View style={localStyles.mainContainer}>
        <CustomText style={localStyles.dataText}>
            {material.materialName} - {material.quantity} [m3]
        </CustomText> 
        <View style={{marginLeft:'auto'}}>
            <TouchableOpacity 
                style={localStyles.btnDelete}
                onPress={()=>{
                    removeMaterialsQty(index);
                }}
            >
                    <Icon style={{marginTop:3}} name="remove-outline" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
        
    </View>
  )
}

const localStyles = StyleSheet.create({
    mainContainer:{
        flex:1,
        flexDirection:'row',
        marginVertical:4,
        marginLeft:10
    },
    dataText:{
        fontSize:18
    },
    btnDelete:{
        backgroundColor:globalStyles.colors.danger,
        opacity:1,
        borderRadius:4,
        marginRight:10,
        width:30,
        height:30,
        alignItems:'center',
        justifyContent:'center'
    }
});