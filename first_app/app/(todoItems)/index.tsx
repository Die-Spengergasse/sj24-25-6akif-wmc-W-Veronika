import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '@/utils/todoItems/index.styles';
import { getTodoItems } from '@/utils/todoItems/apiClient';
import { getCategories } from '@/utils/categories/apiClient';
import { isErrorResponse } from '@/utils/apiClient';
import { TodoItem } from '@/types/TodoItem';
import { Category } from '@/types/Category';

export default function TodoItemsIndexScreen() {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  async function loadTodoItems() {
    const response = await getTodoItems();
    if (!isErrorResponse(response)) {
      setTodoItems(
        selectedCategory && selectedCategory !== ""
          ? response.filter(item => item.categoryGuid === selectedCategory)
          : response
      );
    } else {
      console.error("Fehler beim Laden der Todos:", response.message);
    }
  }

  async function loadCategories() {
    const response = await getCategories();
    if (!isErrorResponse(response)) {
      setCategories(response);
    } else {
      console.error("Fehler beim Laden der Kategorien:", response.message);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadTodoItems();
      loadCategories();
    }, [selectedCategory])
  );

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          style={styles.picker}
          mode="dialog"
        >
          <Picker.Item label="All Categories" value="" />
          {categories.map((category) => (
            <Picker.Item key={category.guid} label={category.name} value={category.guid} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={todoItems}
        keyExtractor={(item) => item.guid.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}