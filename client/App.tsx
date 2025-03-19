import { Button, Pressable, Text, View } from 'react-native';
import styles from "./helpers/Styles.js";
import { useState } from 'react';
import helper from './helpers/helper';

export default function App() {
  const [maptxt, setMapText] = useState('');

  function getLocation() {
    helper.getSystem();
    setMapText('getting gps position...');

    helper.Android.GPS.getLocation(setMapText);
  }

  return (
    <View style={styles.homePage.mainContainer}>

      <View style={styles.homePage.mapMessage}>
        <Text style={styles.homePage.message}>{maptxt}</Text>
      </View>
      <View style={styles.homePage.map}>
        <View style={styles.homePage.vertButtonsContainer}>
          <Button title="a" ></Button>
          <Button title="a" ></Button>
          <Button title="a" ></Button>
          <Button title="a" ></Button>
        </View>
      </View>
      <View style={styles.homePage.horButtonsContainer}>
        <Button title="a" ></Button>
        <Button title="a" ></Button>
        <Button title="a" ></Button>
        <Button title="a" ></Button>
        <Button title="a" ></Button>
      </View>
      <View style={styles.homePage.lowerButtonsView}>
        <Pressable onPress={getLocation} style={styles.homePage.buttonView}>
          <Text style={styles.homePage.textButton}>START</Text>
        </Pressable>
      </View>
    </View>
  );
}

