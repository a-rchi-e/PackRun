// react native
import { SafeAreaView } from 'react-native-safe-area-context';

// navigation
import HomePage from './screens/homepage/Homepage';
import RunTracking from './screens/runtracking/CurrentRun';
import RunHistory from './screens/runhistory/RunHistory';
import ChatScreen from './screens/chatpage/Chatscreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function App() {

  const NavBar = createBottomTabNavigator();
  const screenOptions = {
    headerShown: false,
  }

  return (
    <SafeAreaView style={{flex :1, backgroundColor: '#f8f8f8'}}>
      <NavigationContainer>
        <NavBar.Navigator screenOptions={screenOptions}>
          <NavBar.Screen name='Home' component={HomePage}/>
          <NavBar.Screen name='Track' component={RunTracking}/>
          <NavBar.Screen name='History' component={RunHistory}/>
          <NavBar.Screen name='Chat' component={ChatScreen}/>
        </NavBar.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}