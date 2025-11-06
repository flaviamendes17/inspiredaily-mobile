import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function FeedScreen() {
    const { user } = useAuth();
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>📰</Text>
                <Text style={styles.title}>Feed de Notícias</Text>
                <Text style={styles.userName}>{user?.name}</Text>
   
            </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🗞️ Últimas Notícias</Text>
                    <Text style={styles.cardText}>
                        Aqui você encontrará as notícias mais recentes e relevantes.
                    </Text>
                </View> 
        </ScrollView>
    );
}
