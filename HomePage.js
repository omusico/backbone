'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var ActivityPage = require('./ActivityPage');
var PosturePage = require('./PosturePage');
var CommunicatePage = require('./CommunicatePage');
var ChangeEmail = require('./ChangeEmail');
var CustomTabBar = require('./CustomTabBar');
var ScrollableTabView = require('react-native-scrollable-tab-view');

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
    marginTop: 30,
  },
  tabView: {
    width: deviceWidth,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
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
});

var HomePage = React.createClass({
  getInitialState: function() {
    return {
      changingEmail: false,
      newEmail: '',
    };
  },
  saveEmail: function() {

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
    var changeEmailInput = this.state.changingEmail ? (<ChangeEmail email={this.props.navigator.route.email} />) : (<View />);
    var changeSave = this.state.changingEmail ?
      ( <View style={{flex: 1, flexDirection: 'row'}}>
        <TouchableHighlight style={styles.editButton}>
          <Text style={styles.buttonText} onPress={this.changeEmail}>Cancel</Text>
        </TouchableHighlight>
        </View>) :
      (<TouchableHighlight style={styles.button} onPress={this.changeEmail}>
        <Text style={styles.buttonText}>Change email</Text>
      </TouchableHighlight>)
    return (
      <View style={styles.container}>
        <ScrollableTabView renderTabBar={() => <CustomTabBar />}>
          <ScrollView tabLabel="ion|iosPulseStrong" style={styles.tabView}>
            <View style={styles.card}>
              <Text>Activity</Text>
            </View>
          </ScrollView>
          <ScrollView tabLabel="ion|iosBodyOutline" style={styles.tabView}>
            <View style={styles.card}>
              <Text>Posture</Text>
            </View>
          </ScrollView>
          <ScrollView tabLabel="ion|gearB" style={styles.tabView}>
            <View style={styles.card}>
              {changeEmailInput}
              {changeSave}
              <TouchableHighlight style={styles.button} onPress={this.authenticateUser}>
                <Text style={styles.buttonText}>Change password</Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
          <ScrollView tabLabel="ion|iosHelpOutline" style={styles.tabView}>
            <View style={styles.card}>
              <Text>Talk to us</Text>
            </View>
          </ScrollView>
        </ScrollableTabView>
      </View>
    );
  },
})

module.exports = HomePage;
