import React from 'react';
import { Alert, StatusBar, View, Text, StyleSheet } from 'react-native';
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

const sampleData: MenuItem[] = [
  { id: genId(), name: 'Bruschetta', description: 'Tomato, basil, olive oil, sourdough', course: 'Starters', price: 55, imageUri: 'https://via.placeholder.com/400x300.png?text=Bruschetta' },
  { id: genId(), name: 'Caesar Salad', description: 'Romaine, croutons, parmesan, Caesar dressing', course: 'Starters', price: 65, imageUri: 'https://via.placeholder.com/400x300.png?text=Caesar+Salad' },
  { id: genId(), name: 'Vegan Kebabs', description: 'Grilled vegetable skewers with dipping sauce', course: 'Starters', price: 40, imageUri: 'https://via.placeholder.com/400x300.png?text=Vegan+Kebabs' },
  { id: genId(), name: 'Grilled Salmon', description: 'Served with lemon butter sauce and asparagus', course: 'Mains', price: 150, imageUri: 'https://via.placeholder.com/400x300.png?text=Grilled+Salmon' },
  { id: genId(), name: 'Spaghetti Carbonara', description: 'Classic Italian pasta with pancetta and creamy sauce', course: 'Mains', price: 200, imageUri: 'https://via.placeholder.com/400x300.png?text=Carbonara' },
  { id: genId(), name: 'Herb-Roasted Chicken', description: 'Served with seasonal vegetables', course: 'Mains', price: 140, imageUri: 'https://via.placeholder.com/400x300.png?text=Roasted+Chicken' },
  { id: genId(), name: 'Panna Cotta', description: 'Vanilla cream with berry coulis', course: 'Desserts', price: 60, imageUri: 'https://via.placeholder.com/400x300.png?text=Panna+Cotta' },
  { id: genId(), name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', course: 'Desserts', price: 70, imageUri: 'https://via.placeholder.com/400x300.png?text=Lava+Cake' },
  { id: genId(), name: 'Fruit Tart', description: 'Seasonal fruits with custard in a pastry shell', course: 'Desserts', price: 65, imageUri: 'https://via.placeholder.com/400x300.png?text=Fruit+Tart' },
];

export default function App() {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(sampleData);
  const courses: Course[] = ['Starters', 'Mains', 'Desserts'];

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { id: genId(), ...item };
    setMenuItems(prev => [...prev, newItem]);
  };

  const removeMenuItem = (id: string) => setMenuItems(prev => prev.filter(i => i.id !== id));

  const handleRemove = (id: string) => {
    Alert.alert('Remove item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeMenuItem(id) },
    ]);
  };

  const getTotalItems = () => menuItems.length;

  const getItemsByCourse = (course: Course) => menuItems.filter(i => i.course === course);

  const getAveragePriceByCourse = () => {
    const result: Record<Course, number> = { Starters: 0, Mains: 0, Desserts: 0 };
    courses.forEach(c => {
      const list = menuItems.filter(i => i.course === c);
      result[c] = list.length
        ? parseFloat((list.reduce((sum, it) => sum + it.price, 0) / list.length).toFixed(2))
        : 0;
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

  // place this above the return()
  const HomeWithIntro = (props: any) => (
    <>
      <Home {...props} />
      <View style={styles.introContainer}>
        <Text style={styles.introText}>
          Welcome to <Text style={{ fontWeight: '700' }}>Sage Eatery</Text> — a dining experience
          rooted in earthy elegance. We proudly partner with local farmers and free-range
          suppliers to bring you dishes crafted from the freshest seasonal produce. Each plate is
          a celebration of sustainability and flavor, brought to life under the masterful hands of
          internationally renowned Chef <Text style={{ fontWeight: '700' }}>Christoffel</Text>.
        </Text>
      </View>
    </>
  );

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
          {/* Updated app title */}
          <Stack.Screen
            name="Home"
            component={HomeWithIntro}
            options={{
              title: 'Sage Eatery',
              headerRight: () => (
                <View style={{ paddingHorizontal: 12 }}>
                  <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                    Fresh • Local • Free-Range
                  </Text>
                </View>
              ),
            }}
          />
          <Stack.Screen name="Starters" component={Starters} options={{ title: 'Starters' }} />
          <Stack.Screen name="MainCourse" component={MainCourse} options={{ title: 'Main Course' }} />
          <Stack.Screen name="Desserts" component={Desserts} options={{ title: 'Desserts' }} />
          <Stack.Screen name="AddItem" component={AddItem} options={{ title: 'Add Item' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introContainer: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  introText: {
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
