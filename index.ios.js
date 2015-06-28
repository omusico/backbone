/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var HomePage = require('./HomePage');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

var backbone = React.createClass({
  getInitialState: function() {
    return {
      name: 'Khoa'
    };
  },
  render: function() {
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Welcome, ' + this.state.name,
          backButtonTitle: 'Home',
          component: HomePage,
      }}/>
    );
  },
});

AppRegistry.registerComponent('backbone', () => backbone);
