'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var ActivityPage = require('./ActivityPage');
var PosturePage = require('./PosturePage');
var CommunicatePage = require('./CommunicatePage');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    fontSize: 36,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50,
    padding: 25,
    color: '#48BBEC'
  },
  activity: {
    height: 125,
    width: 125,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    margin: 25,
    justifyContent: 'center',
  },
  posture: {
    height: 125,
    width: 125,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    margin: 25,
    justifyContent: 'center',
  },
  textActivity: {
    marginRight: 60,
    color: '#48BBEC',
    fontSize: 20,
    marginTop: -20,
  },
  textPosture: {
    marginLeft: 50,
    color: '#48BBEC',
    fontSize: 20,
    marginTop: -20,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 40,
  },
  contact: {
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#48BBEC',
    margin: 10,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
  },
  talkText: {
    fontSize: 14,
    padding: 10,
    color: '#48BBEC',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -5,
  },
  iosBodyOutline: {
    height: 85,
    width: 85,
    alignSelf: 'center',
  },
  iosPulseStrong: {
    height: 85,
    width: 85,
    alignSelf: 'center',
  },
  chatbubbles: {
    height: 35,
    width: 35,
  },
  buttonBorder: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#ffffff',
    backgroundColor: '#48BBEC',
    marginRight: 5,
    marginLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
  }
});

var NavButton = React.createClass({
  render: function() {
    return (
      <TouchableHighlight style={this.props.buttonStyle} underlayColor='#99d9f4' onPress={this.props.nav}>
        {this.props.children}
      </TouchableHighlight>
    )
  }
})

var HomePage = React.createClass({
  goToActivity: function() {
    this.props.navigator.push({
      title: 'Activity',
      component: ActivityPage,
    });
  },
  goToPosture: function() {
    this.props.navigator.push({
      title: 'Posture',
      component: PosturePage,
    });
  },
  goToCommunicate: function() {
    this.props.navigator.push({
      title: 'Talk with us',
      component: CommunicatePage,
    });
  },
  render: function() {
    return (
      <View>
        <Text style={styles.header}>Backbone</Text>
        <View style={styles.container}>
          <NavButton buttonStyle={styles.activity} nav={this.goToActivity}>
            <View style={styles.buttonBorder}>
              <Icon
                name='ion|iosPulseStrong'
                size={85}
                color='#ffffff'
                style={styles.iosPulseStrong}
              />
            </View>
          </NavButton>
          <NavButton buttonStyle={styles.posture} nav={this.goToPosture}>
            <View style={styles.buttonBorder}>
            <Icon
              name='ion|iosBodyOutline'
              size={85}
              color='#ffffff'
              style={styles.iosBodyOutline}
            />
            </View>
          </NavButton>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textActivity}>Activity</Text>
          <Text style={styles.textPosture}>Posture</Text>
        </View>
        <View style={styles.footer}>
          <NavButton buttonStyle={styles.contact} nav={this.goToCommunicate}>
            <View style={styles.contactButton}>
              <Icon
                name='ion|chatbubbles'
                size={35}
                color='#48BBEC'
                style={styles.chatbubbles}
              />
              <Text style={styles.talkText}>Questions/suggestions? Talk with us.</Text>
            </View>
          </NavButton>
        </View>
      </View>
    );
  },
})

module.exports = HomePage;
