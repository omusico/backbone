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
  isConnected: {
    marginTop: 25,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  isConnectedText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

var HomePage = React.createClass({
  getInitialState: function() {
    return {
      isConnected: "NO",
    };
  },
  componentWillMount: function() {
    var context = this;
    RNMetaWear.connectToMetaWear(this.props.navigator.state.routeStack[1].userData.uid);
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/users/");
    ref.child(this.props.navigator.state.routeStack[1].userData.uid).child('isConnected').on('value', function(snapshot) {
      context.setState({
        isConnected: snapshot.val().isConnected
      });
    });
  },
  render: function() {
    var isConnected = this.state.isConnected === "YES" ? (<View />) :
    (<View style={styles.isConnected}>
      <Text style={styles.isConnectedText}>Please wait, device is connecting...</Text>
    </View>);
    return (
      <View style={styles.container}>
        {isConnected}
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
