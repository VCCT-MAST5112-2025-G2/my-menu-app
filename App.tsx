
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StatusBar } from 'react-native';
import Colors from './assets/Theme/Colors'; // keep your existing path
import Home from './screens/Home'; // your existing screens
import Starters from './screens/starters';
import MainCourse from './screens/MainCourse';
import Desserts from './screens/Desserts';


export type Course = 'Starters' | 'Mains' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  course: Course;
  price: number;
}

interface MenuContextValue {
  courses: Course[];
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  removeMenuItem: (id: string) => void;
  getTotalItems: () => number;
  getItemsByCourse: (course: Course) => MenuItem[];
  getAveragePriceByCourse: () => Record<Course, number>;
}

export const MenuContext = React.createContext<MenuContextValue | undefined>(undefined);

const genId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const Stack = createNativeStackNavigator();

export default function App() {
  //Array of menu items that starts empty
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);

  // 1. predefined courses
  const courses: Course[] = ['Starters', 'Mains', 'Desserts'];

  // 2. addMenuItem - expects item without id, creates id and appends
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { id: genId(), ...item };
    setMenuItems(prev => [...prev, newItem]);
  };

  // 3. removeMenuItem - remove by id
  const removeMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  // 4. getTotalItems
  const getTotalItems = () => menuItems.length;

  // 5. getItemsByCourse
  const getItemsByCourse = (course: Course) => menuItems.filter(i => i.course === course);

  // 6. getAveragePriceByCourse
  const getAveragePriceByCourse = () => {
    const result: Record<Course, number> = {
      Starters: 0,
      Mains: 0,
      Desserts: 0,
    };
    courses.forEach(c => {
      const list = menuItems.filter(i => i.course === c);
      if (list.length === 0) {
        result[c] = 0;
      } else {
        const sum = list.reduce((s, it) => s + it.price, 0);
        result[c] = parseFloat((sum / list.length).toFixed(2));
      }
    });
    return result;
  };

  // Context value
  const contextValue: MenuContextValue = {
    courses,
    menuItems,
    addMenuItem,
    removeMenuItem,
    getTotalItems,
    getItemsByCourse,
    getAveragePriceByCourse,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ title: 'Menu' }} />
          <Stack.Screen name="Starters" component={Starters} />
          <Stack.Screen name="MainCourse" component={MainCourse} />
          <Stack.Screen name="Desserts" component={Desserts} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuContext.Provider>
  );
}

