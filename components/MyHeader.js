import React from "react";
import { Header, Icon } from "react-native-elements";
import { StyleSheet } from "react-native";

const MyHeader = props => {
  return (
    <Header
      centerComponent={{
        text: props.title,
        style: styles.title
      }}
      backgroundColor={"#6fc0b8"}
      {...props}
    />
  );
};

export default MyHeader;

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold"
  }
});
