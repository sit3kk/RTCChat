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
import ChatsList from "./src/views/ChatsList";
import SettingsScreen from "./src/views/SettingsScreen";
import IconButton from "./src/components/ui/IconButton";
import InvitationsScreen from "./src/views/InvitationsScreen";
import { randomAvatar } from "./src/utils/utils";
import { CallData } from "./src/types/commonTypes";
import IncomingCallScreenWrapper from "./src/views/IncomingCallScreenWrapper";
import AudioCallScreen from "./src/views/AudioCallScreen";
import VideoCallScreen from "./src/views/VideoCallScreen";
import ChatDetails from "./src/views/ChatDetails";

export type BottomTabParamList = {
  Contacts: undefined;
  Home: undefined;
  Chats: { chatId: string };
  Settings: undefined;
};

export type AuthenticatedStackParamList = {
  AppNavigator: undefined;
  InteractionStack: { screen: keyof InteractionStackParamList; params?: any };
};

export type InteractionStackParamList = {
  Invitations: undefined;
  IncomingCall: { callData: CallData };
  AudioCall: { callData: CallData };
  VideoCall: { callData: CallData };
};

export type ChatsStackParamList = {
  ChatsList: undefined;
  ChatDetails: { chatId: string; contactName: string };
};

type AuthenticatedStackProp = StackNavigationProp<AuthenticatedStackParamList>;
type InteractionStackProp = StackNavigationProp<InteractionStackParamList>;

const AuthStackNavigator = createStackNavigator();
const AuthenticatedStackNavigator =
  createStackNavigator<AuthenticatedStackParamList>();
const InteractionStackNavigator =
  createStackNavigator<InteractionStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();
const ChatsStack = createStackNavigator<ChatsStackParamList>();

const ChatsStackNavigator = () => {
  return (
    <ChatsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ChatsStack.Screen name="ChatsList" component={ChatsList} />
      <ChatsStack.Screen name="ChatDetails" component={ChatDetails} />
    </ChatsStack.Navigator>
  );
};

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
                onPress={() => {
                  navigation.navigate("InteractionStack", {
                    screen: "Invitations",
                  });
                }}
              />
              <IconButton
                // temporary navigation to IncomingCallScreen
                name="call"
                onPress={() => {
                  navigation.navigate("InteractionStack", {
                    screen: "IncomingCall",
                    params: {
                      callData: {
                        callPartner: {
                          id: "1",
                          name: "John Dough",
                          avatar: randomAvatar(),
                        },
                        callType: "video",
                      },
                    },
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
        component={ChatsStackNavigator}
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
  const navigation = useNavigation<InteractionStackProp>();
  return (
    <InteractionStackNavigator.Navigator>
      <InteractionStackNavigator.Screen
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
      <InteractionStackNavigator.Screen
        name="IncomingCall"
        component={IncomingCallScreenWrapper}
        options={{ headerShown: false }}
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
