'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var ActivityPage = require('./Activity/ActivityPage');
var PosturePage = require('./Posture/PosturePage');
var ContactPage = require('./Contact/ContactPage');
var SettingsPage = require('./Settings/SettingsPage');
var CustomTabBar = require('./CustomTabBar');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var RNMetaWear = require('NativeModules').RNMetaWear;
var Firebase = require('firebase');

var deviceWidth = require('Dimensions').get('window').width;
var deviceHeight = require('Dimensions').get('window').height;

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
  tabView: {
    width: deviceWidth,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    height: deviceHeight,
  },
  button: {
    height: 35,
    width: 200,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  editButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    height: 35,
    margin: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
  },
  activeBar: {
    backgroundColor: '#00FF00',
    height: 25,
    marginTop: 25,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveBar: {
    backgroundColor: '#FF0000',
    height: 25,
    marginTop: 25,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

var HomePage = React.createClass({
  getInitialState: function() {
    RNMetaWear.connectToMetaWear(this.props.navigator.route.userData.uid);
    return {
      changingEmail: false,
      newEmail: '',
      activityState: "NO",
      stateChanged: null,
    };
  },
  componentWillMount: function() {
    var context = this;
    var date = new Date();
    var currentDate = (date.getMonth() + 1) + '-' + date.getDate();
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/users/");
    var userActiveRef = ref.child(this.props.navigator.route.userData.uid).child('activity').child(currentDate).child('userActive');
    userActiveRef.on('value', function(snapshot) {
      var activityState = snapshot.val();
      context.setState({
        activityState: activityState,
        stateChanged: false,
      }, function() {
        context.setState({
          stateChanged: true,
        });
      });
    });
  },
  changeEmail: function() {
    if (!this.state.changingEmail) {
      this.setState({
        changingEmail: true,
      });
      return;
    }
    this.setState({
      changingEmail: false,
    });
  },
  render: function() {
    var activityText = (this.state.activityState === "YES") ? (<View style={styles.activeBar}>
          <Text style={styles.activityText}>You are active!</Text>
        </View>) : (<View style={styles.inactiveBar}>
          <Text style={styles.activityText}>You are inactive!</Text>
        </View>)
    return (
      <View style={styles.container}>
        {activityText}
        <ScrollableTabView renderTabBar={() => <CustomTabBar />}>
          <ScrollView tabLabel="ion|iosPulseStrong" style={styles.tabView}>
            <View style={styles.card}>
              <ActivityPage userID={this.props.navigator.route.userData.uid} />
            </View>
          </ScrollView>
          <ScrollView tabLabel="ion|iosBodyOutline" style={styles.tabView}>
            <View style={styles.card}>
              <Text>Posture</Text>
            </View>
          </ScrollView>
          <ScrollView tabLabel="ion|gearB" style={styles.tabView}>
            <View style={styles.card}>
              <SettingsPage email={this.props.navigator.route.email} />
            </View>
          </ScrollView>
          <ScrollView tabLabel="ion|iosHelpOutline" style={styles.tabView}>
            <View style={styles.card}>
              <ContactPage userID={this.props.navigator.route.userData.uid} />
            </View>
          </ScrollView>
        </ScrollableTabView>
      </View>
    );
  },
})

module.exports = HomePage;
