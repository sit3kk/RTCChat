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
import { CallSessionProvider } from "./src/store/CallSessionProvider";
import { Colors } from "./src/styles/commonStyles";
import LoadingScreen from "./src/views/LoadingScreen";
import LoginScreen from "./src/views/LoginScreen";
import ContactsScreen from "./src/views/ContactsScreen";
import ChatsScreen from "./src/views/ChatsScreen";
import SettingsScreen from "./src/views/SettingsScreen";
import IconButton from "./src/components/ui/IconButton";
import InvitationsScreen from "./src/views/InvitationsScreen";
import { CallData } from "./src/types/commonTypes";
import IncomingCallScreenWrapper from "./src/views/IncomingCallScreenWrapper";
import AudioCallScreen from "./src/views/AudioCallScreen";
import VideoCallScreen from "./src/views/VideoCallScreen";
import ChatDetailsScreen from "./src/views/ChatDetailsScreen";

export type BottomTabParamList = {
  Contacts: undefined;
  Home: undefined;
  Chats: undefined;
  Settings: undefined;
};

export type AuthenticatedStackParamList = {
  AppNavigator: undefined;
  InteractionStack: { screen: keyof InteractionStackParamList; params?: any };
};

export type InteractionStackParamList = {
  Invitations: undefined;
  ChatDetails: {
    chatId: string;
    contactId: string;
    contactName: string;
    contactAvatar: string;
  };
  IncomingCall: { callData: CallData };
  AudioCall: { callData: CallData };
  VideoCall: { callData: CallData };
};

export type AuthenticatedStackProp =
  StackNavigationProp<AuthenticatedStackParamList>;

const AuthStackNavigator = createStackNavigator();
const AuthenticatedStackNavigator =
  createStackNavigator<AuthenticatedStackParamList>();
const InteractionStackNavigator =
  createStackNavigator<InteractionStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const AuthStack = () => {
  return (
    <AuthStackNavigator.Navigator initialRouteName="Login">
      <AuthStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </AuthStackNavigator.Navigator>
  );
};

const AppNavigator = () => {
  const navigation = useNavigation<AuthenticatedStackProp>();
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
        tabBarInactiveTintColor: Colors.textDimmed,
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
            <View style={{ marginRight: 10, flexDirection: "row" }}>
              <IconButton
                name="add"
                style={{ paddingHorizontal: 10 }}
                onPress={() => {
                  navigation.navigate("InteractionStack", {
                    screen: "Invitations",
                  });
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
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
          tabBarLabel: "Chats",
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

const InteractionStack = () => {
  return (
    <InteractionStackNavigator.Navigator>
      <InteractionStackNavigator.Screen
        name="Invitations"
        component={InvitationsScreen}
        options={{ headerShown: false }}
      />
      <InteractionStackNavigator.Screen
        name="ChatDetails"
        component={ChatDetailsScreen}
        options={{ headerShown: false }}
      />
      <InteractionStackNavigator.Screen
        name="IncomingCall"
        component={IncomingCallScreenWrapper}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <InteractionStackNavigator.Screen
        name="AudioCall"
        component={AudioCallScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <InteractionStackNavigator.Screen
        name="VideoCall"
        component={VideoCallScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </InteractionStackNavigator.Navigator>
  );
};

const AuthenticatedStack = () => {
  return (
    <AuthenticatedStackNavigator.Navigator initialRouteName="AppNavigator">
      <AuthenticatedStackNavigator.Screen
        name="AppNavigator"
        component={AppNavigator}
        options={{ headerShown: false }}
      />
      <AuthenticatedStackNavigator.Screen
        name="InteractionStack"
        component={InteractionStack}
        options={{ headerShown: false }}
      />
    </AuthenticatedStackNavigator.Navigator>
  );
};

function Navigation() {
  const authCtx = useAuth();

  return (
    <NavigationContainer>
      <CallSessionProvider>
        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && <AuthenticatedStack />}
      </CallSessionProvider>
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
