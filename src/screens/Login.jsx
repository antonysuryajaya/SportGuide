import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors, fontType } from "../../assets/theme";
import { Eye, EyeOff } from "lucide-react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoginDisabled, setLoginDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    setTimeout(()=>{
        navigation.navigate("MainApp");
    },1500)
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const updateLoginButtonStatus = () => {
    if (email.trim() && password.trim()) {
      setLoginDisabled(false);
    } else {
      setLoginDisabled(true);
    }
  };
  useEffect(() => {
    updateLoginButtonStatus();
  }, [email, password]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.green() }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View>
            <Text style={styles.header}>Log in</Text>
            <Text style={styles.caption}>
              Let’s log in to your account and roll in to SportGuide!
            </Text>
            <View style={styles.form}>
              <View>
                <Text style={textinput.label}>Email</Text>
                <View style={textinput.container}>
                  <TextInput
                    placeholder="Enter your email address"
                    placeholderTextColor={colors.orange(0.6)}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      updateLoginButtonStatus();
                    }}
                    inputMode="email"
                    keyboardType="email-address"
                    style={textinput.text}
                  />
                </View>
              </View>
              <View>
                <Text style={textinput.label}>Password</Text>
                <View
                  style={[
                    textinput.container,
                    {
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 10,
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Enter password"
                    placeholderTextColor={colors.orange(0.6)}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      updateLoginButtonStatus();
                    }}
                    secureTextEntry={!passwordVisible}
                    style={[textinput.text, { flex: 1 }]}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    {passwordVisible ? (
                      <Eye
                        variant="Linear"
                        color={colors.orange(0.6)}
                        size={20}
                      />
                    ) : (
                      <EyeOff
                        variant="Linear"
                        color={colors.orange(0.6)}
                        size={20}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            <TouchableHighlight
              style={[
                button.container,
                {
                  backgroundColor: isLoginDisabled
                    ? colors.blue(0.5)
                    : colors.blue(),
                },
              ]}
              underlayColor={colors.blue(0.9)}
              onPress={handleLogin}
              disabled={isLoginDisabled}
            >
              {loading ? (
                <ActivityIndicator color={colors.green()} />
              ) : (
                <Text style={button.label}>LOG IN</Text>
              )}
            </TouchableHighlight>
            <View style={{ flexDirection: "row", gap: 5, alignSelf: "center" }}>
              <Text style={[button.label, { color: colors.black() }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={[button.label, { color: colors.blue() }]}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green(),
    paddingHorizontal: 24,
    paddingVertical: 60,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 32,
    fontFamily: "Pjs-ExtraBold",
    color: colors.black(),
  },
  caption: {
    fontFamily: "Pjs-Regular",
    color: colors.orange(0.6),
    fontSize: 14,
    marginTop: 5,
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
});
const textinput = StyleSheet.create({
  label: {
    fontFamily: "Pjs-Medium",
    fontSize: 14,
    color: colors.orange(0.6),
    marginBottom: 5,
  },
  container: {
    backgroundColor: colors.orange(0.05),
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  text: {
    paddingVertical: 0,
    color: colors.black(),
    fontFamily: "Pjs-Regular",
  },
});
const button = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  label: {
    color: colors.green(),
    fontSize: 14,
    fontFamily: "Pjs-SemiBold",
  },
});
