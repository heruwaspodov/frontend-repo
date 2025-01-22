'use client';

import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, USERS_COLLECTION } from '@/apis/firebase';

import { auth } from '@/apis/firebase';
import { Button, TextField, Typography, Box, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { loginSuccess } from '@/store/userSlice';
import { GoogleIcon, FacebookIcon } from '@/components/customIcon';


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const [isMounted, setIsMounted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setIsClicked(true); 

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const id = user.uid;
        const accessToken = await user.getIdToken();

        const userRef = doc(db, USERS_COLLECTION, id);
        const lastLogin = new Date().toISOString();
        
        const userData = {
          email: user.email,
          accessToken: accessToken,
          lastLogin: lastLogin,
          name: user.email,
        };

        await setDoc(userRef, userData, { merge: true });

        dispatch(loginSuccess({
          email: user.email || '',
          id: id,
          name: user.email || '',
          lastLogin: lastLogin,
          accessToken: accessToken
        }));

        router.push('/user-detail');
      }
    } catch (err) {
      setError((err as Error).message);
       setIsClicked(false); 
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setError('email is invalid');
    } else {
      setError('');
    }
  };
  
  if (!isMounted) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} maxWidth={400} mx="auto" paddingTop={4} paddingBottom={6}>
      <Typography variant="h5" sx={{
        textAlign: 'left',
        marginBottom: 2,
      }}>Login</Typography>
      <Box display="flex" flexDirection="column" gap={2} marginBottom={2}>
        <TextField
          label="Email"
          type="email"
          value={email}
          autoFocus
          onChange={handleEmailChange}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      
      {error && <Typography color="error">{error}</Typography>}

      <Button variant="contained" onClick={handleLogin} disabled={isClicked}>
        Login
      </Button>
      <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Facebook')}
          startIcon={<FacebookIcon />}
        >
          Sign in with Facebook
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
