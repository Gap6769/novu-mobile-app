import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useAuthContext } from '../contexts';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import { Images } from '@assets/images';

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading } = useAuthContext();

  const handleLogin = async () => {
    try {
      await login({ username, password });
      navigation.navigate('Library');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={Images.logo}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Surface style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Sign in to continue reading</Text>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
          textColor="#fff"
          outlineColor="#404040"
          activeOutlineColor="#9575cd"
          placeholderTextColor="#757575"
          autoCapitalize="none"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          textColor="#fff"
          outlineColor="#404040"
          activeOutlineColor="#9575cd"
          placeholderTextColor="#757575"
          autoCapitalize="none"
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          buttonColor="#9575cd"
        >
          Sign In
        </Button>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            textColor="#9575cd"
          >
            Sign Up
          </Button>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#2d2d2d',
    elevation: 4,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9e9e9e',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#9e9e9e',
  },
}); 