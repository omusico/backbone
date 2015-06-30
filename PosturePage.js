'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Image,
  View,
  Text,
  Component
} = React;

var styles = StyleSheet.create({
  container: {
    padding: 40,
    marginTop: 65,
    flex: 1,
    flexDirection: 'row',
  },
})

var PosturePage = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
      <Text onPress={() => this.props.navigator.pop()}>This is the posture page. Press to go back.</Text>
      </View>
    )
  },
})

module.exports = PosturePage;
