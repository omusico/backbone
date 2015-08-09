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
} = React;

var deviceWidth = (require('Dimensions').get('window').width * 0.70);
var deviceWidthButton = (require('Dimensions').get('window').width * 0.30);
var deviceHeightKeyboard = (require('Dimensions').get('window').height * 0.45);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -20,
  },
  message: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
  },
  messageInput: {
    flex: 2,
    height: 50,
    width: deviceWidth,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  messageButton: {
    flex: 1,
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
      keyboardShow: false,
    };
  },
  componentWillMount: function() {
    var context = this;
    var userRef = new Firebase('https://sweltering-fire-6261.firebaseio.com/').child('users').child(this.props.userID);
    userRef.child('messages').on('value', function(snapshot) {
      if (snapshot.val()) {
        context.setState({
          firebaseData: snapshot.val(),
        });
      }
    });
  },
  sendMessage: function() {
    var userRef = new Firebase('https://sweltering-fire-6261.firebaseio.com/').child('users').child(this.props.userID);
    var newMsgRef = userRef.child('messages').push();
    newMsgRef.set({message: this.state.message, admin: 'You'});
  },
  handleMessageUpdate: function(e) {
    this.setState({
      message: e.nativeEvent.text
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.message}>
          <TextInput style={styles.messageInput} clearTextOnFocus={true} onChange={this.handleMessageUpdate} multiline={true} />
          <TouchableHighlight style={styles.messageButton} onPress={this.sendMessage}>
            <Text style={styles.messageText}>Send</Text>
          </TouchableHighlight>
        </View>
        <View style={{marginTop: 30}}>
        <Messages firebaseData={this.state.firebaseData} />
        </View>
      </View>
    )
  },
})

module.exports = ContactPage;
