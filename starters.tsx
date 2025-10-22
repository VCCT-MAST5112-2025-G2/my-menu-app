
import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { MenuContext } from '../App';

export default function Starters() {
  const ctx = React.useContext(MenuContext);
  if (!ctx) return null;
  const items = ctx.getItemsByCourse('Starters');

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18 }}>Starters</Text>
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>
            <Text>{item.name} — R{item.price}</Text>
            <Button title="Remove" onPress={() => ctx.removeMenuItem(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No starters yet</Text>}
      />
    </View>
  );
}
