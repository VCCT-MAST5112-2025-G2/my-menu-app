// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from './assets/Theme/Colors';
import Home from './Home';
import Starters from './starters';
import MainCourse from './MainCourse';
import Desserts from './Desserts';
import AddItem from './AddItem';

export type Course = 'Starters' | 'Mains' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  course: Course;
  price: number;
  imageUri?: string;
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

const Stack = createNativeStackNavigator();
const genId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export default function App() {
  const sampleData: MenuItem[] = [
    { id: genId(), name: 'Bruschetta', description: 'Tomato, basil, olive oil, sourdough', course: 'Starters', price: 55 },
    { id: genId(), name: 'Herb-Roasted Chicken', description: 'Served with seasonal vegetables', course: 'Mains', price: 140 },
    { id: genId(), name: 'Panna Cotta', description: 'Vanilla cream with berry coulis', course: 'Desserts', price: 60 },
  ];

  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(sampleData);
  const courses: Course[] = ['Starters', 'Mains', 'Desserts'];

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { id: genId(), ...item };
    setMenuItems(prev => [...prev, newItem]);
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const getTotalItems = () => menuItems.length;

  const getItemsByCourse = (course: Course) => menuItems.filter(i => i.course === course);

  const getAveragePriceByCourse = () => {
    const result: Record<Course, number> = { Starters: 0, Mains: 0, Desserts: 0 };
    courses.forEach(c => {
      const list = menuItems.filter(i => i.course === c);
      result[c] = list.length ? parseFloat((list.reduce((sum, it) => sum + it.price, 0) / list.length).toFixed(2)) : 0;
    });
    return result;
  };

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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: Colors.secondary },
            headerTintColor: Colors.textPrimary,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="Home" component={Home} options={{ title: 'Menu' }} />
          <Stack.Screen name="Starters" component={Starters} options={{ title: 'Starters' }} />
          <Stack.Screen name="MainCourse" component={MainCourse} options={{ title: 'Main Course' }} />
          <Stack.Screen name="Desserts" component={Desserts} options={{ title: 'Desserts' }} />
          <Stack.Screen name="AddItem" component={AddItem} options={{ title: 'Add Item' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuContext.Provider>
  );
}
