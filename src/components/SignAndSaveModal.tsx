import React, { useCallback, useState } from "react";
import { Alert, Dimensions, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import {
    Canvas,
    Path,
    SkPath,
    Skia,
    TouchInfo,
    useTouchHandler,
    useCanvasRef
  } from "@shopify/react-native-skia";
import globalStyles from "../theme/appTheme";
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import { Vale } from '../interfaces/Vale';
import { atob } from '../data/base64BLOBConverter';
import { useNavigation } from "@react-navigation/core";
import { StackActions } from '@react-navigation/native';
import { SaveTicketsToLocalDB } from '../data/SaveTicketsToLocalDB';
import { MaterialQty } from "../hooks/useMaterialQty";
import { UpdateTicketsOnDB } from '../data/UpdateTicketsOnDB';
import { WarningModal } from "./WarningModal";


const windowWidth = Dimensions.get('window').width;
const windowHeigth = Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setPropertyOnTicket: (field: keyof Vale, value: any) => void,
    setSuccessModalVisible: (value: React.SetStateAction<boolean>) => void,
    ticket: Vale,
    materialsQty: MaterialQty[],
    isUpdateProcess?:boolean,
}


  export const SignAndSaveModal = ({visible,setIsVisible,setSuccessModalVisible,ticket,materialsQty,isUpdateProcess}:Props) => {
    const [paths, setPaths] = useState<SkPath[]>([]);
    const canvasRef = useCanvasRef();
    const navigation =useNavigation()
    const [warningModalVisible, setWarningModalVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')


    const onDrawingStart = useCallback((touchInfo: TouchInfo) => {
      setPaths((old) => {
        const { x, y } = touchInfo;
        const newPath = Skia.Path.Make();
        newPath.moveTo(x, y);
        return [...old, newPath];
      });
    }, []);
  
    const onDrawingActive = useCallback((touchInfo: TouchInfo) => {
      setPaths((currentPaths) => {
        const { x, y } = touchInfo;
        const currentPath = currentPaths[currentPaths.length - 1];
        const lastPoint = currentPath.getLastPt();
        const xMid = (lastPoint.x + x) / 2;
        const yMid = (lastPoint.y + y) / 2;
  
        currentPath.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
        return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];

        
      });
    }, []);
  
    const touchHandler = useTouchHandler(
      {
        onActive: onDrawingActive,
        onStart: onDrawingStart,
      },
      [onDrawingActive, onDrawingStart]

      //setting sign whiledrawing      
    );
    const onSave=()=>{
      let alertMessageAux=''
      if((ticket.folioFisico.length<1)
          ||(!ticket.empresaID)
          ||(!ticket.clienteID)
          ||(!ticket.destinoID)
          ||(!ticket.vehiculoID)
          ||(!ticket.choferID)
          ||(materialsQty.length<1)
          ){
            if(ticket.folioFisico.length<1){alertMessageAux=alertMessageAux+'\n'+'- Agregar Folio Físico'}
            if(!ticket.empresaID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Empresa'}
            if(!ticket.clienteID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Cliente'}
            if(!ticket.destinoID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Destino'}
            if(!ticket.vehiculoID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Vehículo'}
            if(!ticket.choferID){alertMessageAux=alertMessageAux+'\n'+'- Agregar Chofer'}
            if(materialsQty.length<1){alertMessageAux=alertMessageAux+'\n'+'- Agregar Material'}

            setAlertMessage(alertMessageAux);
            setWarningModalVisible(true);

        }
      else {
        const signImage = canvasRef.current?.makeImageSnapshot()
        if (signImage) {
          var Buffer = require('buffer/').Buffer;
    
          const image64=signImage.encodeToBase64();
          console.log('image BASE 64')
          //console.log(image64)
          const byteCharacters = atob(image64)
          console.log('ATOB IMAGE')
          //console.log(byteCharacters)
          setIsVisible(false);
          setPaths([])
          console.log('isupdateprocess: ' + isUpdateProcess)

            if (isUpdateProcess==true)
            {
              console.log('UPDATE PROCESS')
              UpdateTicketsOnDB(ticket!,materialsQty,image64).then(
                (res)=>{
                  if (res>0){
                                          setSuccessModalVisible(true); 
                                          setTimeout(() => { 
                                              setSuccessModalVisible(false);
                                              navigation.navigate("SearchTicketScreen" as never)  
                                          }, 2000);
                                          
                                      }
                }
              )
            }
            else{
              SaveTicketsToLocalDB(ticket!,materialsQty,image64).then(
              (res)=>{
                if (res>0){
                                        setSuccessModalVisible(true); 
                                        setTimeout(() => { 
                                            setSuccessModalVisible(false);
                                            navigation.dispatch(StackActions.replace("MainDrawerNavigator" as never))
  
                                        }, 2000);
                                        
                                    }
              }
            )
            }   
         
        }
      }
      

}
    return (
        <View>
 <Modal
            animationType='slide'
            visible={visible}
            transparent={true}
            >
            <View
                style={localStyles.modalView}>
                <View
                    style={localStyles.modalContainer}
                    >
                    <CustomText style={{marginBottom:10, fontSize:22}}> Ingrese su firma </CustomText>
                    <View style={{alignItems:'flex-end'}}>
                      <TouchableOpacity 
                              style={{
                                width:windowWidth*0.25,
                                height:windowHeigth*0.03,
                                borderRadius:5,
                                paddingHorizontal:windowWidth*0.02,
                                flexDirection:'row',
                                backgroundColor:globalStyles.colors.shadowBtn,
                              }}
                              onPress={()=>{
                                setPaths([])

                              }}>
                              <Icon style={{marginTop:3, paddingRight:10}} name="trash-outline" size={15} color="#000" />
                              <CustomText style={{color:'#000'}} >Limpiar</CustomText>
                          </TouchableOpacity>
                      <Canvas 
                        style={localStyles.canvasContainer} 
                        ref={canvasRef}
                        onTouch={touchHandler}>
                            {paths.map((path, index) => (
                              <Path
                                key={index}
                                path={path}
                                color={"black"}
                                style={"stroke"}
                                strokeWidth={2}
                                
                              />
                            ))}
                          </Canvas>
                    </View>
                    

                      <View style={localStyles.buttonsContainer}>
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
                                onSave();
                              }}>
                              <Icon style={{marginTop:3, paddingRight:10}} name="save-outline" size={30} color="#fff" />
                              <CustomText style={{color:'#fff'}} >Guardar</CustomText>
                          </TouchableOpacity>
                      </View>
                    </View>
                      
              </View>
              <WarningModal
            visible={warningModalVisible}
            setIsVisible={setWarningModalVisible}
            textToShow={alertMessage}
            />
        </Modal>

        
        </View>
       
      
    );
  };
  
  
   
  
  const localStyles = StyleSheet.create({
    
    modalView:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.3)',
        alignItems:'center',
        justifyContent:'center',
      
    },
    modalContainer:{
        backgroundColor:'white',
        height:windowHeigth*0.5,
        width:windowWidth*0.95,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity:0.25,
        elevation:10,

    },
    canvasContainer: {
      height:windowHeigth*0.30,
        width:windowWidth*0.85,
        backgroundColor:globalStyles.colors.shadowBtn,

    },
    buttonsContainer:{
        flexDirection:'row',
        paddingTop:windowWidth*0.05
    },
    btnSave:{
        backgroundColor:globalStyles.mainButtonColor.color,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:15,
        paddingVertical:12,
        borderRadius:4,
        marginHorizontal:30,
  
      },
      btnCancel:{
        backgroundColor:globalStyles.colors.danger,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:15,
        paddingVertical:12,
        borderRadius:4,
        marginHorizontal:30,
  
      },
      
  });