import { StyleSheet } from "react-native";
import { BaseColor } from "@config";

export default StyleSheet.create({
  contain: {
    padding: 20,
    borderRadius: 8,
    width: "100%"
  },
  packageTitleContent: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  contentPrice: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  containItem: {
    padding: 10,
    alignItems: "center",
    borderTopWidth: 1
  },
  contentTopIcon: {
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingBottom: 10,
    paddingTop: 10
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30
  },
  lineIcon: {
    width: 48,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#B1ADAD",
    marginTop: 10,
    marginBottom: 10
  },
  serviceContentIcon: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20
  },
  priceContentIcon: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20
  }
});
