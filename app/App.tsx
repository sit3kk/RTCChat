import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/views/LoginScreen";
import HomeScreen from "./src/views/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ContactsScreen from "./src/views/ContactsScreen";

export type BottomTabParamList = {
  Contacts: { userId: string; userName: string };
  Home: undefined;
  InviteFriends: undefined;
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

interface TabNavigatorProps {
  userId: string;
  userName: string;
  userLoggedIn: boolean;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({
  userId,
  userName,
  userLoggedIn,
}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#0000FF",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        initialParams={{ userId, userName }}
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
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userString = await AsyncStorage.getItem("@user");

      const isUserLoggedIn = !!userString;
      setUserLoggedIn(isUserLoggedIn);

      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUserId(parsedUser.id);
        setUserName(parsedUser.name);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setUserLoggedIn(false);
    }
  };

  if (userLoggedIn === null) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {userLoggedIn ? (
          <TabNavigator
            userId={userId}
            userName={userName}
            userLoggedIn={userLoggedIn}
          />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
