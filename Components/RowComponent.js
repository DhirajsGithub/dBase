// rnfes
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

const RowComponent = ({ val1, val2, val3, val4 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text className="text-gray-50 font-bold">{val1}</Text>
        </View>
        <View style={styles.column}>
          <Text className="text-gray-50 font-bold">{val2}</Text>
        </View>
        <View style={styles.column}>
          <Text className="text-gray-50 font-bold">{val3}</Text>
        </View>
        {/*  */}
        <View style={[styles.column]}>
          <Text
            className={`${
              val4 === "Out of bound Base ):"
                ? "bg-red font-bold bg-red-500 py-0.5 px-1 rounded-lg"
                : ""
            } font-bold text-gray-50`}
          >
            {val4 === "Out of bound Base ):" ? "Error" : val4}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RowComponent;

const styles = StyleSheet.create({
  column: {
    width: "25%",
    alignItems: "center",
    marginVertical: 12,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
