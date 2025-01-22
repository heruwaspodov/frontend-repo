'use client';

import "./globals.css";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import theme from '@/theme';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
     <html lang="en">
      <body suppressHydrationWarning>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh', 
                padding: 2, 
                backgroundColor: '#f5f5f5', 
              }}
            >
              <Container
                maxWidth="sm" 
                sx={{
                  textAlign: 'center',
                  backgroundColor: '#ffffff', 
                  boxShadow: 3, 
                  padding: 4, 
                  borderRadius: 2
                }}
              >
                {children}
              </Container>
            </Box>
          </ThemeProvider>
        </Provider>
      </body>
      </html>
    
  );
}
