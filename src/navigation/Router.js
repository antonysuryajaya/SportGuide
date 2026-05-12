import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Discover from "../screens/Discover";
import Bookmark from "../screens/Bookmark";
import Profile from "../screens/Profile";
import BlogDetail from "../screens/BlogDetail";import {
  Home as HomeIcon,
  Compass,
  Bookmark as BookmarkIcon,
  User,
} from "lucide-react-native";
import { colors } from "../../assets/theme";
import Search from "../screens/Search";
import AddBlogForm from "../screens/AddBlogForm";
import SplashScreen from "../screens/SplashScreen";
import Register from "../screens/Register";
import Login from "../screens/Login";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.blue(),
        tabBarInactiveTintColor: colors.orange(),
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 60,
        },
        tabBarLabelStyle: {
          marginTop: 5,
          fontSize: 10,
          fontFamily: "Pjs-Medium",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color }) => <Compass color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Bookmark"
        component={Bookmark}
        options={{
          tabBarLabel: "Bookmark",
          tabBarIcon: ({ color }) => <BookmarkIcon color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BlogDetail"
        component={BlogDetail}
        options={{
          headerShown: false,
          animationEnabled: true,
          animationTypeForReplace: "pop",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}/>
        <Stack.Screen
        name="SearchPage"
        component={Search}
        options={{
          headerShown: false,
          animationEnabled: true,
          animationTypeForReplace: "pop",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
<Stack.Screen
        name="AddBlog"
        component={AddBlogForm}
        options={{
          headerShown: false, 
          animationEnabled: true,
          animationTypeForReplace: 'pop',
          gestureEnabled: true,
          gestureDirection : 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}/>
        <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ 
          headerShown: false,
          animationEnabled: true,
          animationTypeForReplace: "pop",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ 
          headerShown: false,
          animationEnabled: true,
          animationTypeForReplace: "pop",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ 
          headerShown: false,
          animationEnabled: true,
          animationTypeForReplace: "pop",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default Router;
