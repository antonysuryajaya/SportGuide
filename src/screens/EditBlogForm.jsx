import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { ArrowLeft, AddSquare, Add } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { supabase } from "../libs/supabase";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { SafeAreaView } from "react-native-safe-area-context";

const EditBlogForm = ({ route }) => {
  const { blogId } = route.params;
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
  const [oldImage, setOldImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setBlogData({
      ...blogData,
      [key]: value,
    });
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", blogId)
          .single();

        if (error) throw error;

        if (data) {
          const findCategory = dataCategory.find(
            (cat) => cat.name === data.category,
          );
          setBlogData({
            title: data.title,
            content: data.content,
            category: findCategory || { id: 0, name: data.category },
            totalLikes: data.totalLikes || 0,
            totalComments: data.totalComments || 0,
          });
          setOldImage(data.image);
          setImage(data.image);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        Alert.alert("Error", "Failed to fetch blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the gallery is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const manipulatedResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1920 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG },
      );
      setImage(manipulatedResult.uri);
    }
  };

  const handleUpdate = async () => {
    if (
      !blogData.title ||
      !blogData.content ||
      !blogData.category.name ||
      !image
    ) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    setLoading(true);
    try {
      let publicUrl = oldImage;

      if (image !== oldImage) {
        let filename = image.substring(image.lastIndexOf("/") + 1);
        const extension = filename.split(".").pop();
        const name = filename.split(".").slice(0, -1).join(".");
        filename = name + Date.now() + "." + extension;
        const response = await fetch(image);
        const arrayBuffer = await response.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from("woco")
          .upload(filename, arrayBuffer, {
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl: newUrl },
        } = supabase.storage.from("woco").getPublicUrl(filename);

        publicUrl = newUrl;
      }

      const { error } = await supabase
        .from("blogs")
        .update({
          title: blogData.title,
          category: blogData.category.name,
          image: publicUrl,
          content: blogData.content,
        })
        .eq("id", blogId);

      if (error) throw error;

      setLoading(false);
      navigation.navigate("BlogDetail", { blogId });
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Error", "Failed to update blog");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.black()} variant="Linear" size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Edit blog</Text>
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
        <View style={[textInput.borderDashed]}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Pjs-Regular",
              color: colors.orange(0.6),
            }}
          >
            Category
          </Text>
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
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    handleChange("category", { id: item.id, name: item.name })
                  }
                  style={[category.item, { backgroundColor: bgColor }]}
                >
                  <Text style={[category.name, { color: color }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {image ? (
          <View style={{ position: "relative" }}>
            <Image
              style={{ width: "100%", height: 127, borderRadius: 5 }}
              source={image}
              contentFit="cover"
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                backgroundColor: colors.blue(),
                borderRadius: 25,
              }}
              onPress={() => setImage(null)}
            >
              <Add
                size={20}
                variant="Linear"
                color={colors.green()}
                style={{ transform: [{ rotate: "45deg" }] }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleImagePick}>
            <View
              style={[
                textInput.borderDashed,
                {
                  gap: 10,
                  paddingVertical: 30,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <AddSquare color={colors.orange(0.6)} variant="Linear" size={42} />
              <Text
                style={{
                  fontFamily: "Pjs-Regular",
                  fontSize: 12,
                  color: colors.orange(0.6),
                }}
              >
                Upload Thumbnail
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonLabel}>Update</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.blue()} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditBlogForm;

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
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.blue(),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: "Pjs-SemiBold",
    color: colors.green(),
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black(0.4),
    justifyContent: "center",
    alignItems: "center",
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
