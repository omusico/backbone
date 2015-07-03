'use strict';

var React = require('react-native');
var Firebase = require('firebase');
var SignUpPage = require('./SignUpPage');
var LoginPage = require('./LoginPage');
var RecoveryPage = require('./RecoveryPage');
var ScrollableTabView = require('react-native-scrollable-tab-view');

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
  render: function() {
    return (
      <View>
        <Text style={styles.header}>Backbone</Text>
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
