// screens/AddItem.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Colors from './assets/Theme/Colors';
import { MenuContext, Course, MenuItem } from './App';
import { Picker } from '@react-native-picker/picker';

interface AddItemProps {
  navigation: any;
}

export default function AddItem({ navigation }: AddItemProps) {
  const ctx = useContext(MenuContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState<Course>('Starters');

  if (!ctx) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Add Item</Text>
        <Text style={styles.emptyText}>Menu context not available.</Text>
      </View>
    );
  }

  const handleAdd = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Error', 'Name and price are required.');
      return;
    }

    const newItem: Omit<MenuItem, 'id'> = {
      name,
      description,
      price: parseFloat(price),
      course,
    };

    ctx.addMenuItem(newItem);
    Alert.alert('Success', `${name} added to ${course}.`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Menu Item</Text>

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter item name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      <Text style={styles.label}>Price (R) *</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Course</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={course}
          onValueChange={(val) => setCourse(val as Course)}
          style={styles.picker}
        >
          {ctx.courses.map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    color: Colors.textPrimary,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  addButton: {
    marginTop: 24,
    backgroundColor: Colors.button,
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
