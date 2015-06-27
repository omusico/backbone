/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

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
    marginTop: 35,
    padding: 25,
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
  contact: {
    flex: 1,
    height: 50,
    width: 125,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 25,
  },
  text: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  contactText: {
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

var backbone = React.createClass({
  render: function() {
    return (
      <View>
        <Text style={styles.header}>Backbone</Text>
        <View style={styles.container}>
          <TouchableHighlight style={styles.activity}>
            <Text style={styles.text}>Activity</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.posture}>
            <Text style={styles.text}>Posture</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.contact}>
          <Text style={styles.contactText}>Talk To Us</Text>
        </TouchableHighlight>
      </View>
    );
  },
});

AppRegistry.registerComponent('backbone', () => backbone);
