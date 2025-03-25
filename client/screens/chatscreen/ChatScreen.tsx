// react native
import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

<<<<<<< HEAD:client/screens/chatpage/Chatscreen.tsx
const socket = io('http://192.168.68.100:3000', { transports: ['websocket'] });
=======
// styling
import global from '../../global'
import styles from './styles';

// socket.io
import { io } from 'socket.io-client';
const socket = io('http://192.168.1.116:3000', { transports: ['websocket'] });
>>>>>>> 9473ac8ede94b65356bd70f7ca3508066cad59c9:client/screens/chatscreen/ChatScreen.tsx

export default function Chatscreen() {

    const [messages, setMessages] = useState<{ author: string; time: string; message: string }[]>([]);
    const [input, setInput] = useState('');

    const getMessages = async () => {
        const response = await fetch(`http://192.168.68.100:3000/messages/xXBobmanXx`)
        if (!response.ok) throw new Error('Failed to send message');
        
        const resp = await response.json();
        setMessages(resp);
    }

    useEffect(() => {
        socket.on('message', (message: { author: string; time: string; message: string }) => {
            setMessages(prev => [...prev, message]);
        });
        getMessages();
        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = async () => {
        if (input.trim() !== '') {
            const userId = 'xXBobmanXx'
            const time = Date.now().toString();
            const message = { author: userId, time: time, message: input };
            try {
                const response = await fetch(`http://192.168.68.100:3000/message/${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(message),
                });
        
                if (!response.ok) throw new Error('Failed to send message');
        
                await response.json();
                console.log('Message saved:', message);
        
                // Also emit via Socket.IO for real-time updates
                socket.emit('message', message);
                setInput('');

                // for testing:
                setTimeout(() => {
                    botSendMessage();
                }, 5000);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // for testing / demo:
    const botSendMessage = async () => {
        const userId = 'Bertha Coolshoes'
        const time = Date.now().toString()
        const message = { author: userId, time: time, message: 'how about saturday, 9am?' };
        try {
            const response = await fetch(`http://192.168.68.100:3000/message/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message),
            });
    
            if (!response.ok) throw new Error('Failed to send message');
    
            await response.json();
            console.log('Message saved:', message);
    
            // Also emit via Socket.IO for real-time updates
            socket.emit('message', message);
        } catch (error) {
            console.error('Error:', error);
        }
    };

  return (
    <SafeAreaView style={{ flex: 1 }}>
<<<<<<< HEAD:client/screens/chatpage/Chatscreen.tsx
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <View style={styles.topdash}>
                <Text style={styles.dashtext}>Arrange a group run!</Text>
                </View>
                <FlatList
                data={messages}
                keyExtractor={(item) => item.time}
                renderItem={({ item }) => (
                    <View>
                        <Text style={item.author === 'xXBobmanXx' ? styles.username : styles.othername}>{item.author}</Text>
                        <View style={item.author === 'xXBobmanXx' ? styles.userMessage : styles.otherMessage}>
                            <Text style={styles.messageText}>{item.message}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ flexGrow: 1 }}
                />
                <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
=======

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={global.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* <View style={global.topdash}>
              <Text style={global.dashtext}>Arrange a group run!</Text>
            </View> */}
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{item.text}</Text>
>>>>>>> 9473ac8ede94b65356bd70f7ca3508066cad59c9:client/screens/chatscreen/ChatScreen.tsx
                </View>
            </View>
        </TouchableWithoutFeedback>
<<<<<<< HEAD:client/screens/chatpage/Chatscreen.tsx
        </KeyboardAvoidingView>
=======
      </KeyboardAvoidingView>
      
>>>>>>> 9473ac8ede94b65356bd70f7ca3508066cad59c9:client/screens/chatscreen/ChatScreen.tsx
    </SafeAreaView>
  );
}