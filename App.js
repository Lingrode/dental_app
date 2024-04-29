import { useCallback } from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

import {
  HomeScreen,
  PatientScreen,
  AddPatientScreen,
  AddAppointmentScreen,
  PatientsScreen,
  EditPatientScreen,
  EditAppointmentScreen,
  TeethChartScreen
} from './screens';

// TODO: Зробити редагування пацієнтів та прийомів ------------- DONE
// TODO: Зробити popup для прийома в карті пацієнта (видалення, редагування) ------------- DONE
// TODO: Поправити стилі для кнопок
// TODO: Зробити формулу зубів
// TODO: Зробити активний прийом, щоб він підсвічувався синім в списку прийомів ------------- DONE
// TODO: Зробити екран формулу зубів
// TODO: Якщо прийом завершено, то підсвічувати конкретний зуб ------------- DONE

const Stack = createNativeStackNavigator();

function App() {
  const [fontsLoaded, fontError] = useFonts({
    'SFUIText-Regular': require('./assets/fonts/sfuitext-regular.otf'),
    'SFUIText-Semibold': require('./assets/fonts/sfuitext-semibold.otf'),
    'SFUIText-Bold': require('./assets/fonts/sfuitext-bold.otf'),
    'SFUIText-Heavy': require('./assets/fonts/sfuitext-heavy.otf'),
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
        <Stack.Screen
          name='Home'
          component={HomeScreen}
        />
        <Stack.Screen
          name='Patient'
          component={PatientScreen}
        />
        <Stack.Screen
          name='AddPatient'
          component={AddPatientScreen}
        />
        <Stack.Screen
          name='AddAppointment'
          component={AddAppointmentScreen}
        />
        <Stack.Screen
          name='Patients'
          component={PatientsScreen}
        />
        <Stack.Screen
          name='EditPatient'
          component={EditPatientScreen}
        />
        <Stack.Screen
          name='EditAppointment'
          component={EditAppointmentScreen}
        />
        <Stack.Screen
          name='TeethChart'
          component={TeethChartScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
