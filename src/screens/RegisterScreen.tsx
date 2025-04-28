import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useAuthContext } from '../contexts';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';
import { Images } from '@assets/images';
export const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading } = useAuthContext();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({ username, email, password });
      navigation.navigate('Library');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
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
        <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Join Novu to start reading</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          textColor="#fff"
          outlineColor="#404040"
          activeOutlineColor="#9575cd"
          placeholderTextColor="#757575"
          autoCapitalize="none"
          keyboardType="email-address"
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

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          buttonColor="#9575cd"
        >
          Sign Up
        </Button>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            textColor="#9575cd"
          >
            Sign In
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#9e9e9e',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
}); 