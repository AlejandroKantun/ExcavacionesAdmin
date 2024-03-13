import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MyStack } from './src/navigation/StackNavigator';
import { AuthProvider } from './src/context/AuthContext';


const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <MyStack/>
      </AppState>
    </NavigationContainer>    
  )
}

const AppState=({children}:any)=>{
  return(
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

export default App;
