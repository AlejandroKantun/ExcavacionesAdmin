import React, { useEffect, useState } from 'react'
import { Button, Modal, StyleSheet, View,Text, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native'
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
import { WarningModal } from './WarningModal';

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
    const [warningModalVisible, setWarningModalVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
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
                    <View style={localStyles.interactiveElements}>
                    <View style={localStyles.materialsQuantityContainer}>
                        <View style={{ alignItems:'center'}}>
                            <CustomText style={localStyles.label}>Selecciona Material:</CustomText>
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
                                    placeholder={!isFocus ? ' Materiales' : '...'}
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
                                        size={windowWidth*0.055} 
                                        color="rgba(0,0,0,0.5)" />
                                    )}
                                    />
                        </View>
                        <View style={{flex:1, alignItems:'center'}}>
                            <CustomText style={localStyles.label}>Cantidad [m3]:</CustomText>
                            <TextInput 
                            style={localStyles.textInputTon}
                            keyboardType='numeric'
                            placeholderTextColor='rgba(0,0,0,0.6)'
                            placeholder='m3'
                            onChangeText={(Text)=>{
                                if (Number(Text)>0){
                                    setMaterialM3(Number(Text))
                                }
                                else    {setMaterialM3(0)}
                                
                            }}/>
                        </View>
                        
                        </View>
                        {value==1?
                            <View> 
                                <CustomText style={localStyles.label}>Material Nombre (Otro):</CustomText>
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
                                <CustomText style={localStyles.label}>Precio por metro cúbico:</CustomText>  
                                <TextInput style={localStyles.textInputDataMaterial}
                                    placeholder=  {'Importe: '}  
                                    maxLength={30}
                                    placeholderTextColor='rgba(0,0,0,0.5)'
                                    keyboardType='numeric'
                                    onChangeText={(text)=>{
                                        setImportUpdated(true)
                                        if(typeof(Number(text))=='number'){
                                            setNewImport(Number(text))
                                        }
                                        else{
                                            setNewImport(0)
                                        }
                                    }}>
                                </TextInput>
                                </View>
                            :null
                        }
                    </View>

                    
                   

                    <View >
                        <View style={[  
                                        localStyles.buttonsContainer,
                                        {paddingVertical:value==1?windowheight*0.02:windowheight*0.02
                                        ,marginBottom:windowheight*0.3
                                    }
                                                    ]}>
                            <TouchableOpacity 
                            style={localStyles.btnCancel}
                            onPress={()=>{
                                setMaterialM3(0);
                                setIsVisible(false);
                                setNewImport(0)
                            }}>
                            <Icon style={{marginTop:3, paddingRight:10}} name="close-outline" size={windowWidth*0.055} color="#fff" />
                            <CustomText style={{color:'#fff'}} >Cancelar</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={localStyles.btnSave}
                            onPress={()=>{
                                let alertMessageAux=''
                                //VALIDATION
                                if((value==1 && materialName.toString.length==0)||(materialM3<1)||(newImport<1)){
                                    if (value==1 && materialName.toString.length==0){alertMessageAux=alertMessageAux+'\n'+'- Nombre Material (Otro) es requerido'}
                                    if (materialM3==0){alertMessageAux=alertMessageAux+'\n'+'- Agregar cantidad'}
                                    if (newImport==0){alertMessageAux=alertMessageAux+'\n'+'- Agregar importe'}

                                    setAlertMessage(alertMessageAux)
                                    setWarningModalVisible(true);
                                }
                                else{
                                    setIsVisible(false);
                                    setMaterialM3(0);
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
                                }
                                
                            }}>
                            <Icon style={{marginTop:3, paddingRight:10}} name="add-circle-outline" size={windowWidth*0.055} color="#fff" />
                            <CustomText style={{color:'#fff'}} >Agregar</CustomText>
                        </TouchableOpacity>
                        </View>
                        
                        
                    </View>
                    
                </View>
                

            </View>
            <WarningModal
            visible={warningModalVisible}
            setIsVisible={setWarningModalVisible}
            textToShow={alertMessage}
            />
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
        height:windowheight*0.45,
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
    interactiveElements:{
        width:windowWidth*0.95,
        height:windowheight*0.25,
        justifyContent:'center',
        alignItems:'center'
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
        width:windowWidth*0.85, 
        alignItems:'center'
    }
    ,
    dropdown: {
        marginHorizontal: 16,
        height: 50,
        width:200,
        borderBottomColor: 'gray',
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
      height:windowheight*0.055,
      width:windowWidth*0.31,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:4, 
      color:'#000',
      textAlign:'center',
      fontSize:windowheight*0.017
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
        paddingVertical:windowheight*0.005,
        borderRadius:windowheight*0.004,
        marginHorizontal:windowWidth*0.07,
      },
      textInputDataMaterial:{
        paddingHorizontal:windowWidth*0.1,
        width:windowWidth*0.85, 
        height:windowheight*0.055,
        marginBottom:windowheight*0.01,
        borderColor:'#ccc',
        borderWidth:1,
        borderRadius:8, 
        color:'#000'},
        label:{
            fontSize:windowheight*0.017,
            marginBottom:windowheight*0.003,
        }
});

