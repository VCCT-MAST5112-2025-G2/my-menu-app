import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from './assets/Theme/Colors';
import Starters from './starters'
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
  imageUri?: string; // will hold image URI if I decide to add images later
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
  // optional seed data (useful while building UI) 
  const sampleData: MenuItem[] = [
   {
    id: genId(),
    name: 'Bruschetta',
    description: 'Tomato, basil, olive oil, sourdough',
    course: 'Starters',
    price:  55,
   },
   {
    id: genId(),
    name: 'Herb-Roasted Chicken',
    description: 'Served with seasonal vegetables',
    course: 'Mains',
    price: 140,
   },
   {
    id: genId(),
    name: 'Panna Cotta',
    description: 'Vanilla cream with berry coulis',
    course: 'Desserts',
    price: 60,
   },
  ];

  // State: menu items (starts with sample data - change to [] if you prefer empty)
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(sampleData);

  // Predefined courses
  const courses: Course[] = ['Starters', 'Mains', 'Desserts'];

  // Add item (expects item without id)
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
   const newItem: MenuItem = { id: genId(), ...item };
   setMenuItems(prev => [...prev, newItem]);
  };

  // Working with removing by id
  const removeMenuItem = (id: string) => {
   setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const getTotalItems = () => menuItems.length;
  const getItemsByCourse = (course: Course) => menuItems.filter(i => i.course === course);

  // Average price per course
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
       <Stack.Screen name="Home" component={App} options={{ title: 'Menu' }} />
       <Stack.Screen name="Starters" component={Starters} options={{ title: 'Starters' }} />
       <Stack.Screen name="MainCourse" component={MainCourse} options={{ title: 'Main Course' }} />
       <Stack.Screen name="Desserts" component={Desserts} options={{ title: 'Desserts' }} />
      </Stack.Navigator>
    </NavigationContainer>
   </MenuContext.Provider>
  );
}