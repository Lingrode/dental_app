import { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import {
  HomeScreen,
  PatientScreen,
  AddPatientScreen,
  AddAppointmentScreen,
  PatientsScreen,
  EditPatientScreen,
  EditAppointmentScreen,
  TeethChartScreen,
} from "./screens";

const Stack = createNativeStackNavigator();

function App() {
  const [fontsLoaded, fontError] = useFonts({
    "SFUIText-Regular": require("./assets/fonts/SFUIText-Regular.otf"),
    "SFUIText-Semibold": require("./assets/fonts/SFUIText-Semibold.otf"),
    "SFUIText-Bold": require("./assets/fonts/SFUIText-Bold.otf"),
    "SFUIText-Heavy": require("./assets/fonts/SFUIText-Heavy.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer onLayout={onLayoutRootView}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Patient" component={PatientScreen} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} />
        <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
        <Stack.Screen name="Patients" component={PatientsScreen} />
        <Stack.Screen name="EditPatient" component={EditPatientScreen} />
        <Stack.Screen
          name="EditAppointment"
          component={EditAppointmentScreen}
        />
        <Stack.Screen name="TeethChart" component={TeethChartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
