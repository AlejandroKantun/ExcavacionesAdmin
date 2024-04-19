import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NewTicketScreen } from '../screens/NewTicketScreen';
import { SearchTicketScreen } from '../screens/SearchTicketScreen';
import { UpdateTicketScreen } from '../screens/UpdateTicketScreen';
import { Vale } from '../interfaces/Vale';

export type RootDrawerParams={
  NewTicketScreen:undefined,
  SearchTicketScreen:undefined,
  UpdateTicketScreen:undefined,
}

const Drawer = createDrawerNavigator<RootDrawerParams>();


export const MainDrawerNavigator = () => {
    const dimensions = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        drawerItemStyle: { display: 'none' },
        drawerPosition:'right',
        swipeEnabled:false
      }}
    >

      <Drawer.Screen name="NewTicketScreen"     component={NewTicketScreen}  options={{headerShown: false}}/>
      <Drawer.Screen name="SearchTicketScreen"  component={SearchTicketScreen} options={{headerShown: false}} />
      <Drawer.Screen name="UpdateTicketScreen"  component={UpdateTicketScreen} options={{headerShown: false}} />

      {/* Screens */}
    </Drawer.Navigator>
  );
}


 