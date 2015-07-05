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
      firebaseData: [{message: 'hello', admin: 'You'}, {message: 'bye', admin: 'Khoa'}],
      message: '',
    };
  },
  componentDidMount: function() {
    var context = this;
    var ref = new Firebase('https://sweltering-fire-6261.firebaseio.com/');
    var usersRef = ref.child('messages');
    usersRef.child(this.props.userID).on('value', function(snapshot) {
      var arr = context.state.firebaseData;
      arr.push(snapshot.val());
      console.log('arggg', arr);
      if (snapshot.val()) {
        context.setState({
          firebaseData: arr,
        }, function() {
          console.log(context.state.firebaseData);
        });
      } else {
        console.log('THERE WAS NO DATA!!!');
      }
    });
  },
  sendMessage: function() {
    console.log('sending message');
    var ref = new Firebase('https://sweltering-fire-6261.firebaseio.com/');
    var usersRef = ref.child('messages');
    usersRef.child(this.props.userID).set({
      message: this.state.message,
      admin: 'You',
    });
  },
  handleMessageUpdate: function(e) {
    this.setState({
      message: e.nativeEvent.text
    }, function() {
      console.log('MESSAGE ', this.state.message);
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
