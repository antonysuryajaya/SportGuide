import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Pressable, // Clean up: you can merge Pressable here too!
} from "react-native";
import { Settings, Edit } from "lucide-react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { ProfileData } from "../data/profiledata";
import { BlogList } from "../data/blogs";
import ItemSmall from "../components/ItemSmall";
import { colors } from "../../assets/theme";
import { formatNumber } from "../utils/formatNumber";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../libs/supabase";
import { useActionSheet } from "@expo/react-native-action-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Keep this one!
import { formatDate } from "../utils/formatDate";


const data = BlogList.slice(5);

const Profile = () => {
  // 1. Declare hooks right at the top
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  // 2. Initialize as an object since .single() returns an object
  const [profileData, setProfileData] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem("userData");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const openActionSheet = () => {
    const options = ["Log out", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          handleLogout();
        }
      }
    );
  };

  const getDataProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id) 
          .single(); 

        if (error) throw error;
        setProfileData(data || {}); 
      }
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDataBlog = async () => {
    try {
      const { data, error } = await supabase.from("blogs").select("*");
      if (error) throw error;
      setBlogData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDataProfile();
    getDataBlog();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getDataProfile();
      getDataBlog();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openActionSheet}>
          <Settings color={colors.black()} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileHeader}>
          {profileData.photo_url && (
            <Image
              style={profile.pic}
              source={{
                uri: profileData.photo_url,
                headers: { Authorization: "someAuthToken" },
              }}
              contentFit="cover"
              transition={200}
              priority="high"
            />
          )}

          <View style={{ gap: 5, alignItems: "center" }}>
            <Text style={profile.name}>{profileData.full_name || "Anonymous"}</Text>
            <Text style={profile.info}>
              Member since {profileData.created_at ? formatDate(profileData.created_at) : "--"}
            </Text>
          </View>

          <View style={profile.statsContainer}>
            <View style={profile.statItem}>
              <Text style={profile.sum}>{profileData.total_post || 0}</Text>
              <Text style={profile.tag}>Posted</Text>
            </View>
            <View style={profile.statItem}>
              <Text style={profile.sum}>
                {formatNumber(profileData.following_count || 0)}
              </Text>
              <Text style={profile.tag}>Following</Text>
            </View>
            <View style={profile.statItem}>
              <Text style={profile.sum}>
                {formatNumber(profileData.followers_count || 0)}
              </Text>
              <Text style={profile.tag}>Follower</Text>
            </View>
          </View>

          <TouchableOpacity style={profile.buttonEdit}>
            <Text style={profile.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.blogList}>
          {loading ? (
            <ActivityIndicator size={"large"} color={colors.blue()} />
          ) : blogData.length > 0 ? (
            blogData.map((item, index) => <ItemSmall item={item} key={index} />)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
        onPress={() => navigation.navigate("AddBlog")}
      >
        <Edit color={colors.green()} size={20} />
      </Pressable>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green(),
  },
  header: {
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    marginTop: 16,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  profileHeader: {
    gap: 15,
    alignItems: "center",
  },
  blogList: {
    paddingVertical: 10,
    gap: 10,
  },
  floatingButton: {
    backgroundColor: colors.blue(),
    padding: 15,
    position: "absolute",
    bottom: 24,
    right: 24,
    borderRadius: 10,
    shadowColor: colors.blue(),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

const profile = StyleSheet.create({
  pic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    color: colors.black(),
    fontSize: 20,
    fontFamily: "Pjs-Bold",
    textTransform: "capitalize",
  },
  info: {
    fontSize: 12,
    fontFamily: "Pjs-Regular",
    color: colors.orange(),
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    alignItems: "center",
    gap: 5,
  },
  sum: {
    fontSize: 16,
    fontFamily: "Pjs-SemiBold",
    color: colors.black(),
  },
  tag: {
    fontSize: 14,
    fontFamily: "Pjs-Regular",
    color: colors.orange(0.5),
  },
  buttonEdit: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.orange(0.1),
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "Pjs-SemiBold",
    color: colors.black(),
  },
});
