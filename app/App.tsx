import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth, AuthProvider } from "./src/store/AuthProvider";
import { UserDataProvider } from "./src/store/UserDataProvider";
import { Colors } from "./src/styles/commonStyles";
import LoadingScreen from "./src/views/LoadingScreen";
import LoginScreen from "./src/views/LoginScreen";
import HomeScreen from "./src/views/HomeScreen";
import ContactsScreen from "./src/views/ContactsScreen";
import ChatScreen from "./src/views/ChatScreen";
import SettingsScreen from "./src/views/SettingsScreen";
import IconButton from "./src/components/ui/IconButton";
import InvitationsScreen from "./src/views/InvitationsScreen";

export type BottomTabParamList = {
  Contacts: undefined;
  Home: undefined;
  Chat: { chatId: string };
  Settings: undefined;
};

export type AppStackParamList = {
  AppNavigator: undefined;
  Invitations: undefined;
};

type AppNavigationProp = StackNavigationProp<AppStackParamList, "Invitations">;

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

const AppNavigator = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return (
    <Tab.Navigator
      initialRouteName="Contacts"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
          height: 120,
        },
        headerTitleStyle: {
          fontSize: 32,
          fontWeight: "bold",
          color: Colors.textLight,
        },
        headerTitleAlign: "left",
        tabBarActiveTintColor: Colors.textLight,
        tabBarInactiveTintColor: Colors.textDimed,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderColor: Colors.background,
        },
      }}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <IconButton
                name="add"
                onPress={() => {
                  navigation.navigate("Invitations");
                }}
              />
            </View>
          ),
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

const InvitationsStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Invitations"
        component={InvitationsScreen}
        options={{
          headerStyle: {
            backgroundColor: Colors.background,
            height: 120,
          },
          headerTitleStyle: {
            fontSize: 32,
            fontWeight: "bold",
            color: Colors.textLight,
          },
          headerTitleAlign: "left",
          headerLeft: () => (
            <View
              style={{
                marginLeft: 10,
                marginRight: 140,
                gap: 5,
                flexDirection: "row",
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.textLight}
                onPress={() => navigation.goBack()}
              />
              <Text style={{ fontSize: 18, color: Colors.textLight }}>
                Back
              </Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator initialRouteName="AppNavigator">
      <Stack.Screen
        name="AppNavigator"
        component={AppNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Invitations"
        component={InvitationsStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
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
          <GestureHandlerRootView>
            <Root />
          </GestureHandlerRootView>
        </UserDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
