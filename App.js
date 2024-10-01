import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import SignInScreen from "./screens/SignInScreen";
import SplashScreen from "./screens/SplashScreen";
import SignUpScreen from "./screens/SignUpScreen";
import FieldTasks from "./screens/FieldTasks";



import { useState } from "react";
import { LogBox } from "react-native";

import IntroductionAnimationScreen from "./screens/IntroductionAnimationScreen";
import CameraPrediction from "./screens/CameraPrediction";



import FiremanDashboard from "./screens/FiremanDashboard"
import AcceptRejectFiremen from "./screens/AcceptRejectFiremen"
import MapViewFireMan from "./screens/MapViewFireMan"
import FiremanViewTask from "./screens/FiremanViewTask"


import PoliceManDashboard from "./screens/PoliceManDashboard"
import AcceptRejectPoliceMan from "./screens/AcceptRejectPoliceMan"
import MapViewPoliceMan from "./screens/MapViewPoliceMan"
import PoliceManViewTask from "./screens/PoliceManViewTask"


import CleanerDashboard from "./screens/CleanerDashboard"
import CleanerUpload from "./screens/CleanerUpload"


import PedestrianUpload from "./screens/PedestrianUpload"
import PedestrianDashboard from "./screens/PedestrianDashboard"





export default function App() {
  const Stack = createStackNavigator();
  const [userType, setuserType] = useState("cleaner");
  LogBox.ignoreAllLogs();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
          >
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
              initialRouteName={"IntroductionAnimationScreen"}
            >

              <Stack.Screen
                name="IntroductionAnimationScreen"
                component={IntroductionAnimationScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="FieldTasks"
                component={FieldTasks}
                options={{ headerShown: false }}
              />

              


              {/* <Stack.Screen
                name="IntroductionAnimationScreen"
                component={IntroductionAnimationScreen}
                options={{ headerShown: false }}
              /> */}

              <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="AcceptRejection"
                component={AcceptReject}
                options={{ headerShown: false }}
              />

              {/* <Stack.Screen
                name="FieldTasks"
                component={FieldTasks}
                options={{ headerShown: false }}
              /> */}

              <Stack.Screen
                name="TaskApproval"
                component={TaskApproval}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="MapView"
                component={MapView}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="FiremanDashboard"
                component={FiremanDashboard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AcceptRejectFiremen"
                component={AcceptRejectFiremen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MapViewFireMan"
                component={MapViewFireMan}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="FiremanViewTask"
                component={FiremanViewTask}
                options={{ headerShown: false }}
              />





              <Stack.Screen
                name="PoliceManDashboard"
                component={PoliceManDashboard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AcceptRejectPoliceMan"
                component={AcceptRejectPoliceMan}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MapViewPoliceMan"
                component={MapViewPoliceMan}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PoliceManViewTask"
                component={PoliceManViewTask}
                options={{ headerShown: false }}
              />




              <Stack.Screen
                name="CleanerDashboard"
                component={CleanerDashboard}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="CleanerUpload"
                component={CleanerUpload}
                options={{ headerShown: false }}
              />





              <Stack.Screen
                name="PedestrianDashboard"
                component={PedestrianDashboard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PedestrianUpload"
                component={PedestrianUpload}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CameraPrediction"
                component={CameraPrediction}
                options={{ headerShown: false }}
              />


              



              

              

             
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
