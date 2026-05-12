import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../assets/theme";

const AddBlogForm = () => {
  const dataCategory = [
    { id: 1, name: "Food" },
    { id: 2, name: "Sports" },
    { id: 3, name: "Technology" },
    { id: 4, name: "Fashion" },
    { id: 5, name: "Health" },
    { id: 6, name: "Lifestyle" },
    { id: 7, name: "Music" },
    { id: 8, name: "Car" },
  ];

  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    category: {},
    totalLikes: 0,
    totalComments: 0,
  });

  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setBlogData({
      ...blogData,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.black()} variant="Linear" size={24} />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Write blog</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 10,
          gap: 10,
        }}
      >
        <View style={textInput.borderDashed}>
          <TextInput
            placeholder="Title"
            value={blogData.title}
            onChangeText={(text) => handleChange("title", text)}
            placeholderTextColor={colors.orange(0.6)}
            multiline
            style={textInput.title}
          />
        </View>

        <View style={[textInput.borderDashed, { minHeight: 250 }]}>
          <TextInput
            placeholder="Content"
            value={blogData.content}
            onChangeText={(text) => handleChange("content", text)}
            placeholderTextColor={colors.orange(0.6)}
            multiline
            style={textInput.content}
          />
        </View>

        <View style={textInput.borderDashed}>
          <TextInput
            placeholder="Image"
            value={image}
            onChangeText={(text) => setImage(text)}
            placeholderTextColor={colors.orange(0.6)}
            style={textInput.content}
          />
        </View>

        <View style={textInput.borderDashed}>
          <Text style={category.title}>Category</Text>
          <View style={category.container}>
            {dataCategory.map((item, index) => {
              const bgColor =
                item.id === blogData.category.id
                  ? colors.black()
                  : colors.orange(0.08);
              const color =
                item.id === blogData.category.id
                  ? colors.green()
                  : colors.orange();

              return (
                <Pressable
                  key={index}
                  onPress={() =>
                    handleChange("category", { id: item.id, name: item.name })
                  }
                  style={({ pressed }) => [
                    category.item,
                    { backgroundColor: bgColor, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[category.name, { color: color }]}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => {}}
        >
          <Text style={styles.buttonLabel}>Upload</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AddBlogForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green(),
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    elevation: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontFamily: "Pjs-Bold",
    fontSize: 16,
    color: colors.black(),
  },
  bottomBar: {
    backgroundColor: colors.green(),
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 10,
    elevation: 5,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.blue(),
    borderRadius: 20,
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: "Pjs-SemiBold",
    color: colors.green(),
  },
});

const textInput = StyleSheet.create({
  borderDashed: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: colors.orange(0.4),
  },
  title: {
    fontSize: 16,
    fontFamily: "Pjs-SemiBold",
    color: colors.black(),
    padding: 0,
  },
  content: {
    fontSize: 12,
    fontFamily: "Pjs-Regular",
    color: colors.black(),
    padding: 0,
  },
});

const category = StyleSheet.create({
  title: {
    fontSize: 12,
    fontFamily: "Pjs-Regular",
    color: colors.orange(0.6),
  },
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
  },
  name: {
    fontSize: 10,
    fontFamily: "Pjs-Medium",
  },
});
