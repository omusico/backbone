'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var ChangeEmail = require('./ChangeEmail');
var ChangePassword = require('./ChangePassword');

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
          <ChangeEmail email={this.props.email} tabLabel="Change Email" />
          <ChangePassword email={this.props.email} tabLabel="Change Password" />
        </ScrollableTabView>
      </View>
    )
  },
})

module.exports = SettingsPage;
