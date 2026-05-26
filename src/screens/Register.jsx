import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../assets/theme";
import { Eye, EyeOff } from "lucide-react-native";
import { supabase } from "../libs/supabase";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSignupDisabled, setSignupDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paddingVertical, setPaddingVertical] = useState(60);
  const navigation = useNavigation();

  const handleRegister = async () => {
    let errorMessage = "";

    if (password !== confirmPassword) {
      errorMessage = "Password dan konfirmasi password tidak cocok.";
    } else if (password.length < 8) {
      errorMessage = "Panjang kata sandi harus minimal 8 karakter.";
    } else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
      if (!passwordRegex.test(password)) {
        errorMessage = "Password harus mengandung kombinasi huruf dan angka.";
      }
    }

    if (errorMessage) {
      Alert.alert("Error", errorMessage);
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        { email, password },
      );
      if (signUpError) throw signUpError;

      const { error: insertError } = await supabase.from("users").upsert({
        id: authData.user.id,
        full_name: fullName,
        email: email,
        photo_url: `https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=2680&q=80`,
        followers_count: 0,
        following_count: 0,
        total_post: 0,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("User added!");

      setLoading(false);
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      console.log("Registration Error:", error);
      Alert.alert("Error", error.message);
    }
  };


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  const updateSignupButtonStatus = () => {
    if (
      fullName.trim() &&
      email.trim() &&
      password.trim() &&
      confirmPassword.trim()
    ) {
      setSignupDisabled(false);
    } else {
      setSignupDisabled(true);
    }
  };

  useEffect(() => {
    updateSignupButtonStatus();
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setPaddingVertical(0);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setPaddingVertical(60);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [fullName, email, password, confirmPassword]);
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.green() }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, { paddingVertical }]}>
            <View>
              <Text style={styles.header}>Sign up</Text>
              <Text style={styles.caption}>
                It’s never too late to join SportGuide, we welcome you!
              </Text>
              <View style={styles.form}>
                <View>
                  <Text style={textinput.label}>Full Name</Text>
                  <View style={textinput.container}>
                    <TextInput
                      placeholder="Enter full name"
                      placeholderTextColor={colors.orange(0.6)}
                      value={fullName}
                      onChangeText={(text) => {
                        setFullName(text);
                        updateSignupButtonStatus();
                      }}
                      style={textinput.text}
                    />
                  </View>
                </View>
                <View>
                  <Text style={textinput.label}>Email</Text>
                  <View style={textinput.container}>
                    <TextInput
                      placeholder="Enter your email address"
                      placeholderTextColor={colors.orange(0.6)}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        updateSignupButtonStatus();
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
                        updateSignupButtonStatus();
                      }}
                      secureTextEntry={!passwordVisible}
                      style={[textinput.text, { flex: 1 }]}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                      {passwordVisible ? (
                        <EyeOff
                          variant="Linear"
                          color={colors.orange(0.6)}
                          size={20}
                        />
                      ) : (
                        <Eye
                          variant="Linear"
                          color={colors.orange(0.6)}
                          size={20}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={textinput.label}>Confirm Password</Text>
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
                      placeholder="Re-type password"
                      placeholderTextColor={colors.orange(0.6)}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        updateSignupButtonStatus();
                      }}
                      secureTextEntry={!confirmPasswordVisible}
                      style={[textinput.text, { flex: 1 }]}
                    />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                      {confirmPasswordVisible ? (
                        <EyeOff
                          variant="Linear"
                          color={colors.orange(0.6)}
                          size={20}
                        />
                      ) : (
                        <Eye
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
                    backgroundColor: isSignupDisabled
                      ? colors.blue(0.5)
                      : colors.blue(),
                  },
                ]}
                underlayColor={colors.blue(0.9)}
                onPress={handleRegister}
                disabled={isSignupDisabled}
              >
                {loading ? (
                  <ActivityIndicator color={colors.green()} />
                ) : (
                  <Text style={button.label}>SIGN UP</Text>
                )}
              </TouchableHighlight>
              <View
                style={{ flexDirection: "row", gap: 5, alignSelf: "center" }}
              >
                <Text style={[button.label, { color: colors.black() }]}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={[button.label, { color: colors.blue() }]}>
                    Log in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green(),
    justifyContent: "space-between",
    paddingHorizontal: 24,
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
