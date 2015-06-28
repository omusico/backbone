'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var ActivityPage = require('./ActivityPage');
var PosturePage = require('./PosturePage');

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
    marginLeft: 10,
  },
  contact: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#48BBEC',
    margin: 10,
  },
  talkText: {
    fontSize: 16,
    padding: 15,
    color: '#48BBEC',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -5,
  },
  iosBodyOutline: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  iosPulseStrong: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  chatbubbles: {
    height: 50,
    width: 50,
  },
});

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
  render: function() {
    return (
      <View>
        <Text style={styles.header}>Backbone</Text>
        <View style={styles.container}>
          <TouchableHighlight style={styles.activity} onPress={this.goToActivity}>
            <Icon
              name='ion|iosPulseStrong'
              size={100}
              color='#ffffff'
              style={styles.iosPulseStrong}
            />
          </TouchableHighlight>
          <TouchableHighlight style={styles.posture} onPress={this.goToPosture}>
            <Icon
              name='ion|iosBodyOutline'
              size={100}
              color='#ffffff'
              style={styles.iosBodyOutline}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textActivity}>Activity</Text>
          <Text style={styles.textPosture}>Posture</Text>
        </View>
        <View style={styles.footer}>
          <Icon
            name='ion|chatbubbles'
            size={50}
            color='#48BBEC'
            style={styles.chatbubbles}
          />
          <TouchableHighlight style={styles.contact}>
            <Text style={styles.talkText}>Talk with us</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
})

module.exports = HomePage;
