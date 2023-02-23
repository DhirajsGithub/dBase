import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useLayoutEffect } from "react";
import gif from "../assets/starting.gif";
import { useNavigation } from "@react-navigation/native";

const dimensions = Dimensions.get("screen");

const LoadingScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../assets/starting.gif")}
      style={styles.container}
    >
      <TouchableOpacity>
        <Text className="text-gray-300">Loading...</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 232,
    height: dimensions.height,
    width: dimensions.width,
  },
});
