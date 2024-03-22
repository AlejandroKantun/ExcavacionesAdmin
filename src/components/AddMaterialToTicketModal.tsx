import React, { useEffect, useState } from 'react'
import { Button, Modal, StyleSheet, View,Text, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../theme/appTheme';
import CustomText from './CustomText';
import { useMaterialsDB } from '../hooks/useMaterialsDB';
import { MaterialQty } from '../hooks/useMaterialQty';
import { HeaderTitle } from './HeaderTittle';
import { useMaterialsByMaterialID } from '../hooks/useMaterialsByMaterialID';
import { Material } from '../interfaces/material';
import { number } from 'yup';

const windowWidth = Dimensions.get('window').width;
const windowheight= Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    addMaterialsQty: (newMaterialQty: MaterialQty) => void,
    materialsQty: MaterialQty[],
    lengthData:number
}
let subtotal=0;


export const AddMaterialToTicketModal = ({visible,setIsVisible,addMaterialsQty,lengthData,materialsQty}:Props) => {
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState(0);
    const [materialName, setMaterialName] = useState('')
    const {materials}=useMaterialsDB()
    const [materialM3, setMaterialM3] = useState(0)
    const{materials:material,getMaterialById}=useMaterialsByMaterialID()
    const [importUpdated, setImportUpdated] = useState(false)
    const [newImport, setNewImport] = useState(0)
    useEffect(() => {
        if (material[0]){
        setNewImport(Number(material[0].importe))
        }
    }, [material])
    
    const onChangeItem=(item:Material)=>{
        setValue(item.materialID);
        setMaterialName(item.nombreMaterial);
        getMaterialById(item.materialID);
        setNewImport(Number(item.importe))
    }
  return (
    <Modal
            animationType='slide'
            visible={visible}
            transparent={true}
            >
            <View
                style={localStyles.modalView}
                >
                <View
                    style={localStyles.modalContainer}
                        >

                    <View style={localStyles.headerContainer}>
                        <HeaderTitle title={'Agregar Material'}/>

                    </View>

                    <View style={localStyles.materialsQuantityContainer}>

                    <Dropdown
                                style={[localStyles.dropdown, isFocus && { borderColor: 'blue' }]}
                                placeholderStyle={localStyles.placeholderStyle}
                                selectedTextStyle={localStyles.selectedTextStyle}
                                inputSearchStyle={localStyles.inputSearchStyle}
                                iconStyle={localStyles.iconStyle}
                                data={materials}
                                search
                                maxHeight={400}
                                labelField="nombreMaterial"
                                valueField="materialID"
                                placeholder={!isFocus ? 'Selec Material' : '...'}
                                searchPlaceholder="Buscar material"

                                onBlur={() => setIsFocus(false)}
                                renderItem={ (item) => 
                                    <View style={localStyles.renderItemContainer}>
                                        <CustomText style={{marginVertical:6, fontSize:18}}>
                                            {item.materialID} - {item.nombreMaterial}
                                            </CustomText>
                                    </View>
                                }
                                onChange={item => {

                                    onChangeItem(item)
                                    
                                }}
                                renderLeftIcon={() => (
                                    <Icon style={localStyles.renderLeftIcon} 
                                    name="hammer-outline" 
                                    size={30} 
                                    color="rgba(0,0,0,0.5)" />
                                )}
                                />
                    <TextInput 
                        style={localStyles.textInputTon}
                        keyboardType='numeric'
                        placeholder='Cantidad [M3]'
                        defaultValue={materialM3.toString()}
                        placeholderTextColor='rgba(0,0,0,0.6)'
                        
                        onChangeText={(Text)=>{
                            if (Number(Text)>0){
                                setMaterialM3(Number(Text))
                            }
                            else    {setMaterialM3(0)}
                            
                        }}
                        
                    />
                     </View>
                     {value==1?
                        <View>  
                            <TextInput style={localStyles.textInputDataMaterial}
                                placeholder=  {'Material'}  
                                placeholderTextColor='rgba(0,0,0,0.5)'
                                maxLength={30}
                                onChangeText={(text)=>{
                                    setMaterialName(text);
                                }}>
                            </TextInput>
                            </View>
                        :null
                    }
                    {material[0]?
                        <View>  
                            <TextInput style={localStyles.textInputDataMaterial}
                                placeholder=  {'Importe: '}  
                                maxLength={30}
                                placeholderTextColor='rgba(0,0,0,0.5)'
                                keyboardType='numeric'
                                defaultValue={newImport.toString()}
                                onChangeText={(text)=>{
                                    setImportUpdated(true)
                                    setNewImport(Number(text))
                                }}>
                            </TextInput>
                            </View>
                        :null
                    }
                   

                    <View >
                        <View style={[  
                                        localStyles.buttonsContainer,
                                        {marginTop:value==1?0:windowheight*0.05}
                                                    ]}>
                            <TouchableOpacity 
                            style={localStyles.btnCancel}
                            onPress={()=>{
                                setIsVisible(false)
                            }}>
                            <Icon style={{marginTop:3, paddingRight:10}} name="close-outline" size={30} color="#fff" />
                            <CustomText style={{color:'#fff'}} >Cancelar</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={localStyles.btnSave}
                            onPress={()=>{
                                //VALIDATION
                              
                                setIsVisible(false);
                                getMaterialById(-1); //to reset this variable
                                for(let i =0; i<materialsQty.length; i++){
                                    subtotal= subtotal+ (materialsQty[i].quantity*materialsQty[i].newImport)

                                }  
                                subtotal= subtotal+ (materialM3*newImport);
                                
                                addMaterialsQty({
                                    ID: lengthData+1,
                                    materialName: materialName,
                                    quantity:materialM3,
                                    materialID: value,
                                    importUpdated:importUpdated,
                                    newImport:newImport
                                     })
                            }}>
                            <Icon style={{marginTop:3, paddingRight:10}} name="add-circle-outline" size={30} color="#fff" />
                            <CustomText style={{color:'#fff'}} >Agregar</CustomText>
                        </TouchableOpacity>
                        </View>
                        
                        
                    </View>
                    
                </View>
                

            </View>
        </Modal>
  )
}

const localStyles = StyleSheet.create({
    modalView:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.3)',
        alignItems:'center',
        justifyContent:'center',
      
    },
    modalContainer:{
        backgroundColor:'white',
        height:windowheight*0.4,
        width:windowWidth*0.95,
        //justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity:0.25,
        elevation:10,
        
    },
    headerContainer:{
        flexDirection:'column',
        borderTopEndRadius:5,
        borderTopStartRadius:5,
        backgroundColor:globalStyles.colors.primary,
        width:windowWidth*0.95,
        height:windowheight*0.07,
        justifyContent:'center',
        alignItems:'center',
        marginBottom: windowheight*0.02
    }
    ,
    materialsQuantityContainer:{
        flexDirection:'row',
        marginHorizontal:windowWidth*0.28
    }
    ,
    dropdown: {
        margin: 16,
        height: 50,
        width:200,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      icon: {
        marginRight: 5,
      },
      placeholderStyle: {
        fontSize: 16,
        color:'#000'
      },
      selectedTextStyle: {
        fontSize: 16,
        color:'#000',
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 14,
        color:'#000'
      },
      renderLeftIcon:{
        marginTop:3, 
        marginRight:15, 
        justifyContent:'center', 
        alignItems:'center'},
    renderItemContainer:{
        marginHorizontal:windowWidth*0.05
    },    
    textInputTon:{
      paddingHorizontal:windowWidth*0.07, 
      marginVertical:20,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:2, 
      marginHorizontal:10,
      color:'#000',
      textAlign:'center',
      fontSize:16
    },
    buttonsContainer:{
        flexDirection:'row',
    },
    btnSave:{
        backgroundColor:globalStyles.mainButtonColor.color,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:windowWidth*0.06,
        paddingVertical:12,
        borderRadius:4,
        marginHorizontal:30,
  
      },
      btnCancel:{
        backgroundColor:globalStyles.colors.danger,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:windowWidth*0.06,
        paddingVertical:12,
        borderRadius:4,
        marginHorizontal:30,
      },
      textInputDataMaterial:{
        paddingHorizontal:windowWidth*0.1,
        width:windowWidth*0.85, 
        paddingVertical:windowheight*0.01,
        marginBottom:windowheight*0.01,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        marginHorizontal:10,
        color:'#000'},
});

