import {
  View,
  Text,
  Dimensions,
  TextInput,
  Device,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import logo from "../assets/dbase.png";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Icon } from "@rneui/themed";

import { basesData } from "../data/bases";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@rneui/base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../Components/LoadingScreen";
const dimension = Dimensions.get("window");

const HomeScreen = () => {
  const [number, setNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [baseVal, setBaseVal] = useState(null);
  const [convertVal, setConvertVal] = useState(null);
  const [backendData, setBackendData] = useState({});
  const [ans, setAns] = useState("NULL");
  const [loading, setLoading] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [retriveData, setRetirveData] = useState(null);

  const handleOnSubmit = () => {
    let newNum = "";
    for (let n of number) {
      newNum += n.toUpperCase();
    }
    setNumber(newNum);
    console.log(number);
    if (number.length === 0 || baseVal === null || convertVal === null) {
      alert("Fill out all the Fields !!! 👊");
      return;
    }
    setBackendData({ number: newNum, base: baseVal, convertTo: convertVal });
    Keyboard.dismiss();
  };

  const navigation = useNavigation();
  const inputRef = useRef();
  let regex = /(\..*){2,}/;

  let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  const handleOnChange = (event) => {
    inputRef.current.value = event;
    setNumber(inputRef.current.value);
    if (event[event.length - 1]?.match(format) || regex.test(event)) {
      setIsValid(false);

      let timeout = setTimeout(() => {
        setNumber("");
        setIsValid(true);
      }, 1000);
      return;
    }
  };
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendData),
  };
  const setAsyncStorage = async (answer) => {
    let data = {
      numbers: [number],
      bases: [baseVal],
      converts: [convertVal],
      answers: [answer],
    };
    setRetirveData(data);
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };
  const addAsyncStorage = async (data) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };
  const updateAsyncStorage = async (answer) => {
    let retriveData = await asyncRetriveData();
    retriveData = JSON.parse(retriveData);
    // will override the data
    let numbers = retriveData?.numbers;
    numbers?.push(number);
    let bases = retriveData?.bases;
    bases?.push(baseVal);
    let converts = retriveData?.converts;
    converts?.push(convertVal);
    let answers = retriveData?.answers;
    answers?.push(answer);
    let newData = {
      numbers,
      bases,
      converts,
      answers,
    };
    setRetirveData(newData);
    addAsyncStorage(newData);
  };
  const asyncRetriveData = async () => {
    let data = await AsyncStorage.getItem("data");
    setRetirveData(data);
    console.log(data);
    return data;
  };

  const fetchAns = async () => {
    try {
      await fetch("https://dbaseapi.onrender.com/", requestOptions).then(
        (response) => {
          response.json().then(async (data) => {
            let fetchedData = await asyncRetriveData();
            console.log(fetchedData);
            if (typeof data === "string") {
              setTimeout(() => setAns(data), 1000);
              if (fetchedData === null) {
                setAsyncStorage(data);
                console.log("setting...");
              } else {
                updateAsyncStorage(data);
                console.log("updating...");
              }

              return data;
            }
          });
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // that's the way of fetching data, bugging on using fetchAns in handleOnSubmit function
  useEffect(() => {
    try {
      asyncRetriveData();
      setLoading(true);
      let ans = fetchAns();
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      setLoading(false);
    }
  }, [backendData]);

  useEffect(() => {
    setWelcome(true);
    setTimeout(() => {
      setWelcome(false);
    }, 3000);
  }, []);

  return (
    <>
      {/* {welcome && <LoadingScreen />} */}
      <ImageBackground
        source={require(`../assets/bg${1}.jpeg`)}
        resizeMode="cover"
        style={styles.image}
        onPress={() => Keyboard.dismiss()}
      >
        <SafeAreaView className="p-10 flex-1">
          <View className="py-5 items-center">
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Image
                className="p-84"
                style={{ width: 200, height: 100 }}
                resizeMode="contain"
                source={logo}
              />
            </TouchableOpacity>
          </View>
          <View className="my-4">
            <TextInput
              placeholder="Enter Number to Conver"
              caretHidden={false}
              cursorColor="black"
              actieCu
              className="bg-gray-300 cursor-text p-2 text-lg rounded-lg"
              ref={inputRef}
              onChangeText={handleOnChange}
              value={number}
            />
            {!isValid && (
              <Text className="text-red-500">Input a Valid Number</Text>
            )}
          </View>
          <View className="flex flex-row justify-between mt-12">
            <TouchableOpacity>
              <Text className="text-gray-100 font-bold">Given Base</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={styles.container}
                data={basesData}
                search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="base"
                searchPlaceholder="Search..."
                value={baseVal}
                onChange={(item) => {
                  setBaseVal(+item.value);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-100 font-bold">Convert Base</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={styles.container}
                data={basesData}
                search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="base"
                searchPlaceholder="Search..."
                value={convertVal}
                onChange={(item) => {
                  setConvertVal(+item.value);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </TouchableOpacity>
          </View>
          <View className="mt-10 flex-row justify-center">
            <View style={{ maxWidth: 150 }}>
              <Button
                onPress={handleOnSubmit}
                className="flex-row items-center"
                color="warning"
              >
                <Text className="text-white text-lg font-bold">Convert</Text>{" "}
                <Icon name="retweet" type="antdesign" color="gray" />
              </Button>
            </View>
          </View>
          <View style={styles.loading}>
            {loading && <ActivityIndicator size="large" color="blue" />}
          </View>

          <View className="mt-10 mx-auto">
            <Text className="font-bold text-gray-100 text-center bottom-1 underline decoration-8">
              Converted Value
            </Text>

            <Text
              style={styles.ans}
              className={`font-bold text-2xl ${
                ans === "Out of bound Base ):" ? "text-red-600" : "text-white"
              } text-center bg-yellow-400 p-2 rounded-lg`}
            >
              {ans}
            </Text>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("history")}
              className="mt-10 p-5"
            >
              <Text className="text-center text-gray-50 underline font-semibold">
                History {">>"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  ans: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  container: {
    marginTop: -30,
    borderRadius: 10,
  },
  dropdown: {
    color: "white",
    width: 100,
    borderRadius: 10,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    color: "white",
    marginRight: 10,
  },
  placeholderStyle: {
    color: "white",
    fontSize: 16,
  },
  selectedTextStyle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 30,
    fontSize: 15,
  },
  image: {
    flex: 1,
  },
});

export default HomeScreen;
