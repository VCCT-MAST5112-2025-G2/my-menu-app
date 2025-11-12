import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Colors from './assets/Theme/Colors';
import { MenuContext, Course } from './App';

interface HomeProps {
  navigation: any;
}

export default function Home({ navigation }: HomeProps) {
  const ctx = React.useContext(MenuContext);

  // Helper to translate course name to route name in navigator
  const routeForCourse = (c: Course) => (c === 'Mains' ? 'MainCourse' : c);

  // InlineAdd component placed inside Home for simplicity
  function InlineAdd() {
    if (!ctx) return null;
    const { courses, addMenuItem } = ctx;

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [course, setCourse] = React.useState<Course>(courses[0]);

    const handleAdd = () => {
      if (!name.trim()) {
        Alert.alert('Validation', 'Please enter a dish name.');
        return;
      }
      const parsed = parseFloat(price);
      if (price.trim() === '' || Number.isNaN(parsed) || parsed < 0) {
        Alert.alert('Validation', 'Please enter a valid price (e.g. 120).');
        return;
      }

      addMenuItem({
        name: name.trim(),
        description: description.trim() || undefined,
        course,
        price: parsed,
      });

      // clear inputs
      setName('');
      setDescription('');
      setPrice('');
      setCourse(courses[0]);

      Alert.alert('Added', `${name} added to the menu`);
    };

    return (
      <View style={styles.inlineContainer}>
        <Text style={styles.inlineTitle}>Quick Add (Home)</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Dish name"
          style={styles.inlineInput}
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description (optional)"
          style={styles.inlineInput}
        />

        <TextInput
          value={price}
          onChangeText={(t) => setPrice(t.replace(/[^0-9.]/g, ''))}
          placeholder="Price (R)"
          keyboardType="numeric"
          style={styles.inlineInput}
        />

        <View style={styles.coursesRow}>
          {courses.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCourse(c)}
              style={[styles.courseBtn, course === c && styles.courseBtnActive]}
            >
              <Text style={course === c ? styles.courseTextActive : styles.courseText}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addText}>Add to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!ctx) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Menu</Text>
        <Text style={styles.emptyText}>Menu context not available.</Text>
      </View>
    );
  }

  const courses: Course[] = ctx.courses;
  const averages = ctx.getAveragePriceByCourse();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Menu</Text>

        <Text style={styles.sub}>Total items: {ctx.getTotalItems()}</Text>

        {/* Average prices per course */}
        <View style={styles.averagesRow}>
          {courses.map((c) => (
            <View key={c} style={styles.avgCard}>
              <Text style={styles.avgCourse}>{c}</Text>
              <Text style={styles.avgValue}>R{averages[c].toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Inline add form */}
        <InlineAdd />

        {/* Divider */}
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>View Menu Sections</Text>

        {/* Course navigation - side-by-side on wide screens, stacked on small */}
        <View style={styles.courseButtonsRow}>
          {courses.map((course) => (
            <TouchableOpacity
              key={course}
              style={styles.courseNavBtn}
              onPress={() => navigation.navigate(routeForCourse(course))}
            >
              <Text style={styles.courseNavText}>{course}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Full add item page */}
        <TouchableOpacity
          style={[styles.addButton, { marginTop: 16 }]}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Text style={styles.addText}>Open Full Add Item Page</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
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
    marginBottom: 12,
  },

  // averages
  averagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avgCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  avgCourse: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  avgValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // inline add form
  inlineContainer: {
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 16,
  },
  inlineTitle: {
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inlineInput: {
    backgroundColor: '#fafafa',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  coursesRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  courseBtn: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: Colors.white,
    marginRight: 8,
  },
  courseBtnActive: {
    backgroundColor: Colors.primary,
  },
  courseText: {
    color: Colors.textPrimary,
  },
  courseTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  addBtn: {
    backgroundColor: Colors.button,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  addText: {
    color: Colors.white,
    fontWeight: '700',
  },

  // divider & section
  divider: {
    height: 1,
    backgroundColor: '#d8d8d8',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },

  // course navigation - responsive friendly
  courseButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // no `gap` here (not supported in RN)
  },
  courseNavBtn: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  courseNavText: {
    color: Colors.white,
    fontWeight: '700',
  },

  // full add button
  addButton: {
    marginTop: 8,
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 24,
  },
});
