'use strict';

var React = require('react-native');
var AuthPage = require('./Auth/AuthPage');

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
