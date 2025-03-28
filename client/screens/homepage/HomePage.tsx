// react native
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, Animated, useAnimatedValue } from 'react-native';

// helpers
import helpers from '../../helpers/helper';

// maplibre
import { MapView, Camera, MarkerView, ShapeSource, LineLayer, LineLayerStyle, Images } from '@maplibre/maplibre-react-native';

// styling
import global from '../../global'
import styles from './styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


// TESTING THE REAL-TIME MAP RENDERING (PART 1)

import { sendToAPI } from '../../helpers/data'

function* getNextObject() {
    const obj = sendToAPI;
    const progress = {
        "mode": "walk",
        "waypoints": [
            { "timestamp": "2025-01-31T12:32:52.000Z", "location": [13.515031, 52.468795] }
        ]
    }
    for (let i = 1; i <= obj.waypoints.length - 1; i++) {
        progress.waypoints.push(obj.waypoints[i]);
        yield progress;
    }
}

const waypointsGenerator = getNextObject();

export default function HomePage() {

    const apiKey = 'aeeb6ec8-5770-404c-8f6d-271cad7b3798';
    const styleURL = `https://tiles.stadiamaps.com/styles/outdoors.json?api_key=${apiKey}`;
    const [coords, setCoords] = useState<number[]>([]);
    const [running, setRunning] = useState(true);
    const [longIntervalID, setLID] = useState<NodeJS.Timeout>(0);
    const [shortIntervalID, setSID] = useState<NodeJS.Timeout>(0);
    const [markerHack, setMarkerHack] = useState(false);
    const [route, setRoute] = useState<GeoJSON.FeatureCollection>();
    const shoe = require('../../assets/running-shoe.png')
    const mapRef = useRef(null);
    const [snapshotURI, setSnapshotURI] = useState(null);

    useEffect(() => {
        timeout(); // (UNCOMMENT FOR TESTING REAL-TIME RENDERING)
        helpers.getLocation()
            .then(locationObject => setCoords([locationObject.coords.longitude, locationObject.coords.latitude]))
        sparseTracking();
    }, []);

    // hack: makes sure the marker appears on initial load
    useEffect(() => {
        setTimeout(() => {
            setMarkerHack(true);
        }, 100);
    }, [coords.length]);

    function sparseTracking() {
        setRunning(!running);
        clearInterval(shortIntervalID);
        setRoute({});
        setLID(setInterval(() => helpers.getNearestChatroom(), 3000));
    }

    function denseTracking() {
        setRunning(!running);
        clearInterval(longIntervalID);
        setSID(setInterval(() => helpers.trackCurrentRun()
            .then((responseFromAPI: GeoJSON.FeatureCollection | undefined) => {
                if (responseFromAPI) {
                    const waypoints = responseFromAPI.features[0].properties!.waypoints;
                    setCoords([
                        waypoints[waypoints.length - 1].location[0],
                        waypoints[waypoints.length - 1].location[1]])
                    setRoute(responseFromAPI);
                }
            }), 7000))

    }

    // TESTING THE REAL-TIME MAP RENDERING (PART 2)
    
    async function timeout() {

        const { done, value: latestWaypoints } = waypointsGenerator.next();
        if (done) return;
        try {
            const response = await fetch('https://api.geoapify.com/v1/mapmatching?apiKey=195e52b3f3a64bdb903a12bf0fea9ca7', {
                method: 'POST',
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(latestWaypoints)
            })
            const latestCoords = latestWaypoints.waypoints[latestWaypoints.waypoints.length - 1].location;
            setCoords(latestCoords);
            const veroute = await response.json();
            setRoute(veroute);
            setTimeout(timeout, 100);
        }
        catch (error) { console.log(error) }
    }

    const Blink = useCallback((props) => {

        const fadeAnim = useAnimatedValue(0);

        useEffect(() => {

            Animated.loop(
            Animated.sequence([

            Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver:true,
            }),

            Animated.timing(fadeAnim,{
            toValue:0,
            duration: 500,
            useNativeDriver: true,
            }),
        ]),
        {iterations: Infinity}
        ).start();
        },[fadeAnim]);

        return (
            <Animated.View style={{...props.style, opacity:fadeAnim}}>
              {props.children}
            </Animated.View>
          );
        }, []);


    return (
        <SafeAreaView>
            <View style={global.container}>
                <View style={styles.mapcontainer}>

                    {coords.length
                        ?
                        <MapView style={styles.mapview} mapStyle={styleURL} zoomEnabled={true} rotateEnabled={false}>

                            <Camera zoomLevel={16} centerCoordinate={coords} />

                            { running
                                ?
                                <MarkerView coordinate={coords}>
                                    <FontAwesome5 name="running" size={30} color="black" />
                                </MarkerView>
                                :
                                <MarkerView coordinate={coords}>
                                    <AntDesign name="enviroment" size={48} color="black" />
                                </MarkerView>
                            }

                            {route
                                ?
                                <ShapeSource id={'route'} shape={route}>
                                    <LineLayer id='route-style' style={lineStyle} />
                                </ShapeSource>
                                :
                                <View></View>
                            }

                            { running
                                ?
                                <TouchableOpacity style={styles.stopbtn} onPress={sparseTracking}>
                                    <Blink style={{ transform: [{ rotate: '-45deg' }] }}>
                                        <Text style={styles.btntext}>Stop</Text>
                                    </Blink>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.startbtn} onPress={denseTracking}>
                                    <View style={{ transform: [{ rotate: '-45deg' }] }}>
                                        <Text style={styles.btntext}>Start</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </MapView>
                        :
                        <View></View>}
                </View>
            </View>
        </SafeAreaView>
    );
}

const lineStyle: LineLayerStyle = {
    lineColor: '#4A90E2',
    lineWidth: 5
};
