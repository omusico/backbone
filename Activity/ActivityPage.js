'use strict';

var React = require('react-native');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var ActivityChart = require('./ActivityChart');
var InActivityChart = require('./InActivityChart');

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

var ActivityPage = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <ScrollableTabView>
          <ActivityChart userID={this.props.userID} tabLabel="Activity" />
          <InActivityChart userID={this.props.userID} tabLabel="InActivity" />
        </ScrollableTabView>
      </View>
    )
  },
})

module.exports = ActivityPage;
