import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// Each dish has name, description, course, and price
interface Dish {
  id: string;
  name: string;
  description: string;
  course: string;
  price: string;
}

export default function DishListApp() {
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("Starter");
  const [price, setPrice] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]);

  // Add a new dish
  const addDish = () => {
    if (!dishName || !price) return;
    const newDish: Dish = {
      id: Date.now().toString(),
      name: dishName.trim(),
      description: description.trim(),
      course,
      price: price.trim(),
    };
    setDishes((prev) => [...prev, newDish]);
    // Reset form
    setDishName("");
    setDescription("");
    setCourse("Starter");
    setPrice("");
  };

  // Remove a dish by tapping on it
  const removeDish = (id: string) => {
    setDishes((prev) => prev.filter((dish) => dish.id !== id));
  };

  // Sorting order definition (so “Starters” always appear first, etc.)
  const order = ["Starter", "Main Course", "Dessert", "Drink"];

  // Sort dishes in display order + count how many are in each category
  const { sortedDishes, categoryCounts } = useMemo(() => {
    // Sort dishes by course order
    const sorted = [...dishes].sort(
      (a, b) => order.indexOf(a.course) - order.indexOf(b.course)
    );

    // Count per category
    const counts = {
      Starter: 0,
      "Main Course": 0,
      Dessert: 0,
      Drink: 0,
    };
    sorted.forEach((dish) => counts[dish.course as keyof typeof counts]++);

    return { sortedDishes: sorted, categoryCounts: counts };
  }, [dishes]);

  // Calculate total dishes (just length of array)
  const totalDishes = dishes.length;

  // Render each dish card
  const renderDish = ({ item }: { item: Dish }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => removeDish(item.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>R{item.price}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.course}>{item.course}</Text>
      <Text style={styles.tapHint}>Tap to delete</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>🍽️ Cristoffel Private Chef's</Text>

        {/* 📋 Dish entry form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Dish Name"
            value={dishName}
            onChangeText={setDishName}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={course}
              onValueChange={setCourse}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Starter" value="Starter" />
              <Picker.Item label="Main Course" value="Main Course" />
              <Picker.Item label="Dessert" value="Dessert" />
              <Picker.Item label="Drink" value="Drink" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <TouchableOpacity style={styles.addButton} onPress={addDish}>
            <Text style={styles.addButtonText}>➕ Add Dish</Text>
          </TouchableOpacity>
        </View>

        {/*Total + Category breakdown */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>Total Dishes:</Text>
          <Text style={styles.counterNumber}>{totalDishes}</Text>
        </View>

        {/* 🧮 Category Counters */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>
            🥗 Starters: <Text style={styles.categoryCount}>{categoryCounts.Starter}</Text>
          </Text>
          <Text style={styles.categoryText}>
            🍝 Mains: <Text style={styles.categoryCount}>{categoryCounts["Main Course"]}</Text>
          </Text>
          <Text style={styles.categoryText}>
            🍰 Desserts: <Text style={styles.categoryCount}>{categoryCounts.Dessert}</Text>
          </Text>
          <Text style={styles.categoryText}>
            🍹 Drinks: <Text style={styles.categoryCount}>{categoryCounts.Drink}</Text>
          </Text>
        </View>

        <Text style={styles.subtitle}>📋 Added Dishes</Text>

        {/* 🧾 Display sorted dishes */}
        {sortedDishes.length === 0 ? (
          <Text style={styles.emptyText}>No dishes added yet 🍛</Text>
        ) : (
          <FlatList
            data={sortedDishes}
            renderItem={renderDish}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 💅 Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fdfdfd",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#fdfdfd",
    height: 60,
    justifyContent: "center",
  },
  picker: {
    fontSize: 18,
    height: 60,
    width: "100%",
    color: "grey",
  },
  pickerItem: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  counterLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  counterNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  categoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 2,
  },
  categoryCount: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  price: {
    fontWeight: "bold",
    color: "#007AFF",
    fontSize: 16,
  },
  description: {
    color: "#666",
    marginTop: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  course: {
    fontStyle: "italic",
    color: "#555",
  },
  tapHint: {
    marginTop: 5,
    fontSize: 12,
    color: "#aaa",
    textAlign: "right",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
    fontStyle: "italic",
    fontSize: 16,
  },
});
