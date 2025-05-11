import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
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
  //const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Default to "All Categories"

  /* async function loadTodoItems() {
    const response = await getTodoItems();
    if (!isErrorResponse(response)) {
      setTodoItems(
        selectedCategory && selectedCategory !== ""
          ? response.filter(item => item.categoryGuid === selectedCategory)
          : response
      );
    }
  } */

  async function loadTodoItems(category: string | null | undefined = selectedCategory) {
    console.log("Loading Todos for category:", category);
    
    const response = await getTodoItems();
    if (!isErrorResponse(response)) {
      const filteredItems = category
        ? response.filter(item => item.categoryGuid === category)
        : response; // Wenn `selectedCategory` leer ist, alle Todos laden

      setTodoItems(filteredItems);
      console.log("Selected Category:", selectedCategory);
      //console.log("Filtered Items:", filteredItems);
    } else {
      console.error("Error loading Todos:", response.message);
    }
  }

  async function loadCategories() {
    const response = await getCategories();
    if (!isErrorResponse(response)) {
      setCategories(response);
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
            selectedValue={selectedCategory ?? ""}
            //onValueChange={(value) => setSelectedCategory(value)}
            /* onValueChange={(value) => {
                console.log("Picker Value Changed:", value);
                setSelectedCategory(value);
                //loadTodoItems(value);
            }} */

            onValueChange={(value) => {
                console.log("Picker Value Changed:", value);
                setSelectedCategory(value);
            
                // Explicitly reload all Todos when "All Categories" is selected
                if (value === "") {
                  loadTodoItems(null); // Pass null to load all Todos
                } else {
                  loadTodoItems(value); // Load Todos for the selected category
                }
            }}

            style={styles.picker}
            mode="dialog"  // Verwende "dialog" für Android, falls "dropdown" Probleme macht
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
