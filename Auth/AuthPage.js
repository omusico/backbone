'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var SignUpPage = require('./SignUpPage');
var LoginPage = require('./LoginPage');
var RecoveryPage = require('./RecoveryPage');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var {
  StyleSheet,
  View,
  Text,
} = React;

var styles = StyleSheet.create({
  container: {
  },
  header: {
    fontSize: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50,
    padding: 25,
    color: '#48BBEC'
  },
});

var AuthPage = React.createClass({
  getInitialState: function() {
    return {
      keyboardShow: false,
    };
  },
  updateKeyboardSpace: function(frames) {
    this.setState({keyboardShow: true});
  },
  resetKeyboardSpace: function() {
    console.log('RESET HEIGHT');
    this.setState({keyboardShow: false});
  },
  componentDidMount: function() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },
  componentWillUnmount: function() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },
  render: function() {
    var marginNum = this.state.keyboardShow ? -50 : 75;
    return (
      <View>
        <Text style={{fontSize: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: marginNum,
    color: '#48BBEC'}}>Backbone</Text>
        <ScrollableTabView>
          <LoginPage navigator={this.props.navigator} tabLabel="Login" />
          <SignUpPage navigator={this.props.navigator} tabLabel="Sign-up" />
          <RecoveryPage navigator={this.props.navigator} tabLabel="Recover" />
        </ScrollableTabView>
      </View>
    )
  },
})

module.exports = AuthPage;
