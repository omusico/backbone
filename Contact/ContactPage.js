'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var Messages = require('./Messages');

var {
  StyleSheet,
  Image,
  View,
  Text,
  Component,
  TextInput,
  TouchableHighlight,
  ListView,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * .70);
var deviceHeight = (require('Dimensions').get('window').height * .68);
var deviceWidthButton = (require('Dimensions').get('window').width * .30);

var styles = StyleSheet.create({
  container: {
  },
  message: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  messageInput: {
    height: 50,
    width: deviceWidth,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  messageButton: {
    height: 50,
    width: deviceWidthButton,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#48BBEC'
  },
  messageText: {
    fontSize: 24,
    color: 'white',
  }
});

var ContactPage = React.createClass({
  getInitialState: function() {
    return {
      firebaseData: [{message: 'Hello, please talk to us by sending us a message, we\'ll get back to you as soon as we can!', admin: 'Khoa - Support Team'}],
      message: '',
    };
  },
  componentWillMount: function() {
    var context = this;
    var userRef = new Firebase('https://sweltering-fire-6261.firebaseio.com/').child(this.props.userID);
    userRef.child('messages').on('value', function(snapshot) {
      console.log('Snapshot value: ', snapshot.val())
      if (snapshot.val()) {
        context.setState({
          firebaseData: snapshot.val(),
        }, function() {
          console.log('FirebaseData value: ', context.state.firebaseData);
        })
      }
    });
  },
  sendMessage: function() {
    console.log('Sending this message... ', this.state.message);
    var userRef = new Firebase('https://sweltering-fire-6261.firebaseio.com/').child(this.props.userID);
    var newMsgRef = userRef.child('messages').push();
    newMsgRef.set({message: this.state.message, admin: 'You'});
  },
  handleMessageUpdate: function(e) {
    this.setState({
      message: e.nativeEvent.text
    }, function() {
      console.log('This is your message: ', this.state.message);
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.message}>
          <TextInput style={styles.messageInput} onChange={this.handleMessageUpdate} multiline={true} />
            <TouchableHighlight style={styles.messageButton} onPress={this.sendMessage}>
              <Text style={styles.messageText}>Send</Text>
            </TouchableHighlight>
        </View>
        <Messages firebaseData={this.state.firebaseData} />
      </View>
    )
  },
})

module.exports = ContactPage;
