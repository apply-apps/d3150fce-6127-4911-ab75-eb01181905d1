// Filename: index.js
// Combined code from all files
 
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, View, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';

const API_URL = 'http://apihub.p.appply.xyz:3300/chatgpt';
const workoutRequest = {
    messages: [
        {
            role: 'system',
            content: 'You are a helpful assistant. Please provide a list of workout exercises.',
        },
        {
            role: 'user',
            content: 'Can you give me a list of workout exercises?',
        },
    ],
    model: 'gpt-4o',
};

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Workout Tracker</Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <WorkoutList />
            </ScrollView>
        </SafeAreaView>
    );
}

const WorkoutList = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.post(API_URL, workoutRequest);
                const { data } = response;
                const resultString = data.response;

                // Assuming the response contains a list of workout exercises in plain text
                const workoutList = resultString.split('\n').map((item, index) => ({
                    id: index.toString(),
                    title: item,
                }));

                setWorkouts(workoutList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching workout exercises:', error);
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    return (
        <FlatList
            data={workouts}
            renderItem={({ item }) => (
                <View style={styles.workoutItem}>
                    <Text style={styles.workoutText}>{item.title}</Text>
                </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    scrollView: {
        paddingHorizontal: 20,
    },
    loader: {
        marginTop: 20,
    },
    list: {
        alignItems: 'center',
    },
    workoutItem: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
    },
    workoutText: {
        fontSize: 18,
        textAlign: 'center',
    },
});