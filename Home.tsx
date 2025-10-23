// screens/Home.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from './assets/Theme/Colors';
import { MenuContext, Course } from './App';

interface HomeProps {
  navigation: any;
}

export default function Home({ navigation }: HomeProps) {
  const ctx = React.useContext(MenuContext);

  if (!ctx) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Menu</Text>
        <Text style={styles.emptyText}>Menu context not available.</Text>
      </View>
    );
  }

  const courses: Course[] = ctx.courses;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Menu</Text>
      <Text style={styles.sub}>Total items: {ctx.getTotalItems()}</Text>

      {courses.map(course => (
        <TouchableOpacity
          key={course}
          style={styles.button}
          onPress={() => navigation.navigate(course === 'Mains' ? 'MainCourse' : course)}
        >
          <Text style={styles.buttonText}>{course}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddItem')}
      >
        <Text style={styles.addText}>Add New Menu Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  sub: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.button,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    marginTop: 24,
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  addText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 24,
  },
});
