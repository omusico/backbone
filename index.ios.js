/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var Firebase = require('firebase');
var HomePage = require('./HomePage');
var AuthPage = require('./AuthPage');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
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
      <Navigator
        initialRoute={{name: 'AuthPage', component: AuthPage}}
        renderScene={(route, navigator) => {
          if (route.component) {
            return React.createElement(route.component, { navigator })
          }
        }
      }
      />
    );
  },
});

AppRegistry.registerComponent('backbone', () => backbone);
