import * as Location from 'expo-location';
import Platform from 'react-native'

function getSystem() {
  console.log(Platform);
}
async function post(location: Location.LocationObject) {

  //you have to use your computer local ip to be able to reach the server from your mobile (and your mobile needs to stay in the same wifi ofc)
  const url = "http://192.168.100.18";

  try {
    console.log('location is', JSON.stringify(location));
    await fetch(url + ':3000/location', {
      method: "post", body: JSON.stringify(location),
      headers: { "Content-type": "application/json" }
    });

  } catch (error: any) {

    console.error(error.message);
  }
}

async function getLocation(setMapText: Function) {

  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') setMapText('Unable to get position. Permission denied.');
  else Location.getCurrentPositionAsync()
    .then(position => {
      post(position);

      setMapText('lat ' + position.coords.latitude + ' , ' + position.coords.longitude + ' long')
        .catch(() => setMapText('Unable to get position. GPS error'))
    });
}

export default { getSystem, http: { post }, Android: { GPS: { getLocation } }, IOS: {} };