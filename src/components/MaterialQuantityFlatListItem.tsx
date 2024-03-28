import React from 'react'
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../theme/appTheme';
import { MaterialQty } from '../hooks/useMaterialQty';
import { Vale } from '../interfaces/vale';

const windowWidth = Dimensions.get('window').width;
const windowHeigth = Dimensions.get('window').height;

interface Props{
    material:MaterialQty,
    index:number,
    removeMaterialsQty: (index: number) => void,
    ticket?:Vale
}

export const MaterialQuantityFlatListItem = ({material,index,removeMaterialsQty,ticket}:Props) => {
  return (
    <View style={localStyles.mainContainer}>
        <View
            style={localStyles.materialDetailContainer}>
            <CustomText style={localStyles.dataText}>
                {material.materialName} 
            </CustomText> 
            <CustomText style={localStyles.subDataText}>
                {material.quantity} 
            </CustomText> 
            <CustomText style={localStyles.subDataText}>
                {material.newImport} [$]
            </CustomText> 
            <CustomText style={localStyles.subTotal}>
                {material.newImport*material.quantity}
            </CustomText> 
        </View>
       
            {   !ticket?.firma?
                <View style={{marginLeft:'auto'}}>
                <TouchableOpacity 
                    style={localStyles.btnDelete}
                    onPress={()=>{
                        removeMaterialsQty(index);
                    }}
                >
                        <Icon style={{marginTop:3}} name="remove-outline" size={windowHeigth*0.02} color="#fff" />
                </TouchableOpacity>
                </View>
                :null
            }
            
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
    materialDetailContainer:{
        flex:1,
        paddingHorizontal:10,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    dataText:{
        fontSize:windowHeigth*0.017,
        fontWeight:'400'
    },
    subDataText:{
        fontSize:windowHeigth*0.017,
        fontWeight:'400',
        
    },
    subTotal:{
        fontSize:windowHeigth*0.017,
        fontWeight:'600',
        
    },
    btnDelete:{
        backgroundColor:globalStyles.colors.danger,
        opacity:1,
        borderRadius:4,
        marginRight:10,
        width:windowHeigth*0.035,
        height:windowHeigth*0.035,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:0,
    }
});