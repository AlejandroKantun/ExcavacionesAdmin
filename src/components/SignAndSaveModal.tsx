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
  

const windowWidth = Dimensions.get('window').width;
const windowHeigth = Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setIsVisibleSave?: React.Dispatch<React.SetStateAction<boolean>>,
    setPropertyOnTicket: (field: keyof Vale, value: any) => void
}


  export const SignAndSaveModal = ({visible,setIsVisible,setIsVisibleSave,setPropertyOnTicket}:Props) => {
    const [paths, setPaths] = useState<SkPath[]>([]);
    const canvasRef = useCanvasRef();
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
        setIsVisibleSave!(true);
        setPaths([])
        console.log(byteCharacters)

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