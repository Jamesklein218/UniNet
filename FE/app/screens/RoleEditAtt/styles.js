import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  inputItem: {
    flex: 6.5,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10
  },
  checkDefault: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingVertical: 10,
    marginTop: 10
  }
});
