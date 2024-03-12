import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainMenuScreen } from '../screens/MainMenuScreen';
import { NewTicketScreen } from '../screens/NewTicketScreen';
import { SketchCanvasWithInteraction } from '../screens/SignAndSaveScreen';
import { SearchTicketScreen } from '../screens/SearchTicketScreen';

const Drawer = createDrawerNavigator();

export const MainDrawerNavigator = () => {
    const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        
      }}
    >
      {/**
       * 
       <Drawer.Screen  name="MainMenuScreen" component={MainMenuScreen}  options={{headerShown: false}} /> 
       */}

      <Drawer.Screen name="NewTicketScreen" component={NewTicketScreen}  options={{headerShown: false}}/>
      <Drawer.Screen name="SketchCanvasWithInteraction" component={SketchCanvasWithInteraction} />
      <Drawer.Screen name="SearchTicketScreen" component={SearchTicketScreen} />

      {/* Screens */}
    </Drawer.Navigator>
  );
}


 