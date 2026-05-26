import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../assets/theme";
import { useNavigation } from "@react-navigation/native";

// Fixed: Added the missing AsyncStorage import
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem("userData");
      
      // Cleaned up nesting: If there's no data, route straight to Login
      if (!userDataJSON) {
        navigateTo("Login");
        return;
      }

      const userData = JSON.parse(userDataJSON);
      const { token, expires } = userData;
      const currentTime = new Date().getTime();

      // Check if token exists and is still valid
      if (token && expires && currentTime <= expires) {
        navigateTo("MainApp");
      } else {
        navigateTo("Login");
      }
    } catch (error) {
      console.error("Error retrieving token data:", error);
      navigateTo("Login");
    }
  };

  // Helper function to handle delayed navigation cleanly
  const navigateTo = (screenName) => {
    setTimeout(() => {
      navigation.replace(screenName);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SportGuide</Text>
      <View style={styles.infoContainer}>
        <Text style={[styles.info, { fontFamily: "Pjs-Regular" }]}>
          Presented By
        </Text>
        <Text
          style={[
            styles.info,
            { fontFamily: "Pjs-SemiBold", textAlign: "center" },
          ]}
        >
          Antony Suryajaya
        </Text>
        <Text
          style={[
            styles.info,
            { fontFamily: "Pjs-SemiBold", textAlign: "center" },
          ]}
        >
          Laboratory
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green(),
    justifyContent: "center",
  },
  logo: {
    fontSize: 48,
    fontFamily: "Pjs-ExtraBold",
    color: colors.black(),
    alignSelf: "center",
  },
  infoContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
  },
  info: {
    fontSize: 12,
    color: colors.orange(0.6),
  },
});