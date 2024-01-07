import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useState, useEffect } from "react";

import {
  getConfigs,
} from "@/src/helpers/files";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

interface Configs {
  headers: {
    expenseadder: { value: string };
    savings: { value: string };
    earnings: { value: string };
    giveaways: { value: string };
    budgets: { value: string };
  };
}

function RootLayoutNav() {
  const [configs, setConfigs] = useState<Configs | null>(null);

  useEffect(() => {
    getConfigs().then((data) => {
      setConfigs(data);
    });
  }, []);

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
        name="finances/ExpenseAdder"
        options={{
          headerTitle: 'Expense adder',
          headerStyle: {
            backgroundColor: configs?.headers.expenseadder?.value || "#f3e7e7",
          },  
        }}
        />
         <Stack.Screen
        name="finances/Savings"
        options={{
          headerTitle: 'Savings',
          headerStyle: {
            backgroundColor: configs?.headers.savings?.value || "#f3e7e7",
          }, 
        }}
        />
        <Stack.Screen
        name="finances/Profits"
        options={{
          headerTitle: 'Profits',
          headerStyle: {
            backgroundColor: configs?.headers.earnings?.value || "#f3e7e7",
          }, 
        }}
        />
        <Stack.Screen
        name="finances/Budgets"
        options={{
          headerTitle: 'Budgets',
          headerStyle: {
            backgroundColor: configs?.headers.budgets?.value || "#f3e7e7",
          }, 
        }}
        />
        <Stack.Screen
        name="tools/Giveaways"
        options={{
          headerTitle: 'Giveaways',
          headerStyle: {
            backgroundColor: configs?.headers.giveaways?.value || "#f3e7e7",
          }, 
        }}
        />
       
        
      </Stack>
    </ThemeProvider>
  );
}
