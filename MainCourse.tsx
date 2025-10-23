import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import Colors from './assets/Theme/Colors';
import { MenuContext } from './App';

export default function MainCourse({ navigation }: any) {
  const ctx = React.useContext(MenuContext);

  if (!ctx) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Main Courses</Text>
        <Text style={styles.emptyText}>Menu context not available.</Text>
      </View>
    );
}

const items = ctx.getItemsByCourse('Mains');
const avgMains = items.length ? items.reduce((s: number, i: any) => s + i.price, 0) / items.length : 0;

const handleRemove = (id: string) => {
    Alert.alert('Remove item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => ctx.removeMenuItem(id),
      },
    ]);
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.item}>
        {/* thumbnail / image area */}
        <View style={styles.thumbWrap}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.thumb} />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Text style={styles.thumbText}>No image</Text>
            </View>
          )}
        </View>

        {/* main info */}
        <View style={styles.info}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.itemDesc}>{item.description}</Text>
          ) : null}
          <Text style={styles.itemPrice}>R{Number(item.price).toFixed(2)}</Text>
        </View>

        {/* actions */}
        <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Main Courses</Text>

      <Text style={styles.sub}>
        Total mains: <Text style={styles.count}>{items.length}</Text>
      </Text>

      <Text style={styles.avg}>Average price (Mains): R{avgMains.toFixed(2)}</Text>

      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No main courses yet.</Text>}
        renderItem={renderItem}
        contentContainerStyle={items.length === 0 ? { flex: 1 } : undefined}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddItem' /* create this later */)}
      >
        <Text style={styles.addText}>Add New Main Course</Text>
      </TouchableOpacity>
    </View>
  );
}

const THUMB_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sub: {
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  count: {
    color: Colors.primary,
    fontWeight: '700',
  },
  avg: {
    marginBottom: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  thumbPlaceholder: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbText: {
    fontSize: 10,
    color: Colors.textPrimary,
  },
  info: {
    flex: 1,
  },
  itemName: {
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  itemDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  itemPrice: {
    marginTop: 6,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  removeButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.accent,
  },
  removeText: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: Colors.button,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  addText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});

