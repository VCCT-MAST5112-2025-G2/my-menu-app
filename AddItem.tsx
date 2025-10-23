// screens/AddItem.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from './assets/Theme/Colors';
import { MenuContext, Course } from './App';
import { useNavigation } from '@react-navigation/native';




export default function AddItem() {
  const ctx = React.useContext(MenuContext);
  const navigation = useNavigation();

  if (!ctx) return null;

  const { courses, addMenuItem } = ctx;

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(''); // keep as string while typing
  const [course, setCourse] = React.useState<Course>(courses[0]);
  const [imageUri, setImageUri] = React.useState<string | undefined>(undefined);
  const [loadingPermission, setLoadingPermission] = React.useState(false);
  const [loadingPick, setLoadingPick] = React.useState(false);

  // Request permission (for iOS & Android)
  const ensurePermission = async () => {
    setLoadingPermission(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setLoadingPermission(false);
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need permission to access your photos.');
        return false;
      }
      return true;
    } catch (err) {
      setLoadingPermission(false);
      Alert.alert('Permission error', 'Failed to request permission.');
      return false;
    }
  };

  const pickImage = async () => {
    // prevent concurrent calls
    if (loadingPick) return;
    setLoadingPick(true);

    const ok = await ensurePermission();
    if (!ok) {
      setLoadingPick(false);
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });

      /**
       * result shapes vary by SDK:
       * - Newer SDKs: { canceled: boolean, assets: [{ uri, ... }] }
       * - Older SDKs: { cancelled: boolean, uri: '...' }
       */
      if ((result as any).canceled === false && (result as any).assets && (result as any).assets.length > 0) {
        setImageUri((result as any).assets[0].uri);
      } else if ((result as any).cancelled === false && (result as any).uri) {
        setImageUri((result as any).uri);
      } else {
        // user cancelled - do nothing
      }
    } catch (err) {
      Alert.alert('Image error', 'Could not open image picker.');
    } finally {
      setLoadingPick(false);
    }
  };

  const handleAdd = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter a dish name.');
      return;
    }

    const cleaned = price.trim();
    const parsedPrice = parseFloat(cleaned);
    if (cleaned === '' || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Validation', 'Please enter a valid price (e.g. 120.00).');
      return;
    }

    // Add item
    addMenuItem({
      name: name.trim(),
      description: description.trim() || undefined,
      course,
      price: parsedPrice,
      imageUri,
    });

    // Clear & go back
    setName('');
    setDescription('');
    setPrice('');
    setImageUri(undefined);

    // Quick code to be able to navigate back
    try {
      (navigation as any).goBack();
    } catch {
      (navigation as any).navigate?.('Home');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Menu Item</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Grilled Salmon"
        style={styles.input}
        returnKeyType="done"
        accessibilityLabel="Dish name"
      />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Short description"
        style={[styles.input, styles.multiline]}
        multiline
        numberOfLines={3}
        accessibilityLabel="Description"
      />

      <Text style={styles.label}>Course</Text>
      <View style={styles.pickerRow}>
        {courses.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.courseButton, course === c && styles.courseButtonActive]}
            onPress={() => setCourse(c)}
            accessibilityLabel={`Choose ${c}`}
          >
            <Text style={[styles.courseText, course === c && styles.courseTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Price (R)</Text>
      <TextInput
        value={price}
        onChangeText={(t) => setPrice(t.replace(/[^0-9.]/g, ''))}
        placeholder="e.g. 120.00"
        style={styles.input}
        keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
        accessibilityLabel="Price"
      />

      <Text style={styles.label}>Image (optional)</Text>

      <View style={styles.imageRow}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Text style={styles.placeholderText}>No image chosen</Text>
          </View>
        )}

        <View style={styles.imageButtons}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={pickImage}
            accessibilityLabel="Choose photo"
            disabled={loadingPick || loadingPermission}
          >
            {loadingPick ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.smallButtonText}>Choose Photo</Text>}
          </TouchableOpacity>

          {imageUri ? (
            <TouchableOpacity
              style={[styles.smallButton, { backgroundColor: Colors.accent }]}
              onPress={() => setImageUri(undefined)}
              accessibilityLabel="Remove chosen photo"
            >
              <Text style={styles.smallButtonText}>Remove</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addButton, (loadingPick || loadingPermission) && { opacity: 0.7 }]}
        onPress={handleAdd}
        accessibilityLabel="Add menu item"
        disabled={loadingPick || loadingPermission}
      >
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  label: {
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E6E6E6',
  },
  multiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  pickerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  courseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: 8,
  },
  courseButtonActive: {
    backgroundColor: Colors.primary,
  },
  courseText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  courseTextActive: {
    color: Colors.white,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  preview: {
    width: 100,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 12,
  },
  previewPlaceholder: {
    width: 100,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeholderText: {
    color: Colors.textPrimary,
    fontSize: 12,
    textAlign: 'center',
  },
  imageButtons: {
    flex: 1,
    justifyContent: 'space-between',
  },
  smallButton: {
    backgroundColor: Colors.button,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    color: Colors.white,
    fontWeight: '700',
  },
  addButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
