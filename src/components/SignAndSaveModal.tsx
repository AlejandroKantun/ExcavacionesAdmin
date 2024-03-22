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


const windowWidth = Dimensions.get('window').width;
const windowHeigth = Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setPropertyOnTicket: (field: keyof Vale, value: any) => void,
    setSuccessModalVisible: (value: React.SetStateAction<boolean>) => void,
    ticket: Vale,
    materialsQty: MaterialQty[]
}


  export const SignAndSaveModal = ({visible,setIsVisible,setPropertyOnTicket,setSuccessModalVisible,ticket,materialsQty}:Props) => {
    const [paths, setPaths] = useState<SkPath[]>([]);
    const canvasRef = useCanvasRef();
    const navigation =useNavigation()

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
      const signImage = canvasRef.current?.makeImageSnapshot()
      if (signImage) {
        var Buffer = require('buffer/').Buffer;
       
       
        
        const image64=signImage.encodeToBase64();
        //console.log(image64)
        const byteCharacters = atob(image64)
        setPropertyOnTicket("firma", byteCharacters);
        setIsVisible(false);
        setPaths([])
        console.log(byteCharacters)
        SaveTicketsToLocalDB(ticket!,materialsQty).then(
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
    return (

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
                    
    
            
        </Modal>
      
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