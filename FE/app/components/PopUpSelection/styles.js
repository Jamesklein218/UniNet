import React from "react";
import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  contain: {
    width: '90%',
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
  },
  notification: {
    position: 'absolute',
    width:"100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  }
});
