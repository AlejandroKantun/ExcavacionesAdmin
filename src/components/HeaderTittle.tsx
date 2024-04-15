import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import globalStyles from '../theme/appTheme';

interface Props{
    title:string
}


export const HeaderTitle = ({title}:Props) => {
  const {top}= useSafeAreaInsets();

  return (
    
          <View style={[localStyles.headerContainer]} >
              <Text style={localStyles.title }>
                  {title}
              </Text>
          </View>
  )
}


const localStyles = StyleSheet.create({
    headerContainer:{
        marginBottom:10,
        backgroundColor:globalStyles.colors.primary,
        flexDirection:'row'
    },
    title:{
        fontSize:23,
        fontWeight:'bold',
        color:globalStyles.colors.white,
        textAlign:'center'
    },
});