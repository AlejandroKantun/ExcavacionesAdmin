import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, FlatList, SafeAreaView, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../theme/appTheme';
import { MaterialQty } from '../hooks/useMaterialQty';
import CustomText from '../components/CustomText';
import { useNavigation } from '@react-navigation/core';
import { openDatabase } from 'react-native-sqlite-storage';
import { TicketToLoadItem } from '../components/TicketToLoadItem';
import { TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { dateFormatedDateFiltered } from '../data/dateFormated';
import { useTicketsWithFilter } from '../hooks/useTicketsWithFilter';
import { ItemSeparatorTickets } from '../components/ItemSeparatorTickets';
import { HeaderSearchTicket } from '../components/HeaderSearchTicket';

var db = openDatabase({
    name: 'UserDatabase',
    location: 'default'
   });

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Props{
    visible?: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    addMaterialsQty: (newMaterialQty: MaterialQty) => void
}



export const SearchTicketScreen = () => {
    const navigation = useNavigation()
    const [datePickerModalStartVisible, setDatePickerModalStartVisible] = useState(false)
    const [datePickerModalEndVisible, setDatePickerModalEndVisible] = useState(false)
    const {tickets,
      dateMin, 
      setDateMin,
      dateMax, 
      setDateMax,
      setTextFilter,
      reloadItem}=useTicketsWithFilter();
    
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
                style={localStyles.mainContainer}> 
                    <HeaderSearchTicket title={'Buscar Vale'}/>
                    <View style={localStyles.filterOptionsContainer}>
                    <View style={localStyles.dateFilterOptionscontainer}>
                      <View style={localStyles.dateAndTextContainer}>
                          <CustomText>
                            Fecha Inicial
                          </CustomText>
                          <TouchableOpacity 
                            style={localStyles.datePickerBtn}
                            onPress={()=>{setDatePickerModalStartVisible(true)}}>
                            <Icon style={{marginRight:10}} name="calendar-outline" size={windowHeight*0.03}  color="#000" />
                            <CustomText>
                              {dateMin?
                              dateFormatedDateFiltered(dateMin)
                              :'Selecciona'}</CustomText>
                          </TouchableOpacity>
                      </View>
                      <View style={localStyles.dateAndTextContainer}>
                          <CustomText>
                            Fecha Final
                          </CustomText>
                          <TouchableOpacity 
                            style={localStyles.datePickerBtn}
                            onPress={()=>{setDatePickerModalEndVisible(true)}}>
                            <Icon style={{marginRight:10}} name="calendar-outline" size={windowHeight*0.03}  color="#000" />
                            <CustomText>
                              {dateMax?
                              dateFormatedDateFiltered(dateMax)
                              :'Selecciona'}</CustomText>
                          </TouchableOpacity>
                      </View>
                      
                      </View>
                      </View>
                      <TextInput
                      style={localStyles.textInputTextToFilter}
                      placeholder='Buscar por Folio, Placa ó No Tolva'
                      placeholderTextColor='rgba(0,0,0,0.5)'
                      onChangeText={(text)=>{
                        setTextFilter(text)
                      }
                      }>
                        
                      </TextInput>
                    
                     <View>
                      <View >
                      
                          <FlatList 
                                      ItemSeparatorComponent={ItemSeparatorTickets}
                                      data={tickets}
                                      horizontal={false}
                                      keyExtractor={(item) => item.valeID.toString()}
                                      renderItem={({item,index})=> 
                                      <TicketToLoadItem ticketByID={item} reloadItem={reloadItem}/>
                                      }
                                      ListFooterComponent={(<View style={{height:windowHeight*0.27}}> 

                                      </View>)}
                          ></FlatList>

                        
                    </View>
                    </View>

                    <View>
              <DateTimePickerModal
                  mode="date"
                  isVisible={datePickerModalStartVisible}
                  onConfirm={(datePicked)=>{
                    setDateMin(datePicked)

                  }}
                  onCancel={()=>{setDatePickerModalStartVisible(false)
                                setDatePickerModalStartVisible(false)

                                setDateMin(undefined)
                              }}
                    onHide={()=>{setDatePickerModalStartVisible(false)}}
                />
              </View>
              <View>
                <DateTimePickerModal
                  mode="date"
                  isVisible={datePickerModalEndVisible}
                  onConfirm={(datePicked)=>{

                    setDateMax(datePicked)
                    setDatePickerModalEndVisible(false)
                  }}
                  onCancel={()=>{setDatePickerModalEndVisible(false)
                                  setDateMax(undefined)
                                }}
                  onHide={()=>{setDatePickerModalEndVisible(false)}}
                />
              </View>
                   
            </View>
    </SafeAreaView>

            
  )

  
}

const localStyles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'white',
        alignItems:'center'
    },
    filterOptionsContainer:{
      
    },
    dateFilterOptionscontainer:{
      flexDirection:'row',
      marginVertical:windowHeight*0.015
    },
    dateAndTextContainer:{
      flexDirection:'column',
      alignItems:'center'
    },
    datePickerBtn:{
      flexDirection:'row',
      alignItems:'center',
      borderRadius:2,
      paddingVertical:windowHeight*0.008,
      width:windowWidth*0.4,
      paddingHorizontal:windowWidth*0.03, 
      marginHorizontal:windowWidth*0.05, 
  
      backgroundColor:globalStyles.colors.shadowBtn
    },
    textInputTextToFilter:{
      width:windowWidth*0.9,
      height:windowHeight*0.055,
      //marginTop:windowHeight*0.02,
      marginBottom:windowHeight*0.02,
      borderColor:'#ccc',
      borderWidth:1,
      borderRadius:8, 
      marginHorizontal:5,
      color:'#000'},



    searchTab:{
        flexDirection:'row'
    }
    ,
    dropdown: {
        margin: 16,
        height: 50,
        width:windowWidth*0.9,
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
        justifyContent:'flex-end',
        backgroundColor:'white',
        padding:10,
    },
    btnSave:{
        backgroundColor:globalStyles.colors.sucess,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:25,
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
  
      }
});

