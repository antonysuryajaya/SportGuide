import { StyleSheet, Text, View, Animated, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useState, useRef } from "react";
import { ArrowLeft, Heart, Bookmark, MessageCircle, Share2, MoreVertical } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { BlogList } from "../data/blogs";
import { Image } from "expo-image";
import { colors } from "../../assets/theme";

const formatNumber = (number) => {
  if (number >= 1000000000) return (number / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  if (number >= 1000000) return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (number >= 1000) return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return number.toString();
};

const BlogDetail = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { blogId } = route.params;
  const selectedBlog = BlogList.find((blog) => blog.id === blogId);

  // --- ANIMATION LOGIC ---
  const scrollY = useRef(new Animated.Value(0)).current;
  // diffClamp memastikan nilai berada di rentang 0-52 (tinggi header)
  const diffClampY = Animated.diffClamp(scrollY, 0, 52);

  const headerY = diffClampY.interpolate({
    inputRange: [0, 52],
    outputRange: [0, -70], // Geser lebih jauh agar benar-benar hilang dari view
  });

  const bottomBarY = diffClampY.interpolate({
    inputRange: [0, 52],
    outputRange: [0, 100], // Sembunyikan ke bawah
  });

  // --- STATE ---
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!selectedBlog) return null;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            transform: [{ translateY: headerY }],
            paddingTop: insets.top + 8, // Adaptasi dengan notch HP
            height: 52 + insets.top 
          }
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={colors.orange(0.6)} size={24} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Share2 color={colors.orange(0.6)} size={24} />
          <MoreVertical color={colors.orange(0.6)} size={24} />
        </View>
      </Animated.View>

      {/* CONTENT */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} // PENTING: Untuk animasi halus
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 62 + insets.top, // Jarak agar konten tidak tertutup header
          paddingBottom: 100 + insets.bottom,
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
      </Animated.ScrollView>

      {/* BOTTOM BAR */}
      <Animated.View 
        style={[
          styles.bottomBar, 
          { 
            transform: [{ translateY: bottomBarY }],
            paddingBottom: insets.bottom + 14 // Adaptasi dengan home indicator (iPhone)
          }
        ]}
      >
        <View style={styles.interactionItem}>
          <TouchableOpacity onPress={() => setLiked(!liked)}>
            <Heart
              color={liked ? colors.blue() : colors.orange(0.6)}
              fill={liked ? colors.blue() : "none"}
              size={24}
            />
          </TouchableOpacity>
          <Text style={styles.info}>{formatNumber(selectedBlog.totalLikes)}</Text>
        </View>

        <View style={styles.interactionItem}>
          <MessageCircle color={colors.orange(0.6)} size={24} />
          <Text style={styles.info}>{formatNumber(selectedBlog.totalComments)}</Text>
        </View>

        <TouchableOpacity onPress={() => setBookmarked(!bookmarked)}>
          <Bookmark
            color={bookmarked ? colors.blue() : colors.orange(0.6)}
            fill={bookmarked ? colors.blue() : "none"}
            size={24}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
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
    position: "absolute",
    zIndex: 1000,
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.green(),
    // Tambahkan sedikit shadow agar header terlihat saat konten scroll di bawahnya
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    height: 240, // Sedikit lebih tinggi agar proporsional
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
    fontSize: 12,
    fontWeight: "600",
  },
  category: {
    color: colors.blue(),
    fontSize: 12,
    fontWeight: "600",
  },
  date: {
    color: colors.orange(0.6),
    fontSize: 10,
  },
  title: {
    fontSize: 20, // Lebih besar agar menonjol
    fontWeight: "bold",
    color: colors.black(),
    marginTop: 10,
  },
  content: {
    color: colors.orange(),
    fontSize: 14,
    lineHeight: 24,
    marginTop: 15,
    textAlign: "justify",
  },
});