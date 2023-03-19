import React from "react";
import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  contain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  contentModal: {
    width: "100%",
    borderRadius: 8,
    padding: 8
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20
  },
  contentAction: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 24
  }
});
