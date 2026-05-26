import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  MoreVertical,
  Edit,
  Trash,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { colors } from "../../assets/theme";
import { formatNumber } from "../utils/formatNumber";
import { formatDate } from "../utils/formatDate";
import { supabase } from "../libs/supabase";


const BlogDetail = ({ route }) => {
  const { blogId } = route.params;
  const [iconStates, setIconStates] = useState({
    liked: { variant: "Linear", color: colors.orange(0.6) },
    bookmarked: { variant: "Linear", color: colors.orange(0.6) },
  });
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    getBlogById();
  }, [blogId]);

  const getBlogById = async () => {
    try {
      const response = await supabase
        .from("blogs")
        .select("*")
        .eq("id", blogId)
        .single();
      setSelectedBlog(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const navigateEdit = (id) => {
    navigation.navigate("EditBlog", { blogId: id });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Blog",
      "Are you sure you want to delete this blog?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const { error } = await supabase
                .from("blogs")
                .delete()
                .eq("id", blogId);

              if (error) throw error;
              navigation.navigate("MainApp", { screen: "Profile" });
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete blog");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };


  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClampY = Animated.diffClamp(scrollY, 0, 52);
  const headerY = diffClampY.interpolate({
    inputRange: [0, 52],
    outputRange: [0, -52],
  });
  const bottomBarY = diffClampY.interpolate({
    inputRange: [0, 52],
    outputRange: [0, 52],
  });

  const navigation = useNavigation();

  const toggleIcon = (iconName) => {
    setIconStates((prevStates) => ({
      ...prevStates,
      [iconName]: {
        variant: prevStates[iconName].variant === "Linear" ? "Bold" : "Linear",
        color:
          prevStates[iconName].variant === "Linear"
            ? colors.blue()
            : colors.orange(0.6),
      },
    }));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.blue()} />
      </View>
    );
  }

  if (!selectedBlog) return null;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerY }] }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.orange(0.6)} size={24} />
        </TouchableOpacity>
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 20 }}
        >
          <Share2 color={colors.orange(0.6)} size={24} />
          <MoreVertical color={colors.orange(0.6)} size={24} onPress={openMenu} />
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 62,
          paddingBottom: 54,
        }}
      >
        <Image
          style={styles.image}
          source={{ uri: selectedBlog.image }}
          contentFit="cover"
          transition={500}
        />

        <View style={styles.metaContainer}>
          <Text style={styles.category}>
            {typeof selectedBlog.category === "object"
              ? selectedBlog.category.name
              : selectedBlog.category}
          </Text>
          <Text style={styles.date}>{formatDate(selectedBlog.createdAt)}</Text>
        </View>

        <Text style={styles.title}>{selectedBlog.title}</Text>
        <Text style={styles.content}>{selectedBlog.content}</Text>
      </Animated.ScrollView>

      <Animated.View
        style={[styles.bottomBar, { transform: [{ translateY: bottomBarY }] }]}
      >
        <View style={styles.interactionItem}>
          <TouchableOpacity onPress={() => toggleIcon("liked")}>
            <Heart
              color={iconStates.liked.color}
              fill={
                iconStates.liked.variant === "Bold"
                  ? iconStates.liked.color
                  : "none"
              }
              size={24}
            />
          </TouchableOpacity>
          <Text style={styles.info}>
            {formatNumber(selectedBlog.totalLikes)}
          </Text>
        </View>

        <View style={styles.interactionItem}>
          <MessageCircle color={colors.orange(0.6)} size={24} />
          <Text style={styles.info}>
            {formatNumber(selectedBlog.totalComments)}
          </Text>
        </View>

        <TouchableOpacity onPress={() => toggleIcon("bookmarked")}>
          <Bookmark
            color={iconStates.bookmarked.color}
            fill={
              iconStates.bookmarked.variant === "Bold"
                ? iconStates.bookmarked.color
                : "none"
            }
            size={24}
          />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={closeMenu}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                navigateEdit(selectedBlog.id);
              }}
            >
              <Edit color={colors.black()} size={20} />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                closeMenu();
                handleDelete();
              }}
            >
              <Trash color={colors.red()} size={20} />
              <Text style={[styles.menuText, { color: colors.red() }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default BlogDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green(),
  },
  header: {
    paddingHorizontal: 24,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingTop: 8,
    paddingBottom: 4,
    position: "absolute",
    zIndex: 1000,
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.green(),
  },
  bottomBar: {
    position: "absolute",
    zIndex: 1000,
    backgroundColor: colors.green(),
    paddingVertical: 14,
    paddingHorizontal: 60,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: colors.orange(0.1),
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 15,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  interactionItem: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  info: {
    color: colors.orange(0.6),
    fontFamily: "Pjs-SemiBold",
    fontSize: 12,
  },
  category: {
    color: colors.blue(),
    fontFamily: "Pjs-SemiBold",
    fontSize: 12,
  },
  date: {
    color: colors.orange(0.6),
    fontFamily: "Pjs-Medium",
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "Pjs-Bold",
    color: colors.black(),
    marginTop: 10,
  },
  content: {
    color: colors.orange(),
    fontFamily: "Pjs-Medium",
    fontSize: 12,
    lineHeight: 20,
    marginTop: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.green(),
    marginTop: 60,
    marginRight: 24,
    borderRadius: 10,
    padding: 8,
    width: 150,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontFamily: "Pjs-SemiBold",
    color: colors.black(),
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.orange(0.1),
    marginHorizontal: 8,
  },
});
