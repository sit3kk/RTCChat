import React, { useState, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useAuth, AuthProvider } from "./src/store/AuthProvider";
import { UserDataProvider } from "./src/store/UserDataProvider";
import { Colors } from "./src/styles/commonStyles";
import LoadingScreen from "./src/views/LoadingScreen";
import LoginScreen from "./src/views/LoginScreen";
import HomeScreen from "./src/views/HomeScreen";
import ContactsScreen from "./src/views/ContactsScreen";
import ChatScreen from "./src/views/ChatScreen";
import SettingsScreen from "./src/views/SettingsScreen";
import CallScreen from "./src/views/CallScreen";

export type BottomTabParamList = {
  Contacts: undefined;
  Home: undefined;
  Chat: { chatId: string };
  Calls: { channelName: string; contactName: string };
  Settings: undefined;
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AuthenticatedStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#0000FF",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
          tabBarLabel: "Contacts",
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        initialParams={{
          chatId: "general",
        }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
          tabBarLabel: "Chat",
        }}
      />
      <Tab.Screen
        name="Calls"
        component={CallScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="call" size={24} color={color} />
          ),
          tabBarLabel: "Calls",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
};

function Navigation() {
  const authCtx = useAuth();

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingInitLogin, setIsTryingInitLogin] = useState(true);
  const authCtx = useAuth();

  const initialLogin = async () => {
    try {
      const storedToken = await authCtx.fetchStoredToken();
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      setIsTryingInitLogin(false);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  useEffect(() => {
    initialLogin();
  }, []);

  if (isTryingInitLogin) {
    return <LoadingScreen />;
  }
  return <Navigation />;
}

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <UserDataProvider>
          <Root />
        </UserDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
