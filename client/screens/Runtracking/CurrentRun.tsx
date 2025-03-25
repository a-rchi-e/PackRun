// CurrentRun.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { useRun } from '../../context/RunContext';

export default function CurrentRun() {
    const { elapsedTime, stillRunning, startRun, stopRun } = useRun();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (
    <View style={styles.container}>
        <View style={styles.topdash}>
            <Text style={styles.dashtext}>Run.</Text>
        </View>
        <View>
            <Text style={styles.screentext}>Time: {formatTime(elapsedTime)}</Text>
            <Text style={styles.screentext}>Pace: TODO</Text>
            <Text style={styles.screentext}>Distance: TODO</Text>
        </View>
        {stillRunning ? (
            <TouchableOpacity style={styles.stopbtn} onPress={stopRun}>
                <View style={{ transform: [{ rotate: '-45deg' }] }}>
                    <Text style={styles.stopbtntext}>Stop</Text>
                </View>
            </TouchableOpacity>
        ) : (
        <TouchableOpacity style={styles.stopbtn} onPress={startRun}>
            <View style={{ transform: [{ rotate: '-45deg' }] }}>
                <Text style={styles.stopbtntext}>Start</Text>
            </View>
        </TouchableOpacity>
        )}
    </View>
    );
}
