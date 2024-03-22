import { useNavigation } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { StackActions } from '@react-navigation/native';
import { View } from 'react-native-reanimated/lib/typescript/Animated'

export const ReloadScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.dispatch(StackActions.replace("NewTicketScreen" as never))
    }, [500])
    
 
  return (
    <View>

    </View>
  )
}
