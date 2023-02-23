import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundImage, Button } from "@rneui/base";
import { Icon } from "@rneui/themed";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RowComponent from "../Components/RowComponent";
const dimensions = Dimensions.get("window");

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState(null);
  const fetchData = async () => {
    let data = await AsyncStorage.getItem("data");
    setHistoryData(JSON.parse(data));
    console.log(JSON.parse(data));
  };
  const refArr = Array.from(
    { length: historyData !== null ? historyData?.numbers.length : 0 },
    (_, index) => index + 0
  );
  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const clearAsyncData = async () => {
    setHistoryData(null);
    await AsyncStorage.removeItem("data");
    fetchData();
  };

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Are you sure 😲",
      "This will delete your history permanently 😢",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => clearAsyncData() },
      ]
    );

  return (
    <BackgroundImage
      source={require("../assets/bg2.jpeg")}
      resizeMode="cover"
      style={styles.image}
      onPress={() => Keyboard.dismiss()}
    >
      <SafeAreaView className="p-4">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.goBack()}
          style={{ width: "30%" }}
        >
          <Ionicons
            name="arrow-back-circle"
            className="text-gray-400"
            size={35}
          />
          <Text className="text-gray-400">Home</Text>
        </TouchableOpacity>
        <View>
          <ScrollView
            // stickyHeaderIndices={[1]}
            showsVerticalScrollIndicator={false}
            style={styles.table}
            className="pt-4"
          >
            <View style={styles.header}>
              <RowComponent
                val1="Number"
                val2="Base"
                val3="Conver"
                val4="Value"
              />
            </View>

            <View style={styles.content}>
              {historyData !== null &&
                refArr.map((data, index) => {
                  return (
                    <RowComponent
                      key={index}
                      val1={historyData?.numbers[index]}
                      val2={historyData?.bases[index]}
                      val3={historyData?.converts[index]}
                      val4={historyData?.answers[index]}
                    />
                  );
                })}
            </View>
          </ScrollView>
        </View>
        <View style={styles.clearBtn}>
          <Button onPress={createTwoButtonAlert} size="sm" color="error">
            Clear All
          </Button>
        </View>
      </SafeAreaView>
    </BackgroundImage>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  header: { position: "sticky" },
  content: { marginBottom: 50 },
  table: {
    height: dimensions.height - 120,
    textAlign: "center",
  },
  image: {
    flex: 1,
  },

  clearBtn: {
    marginTop: 5,
    width: 100,
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
});
