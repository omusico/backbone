var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * 0.85);
var deviceWidthButton = (require('Dimensions').get('window').width * 0.30);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

var Settings = React.createClass({
  getInitialState: function() {
    return {
      notificationInterval: 1800,
      currentBatteryLife: 'Syncing with device...',
      updatedBatteryLife: false,
    };
  },
  render: function() {
    return (
        <View style={styles.container}>
          <View>
            <Text>Battery life percentage: {this.state.currentBatteryLife}</Text>
            <Text>Change notification interval</Text>
            <Text>Change posture sensitivity</Text>
          </View>
      </View>
    )
  }
})

module.exports = Settings;
