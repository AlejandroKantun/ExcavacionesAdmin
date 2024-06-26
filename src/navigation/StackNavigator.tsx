import { createStackNavigator } from '@react-navigation/stack';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { MainDrawerNavigator } from './MainDrawerNavigator';
import { RefreshDataFromDatabase } from '../screens/RefreshDataFromDatabase';

export type RootStackParams={
  SplashScreen: undefined,
  LoginScreen:undefined,
  ChangePasswordScreen:{
    userId:string,
    userName:string,
    pass:string,
  },
  MainDrawerNavigator:undefined,
  RefreshDataFromDatabase:undefined,
  ReloadScreen:undefined
}

const Stack = createStackNavigator<RootStackParams>();

export function MyStack() {
  return (
    <Stack.Navigator
        //initialRouteName="SplashScreen"
        initialRouteName="SplashScreen"
        screenOptions={{
        headerMode: 'float',
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'black' },
        }}>
      <Stack.Screen 
        name="SplashScreen" 
        component={SplashScreen} 
        options={{
            headerShown:false
                    }}/>
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{
            headerShown:false
                    }}/>
      <Stack.Screen 
        name="ChangePasswordScreen" 
        component={ChangePasswordScreen} 
        options={{
            headerShown:false
                    }}/>
      <Stack.Screen 
        name="MainDrawerNavigator" 
        component={MainDrawerNavigator} 
        options={{
            headerShown:false
                    }}/>
      <Stack.Screen 
        name="RefreshDataFromDatabase" 
        component={RefreshDataFromDatabase} 
        options={{
            headerShown:false
                    }}/>
    </Stack.Navigator>
  );
}