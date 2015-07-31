'use strict';

var React = require('react-native');
var ActivityPage = require('./Activity/ActivityPage');
var PosturePage = require('./Posture/PosturePage');
var ContactPage = require('./Contact/ContactPage');
var SettingsPage = require('./Settings/SettingsPage');
var CustomTabBar = require('./CustomTabBar');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var RNMetaWear = require('NativeModules').RNMetaWear;
var Firebase = require('firebase');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

var HomePage = React.createClass({
  componentWillMount: function() {
    RNMetaWear.connectToMetaWear(this.props.navigator.state.routeStack[1].userData.uid);
  },
  render: function() {
    return (
      <View style={styles.container}>
        <ScrollableTabView renderTabBar={() => <CustomTabBar />}>
          <ScrollView tabLabel="Activity">
            <View>
              <ActivityPage userID={this.props.navigator.state.routeStack[1].userData.uid} />
            </View>
          </ScrollView>
          <ScrollView tabLabel="Posture">
            <View>
              <PosturePage />
            </View>
          </ScrollView>
          <ScrollView tabLabel="Settings">
            <View>
              <SettingsPage userID={this.props.navigator.state.routeStack[1].userData.uid} email={this.props.navigator.state.routeStack[1].email} />
            </View>
          </ScrollView>
          <ScrollView tabLabel="Help">
            <View>
              <ContactPage userID={this.props.navigator.state.routeStack[1].userData.uid} />
            </View>
          </ScrollView>
        </ScrollableTabView>
      </View>
    );
  },
})

module.exports = HomePage;
