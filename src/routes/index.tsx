import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Game from '../pages/Game';

const stackNavigator = createStackNavigator();

const Routes: React.FC = () => {
  return (
    <stackNavigator.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <stackNavigator.Screen name="Home" component={Home} />
      <stackNavigator.Screen name="Game" component={Game} />
    </stackNavigator.Navigator>
  );
};

export default Routes;
