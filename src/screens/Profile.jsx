import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Settings } from "lucide-react-native";
import { Image } from "expo-image";
import { ProfileData } from "../data/profiledata";
import { BlogList } from "../data/blogs";
import ItemSmall from "../components/ItemSmall";
import { colors } from "../../assets/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const formatNumber = (number) => {
  if (!number) return "0";
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

const data = BlogList.slice(5);

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Settings color={colors.black()} size={24} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <Image
            style={profile.pic}
            source={{
              uri: ProfileData.profilePict,
              headers: { Authorization: "someAuthToken" },
            }}
            contentFit="cover"
            transition={200}
            priority="high"
          />

          <View style={{ gap: 5, alignItems: "center" }}>
            <Text style={profile.name}>{ProfileData.name}</Text>
            <Text style={profile.info}>
              Member since {ProfileData.createdAt}
            </Text>
          </View>

          <View style={profile.statsContainer}>
            <View style={profile.statItem}>
              <Text style={profile.sum}>{ProfileData.blogPosted}</Text>
              <Text style={profile.tag}>Posted</Text>
            </View>
            <View style={profile.statItem}>
              <Text style={profile.sum}>
                {formatNumber(ProfileData.following)}
              </Text>
              <Text style={profile.tag}>Following</Text>
            </View>
            <View style={profile.statItem}>
              <Text style={profile.sum}>
                {formatNumber(ProfileData.follower)}
              </Text>
              <Text style={profile.tag}>Follower</Text>
            </View>
          </View>

          <TouchableOpacity style={profile.buttonEdit}>
            <Text style={profile.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.blogList}>
          {data.map((item, index) => (
            <ItemSmall item={item} key={index} />
          ))}
        </View>
      </ScrollView>
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
  },
  scrollContent: {
    paddingVertical: 20,
    gap: 10,
  },
  profileHeader: {
    gap: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  blogList: {
    paddingVertical: 10,
    gap: 10,
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
    gap: 30,
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
    gap: 2,
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
