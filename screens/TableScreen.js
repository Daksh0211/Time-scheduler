import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";

import MyHeader from "../components/MyHeader";


export default class TableScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      day: "",
      toDo_list: "",
      IsDailyStatusActive: "",
      day: "",
      dailyStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      Imagelink: "#",
      dataSource: "",
      requestedImageLink: "",

    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    


    db.collection("table_data").add({
      user_id: userId,
      day: day,
      toDo_list: toDo_list,
      request_id: randomRequestId,
      daily_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      image_link: books.data[0].volumeInfo.imageLinks.thumbnail,
    });

    await this.getDailyStatus();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsDailyStatusActive: true,
          });
        });
      });

    this.setState({
      day: "",
      toDo_list: "",
      requestId: randomRequestId,
    });

    return Alert.alert("Details Entereed Successfully");
  };

  enteredDetails = (day) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("table_data").add({
      user_id: userId,
      day: day,
      request_id: requestId,
      dailyStatus: "entered",
    });
  };

  getIsDailyStatusActive() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsDailyStatusActive: doc.data().IsDailyStatusActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getTheTimetable = () => {
    // getting the requested book
    var bookRequest = db
      .collection("table_data")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().daily_status !== "entered") {
            this.setState({
              requestId: doc.data().request_id,
              day: doc.data().day,
              dailyStatus: doc.data().daily_status,
              requestedImageLink: doc.data().image_link,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and book nam
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                
                var day = doc.data().day;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " details entered " + day,
                  notification_status: "unread",
                  day : day,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getTheTimetable();
    this.getIsDailyStatusActive();
  }

  updatedDailyStatus = () => {
    //updating the book status after receiving the book
    db.collection("table_data").doc(this.state.docId).update({
      dailyStatus : "entered",
    }); 

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsDailyStatusActive: false,
          });
        });
      });
  };

 

  //render Items  functionto render the books from api
  renderItem = ({ item, i }) => {


    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };

    
     
  };

  render() {
    if (this.state.IsBookRequestActive === true) {
      return (
        <View style={{ flex: 1}}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Enter Details" navigation={this.props.navigation} />
          </View>
          <View
            style={styles.ImageView}
          >
            <Image
              source={{ uri: this.state.requestedImageLink }}
              style={styles.imageStyle}
            />
          </View>
          <View
            style={styles.bookstatus}
          >
            <Text
              style={{
                fontSize: RFValue(20),

              }}
            >
              Day
            </Text>
            <Text
              style={styles.requestedbookName}
            >
              {this.state.toDo_list}
            </Text>
            <Text
              style={styles.status}
            >
              Status
            </Text>
            <Text
              style={styles.bookStatus}
            >
              {this.state.toDo_list}
            </Text>
          </View>
          <View
            style={styles.buttonView}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateDailyStatus();
                this.enteredDailyDeatails(this.state.toDo_list);
              }}
            >
              <Text
                style={styles.buttontxt}
              >
                Details entered 
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="ToDo_List" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput}
            label={"Day"}
            placeholder={"Day"}
            containerStyle={{ marginTop: RFValue(60) }}
            value={this.state.day}
          />
          : (
            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline
                numberOfLines={8}
                label={"ToDo_list"}
                placeholder={"Enter details for your daily schedule"}
                onChangeText={(text) => {
                  this.setState({
                    toDo_list: text,
                  });
                }}
                value={this.state.toDo_list}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.day,
                    this.state.toDo_list
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Enter
                </Text>
              </TouchableOpacity>
            </View>
          )
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: RFValue(35),
    borderWidth: 1,
    padding: 10,
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
  },
  bookstatus:{
    flex: 0.4,
    alignItems: "center",

  },
  requestedbookName:{
    fontSize: RFValue(30),
    fontWeight: "500",
    padding: RFValue(10),
    fontWeight: "bold",
    alignItems:'center',
    marginLeft:RFValue(60)
  },
  status:{
    fontSize: RFValue(20),
    marginTop: RFValue(30),
  },
  bookStatus:{
    fontSize: RFValue(30),
    fontWeight: "bold",
    marginTop: RFValue(10),
  },
  buttonView:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});