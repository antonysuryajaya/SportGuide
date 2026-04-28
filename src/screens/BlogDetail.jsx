import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  MoreVertical,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { BlogList } from "../data/blogs";
import { Image } from "expo-image";
import { colors } from "../../assets/theme";

const formatNumber = (number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return number.toString();
};

const BlogDetail = ({ route }) => {
  const { blogId } = route.params;
  const [iconStates, setIconStates] = useState({
    liked: { variant: "Linear", color: colors.orange(0.6) },
    bookmarked: { variant: "Linear", color: colors.orange(0.6) },
  });

  const selectedBlog = BlogList.find((blog) => blog.id === blogId);
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

  if (!selectedBlog) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.orange(0.6)} size={24} />
        </TouchableOpacity>
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 20 }}
        >
          <Share2 color={colors.orange(0.6)} size={24} />
          <MoreVertical color={colors.orange(0.6)} size={24} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 62,
          paddingBottom: 80,
        }}
      >
        <Image
          style={styles.image}
          source={{ uri: selectedBlog.image }}
          contentFit="cover"
          transition={500}
        />

        <View style={styles.metaContainer}>
          <Text style={styles.category}>{selectedBlog.category}</Text>
          <Text style={styles.date}>{selectedBlog.createdAt}</Text>
        </View>

        <Text style={styles.title}>{selectedBlog.title}</Text>
        <Text style={styles.content}>{selectedBlog.content}</Text>
      </ScrollView>

      <View style={styles.bottomBar}>
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
      </View>
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
});
