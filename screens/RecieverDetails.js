import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config.js";

import MyHeader from "../components/MyHeader";
import CustomButton from "../components/CustomButton";

export default class RecieverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      recieverId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      bookName: this.props.navigation.getParam("details")["book_name"],
      reasonToRequesting: this.props.navigation.getParam("details")[
        "reason_to_request"
      ],
      recieverName: "",
      recieverContact: "",
      recieverAddress: "",
      recieverRequestDocId: ""
    };
  }

  getRecieverDetails() {
    db.collection("users")
      .where("email_id", "==", this.state.recieverId)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            recieverName: doc.data().first_name,
            recieverContact: doc.data().contact,
            recieverAddress: doc.data().address
          });
        });
      });

    db.collection("requested_books")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({ recieverRequestDocId: doc.id });
        });
      });
  }

  updateBookStatus = () => {
    db.collection("all_donations").add({
      book_name: this.state.bookName,
      request_id: this.state.requestId,
      requested_by: this.state.recieverName,
      donor_id: this.state.userId,
      request_status: "Donor Interested"
    });
  };

  componentDidMount() {
    this.getRecieverDetails();
  }

  render() {
    var {
      recieverId,
      userId,
      bookName,
      reasonToRequesting,
      recieverName,
      recieverContact,
      recieverAddress
    } = this.state;

    var bookInfoList = [
      { type: "Name", value: recieverName },
      { type: "Contact", value: recieverContact }
    ];

    var recieverInfoList = [
      { type: "Name", value: bookName },
      { type: "Reason", value: reasonToRequesting }
    ];

    return (
      <View style={styles.container}>
        {/* Before writing MyHeader code pass props in MyHeader */}
        <MyHeader
          navigation={this.props.navigation}
          title={"Donate Books"}
          leftComponent={
            <Icon
              name={"arrow-left"}
              type={"feather"}
              color={"#696969"}
              onPress={() => this.props.navigation.goBack()}
            />
          }
        />
        <View style={styles.upperContainer}>
          <Card title={"Book Information"} titleStyle={styles.cardTitle}>
            {bookInfoList.map((item, index) => (
              <Card key={`book-card-${index}`}>
                <Text
                  key={`book-card-value-${index}`}
                  style={{ fontWeight: "bold" }}
                >
                  {item.type}: {item.value}
                </Text>
              </Card>
            ))}
          </Card>
        </View>
        <View style={styles.middleContainer}>
          <Card title={"Reciever Information"} titleStyle={styles.cardTitle}>
            {recieverInfoList.map((item, index) => (
              <Card key={`receiver-card-${index}`}>
                <Text
                  key={`receiver-card-value-${index}`}
                  style={{ fontWeight: "bold" }}
                >
                  {item.type}: {item.value}
                </Text>
              </Card>
            ))}
          </Card>
        </View>
        <View style={styles.lowerContainer}>
          {recieverId !== userId ? (
            <CustomButton
              title={"I want to Donate"}
              style={styles.button}
              onPress={() => {
                this.updateBookStatus();
              }}
              titleStyle={styles.buttonText}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  upperContainer: {
    flex: 0.3
  },
  middleContainer: {
    flex: 0.3
  },
  cardTitle: {
    fontSize: 20
  },
  lowerContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 10
  },
  buttonText: {
    fontWeight: "300"
  }
});
