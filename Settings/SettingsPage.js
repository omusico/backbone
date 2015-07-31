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
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -25,
  },
});

var SettingsPage = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <ScrollableTabView>
          <ChangeEmail email={this.props.email} tabLabel="Email" />
          <ChangePassword email={this.props.email} tabLabel="Password" />
          <Settings userID={this.props.userID} email={this.props.email} tabLabel="Settings" />
        </ScrollableTabView>
      </View>
    )
  },
})

module.exports = SettingsPage;
