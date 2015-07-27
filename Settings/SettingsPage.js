'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var ChangeEmail = require('./ChangeEmail');
var ChangePassword = require('./ChangePassword');
var Settings = require('./Settings');

var {
  StyleSheet,
  View,
  Component,
  Text,
  TouchableHighlight,
} = React;

var styles = StyleSheet.create({
  container: {
    marginTop: -15,
  },
});

var SettingsPage = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <ScrollableTabView>
          <Settings email={this.props.email} tabLabel="Settings" />
          <ChangeEmail email={this.props.email} tabLabel="Email" />
          <ChangePassword email={this.props.email} tabLabel="Password" />
        </ScrollableTabView>
      </View>
    )
  },
})

module.exports = SettingsPage;
