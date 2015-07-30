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
            <View>
              <Text>Change notification interval</Text>
              <TouchableHighlight>
                <Text>15m</Text>
              </TouchableHighlight>
              <TouchableHighlight>
                <Text>30m</Text>
              </TouchableHighlight>
              <TouchableHighlight>
                <Text>45m</Text>
              </TouchableHighlight>
              <TouchableHighlight>
                <Text>1hr</Text>
              </TouchableHighlight>
            </View>
            <View>
              <Text>Change slouch duration</Text>
              <TouchableHighlight>
                <Text>5s</Text>
              </TouchableHighlight>
              <TouchableHighlight>
                <Text>10s</Text>
              </TouchableHighlight>
              <TouchableHighlight>
                <Text>15s</Text>
              </TouchableHighlight>
            </View>
            <View>
              <Text>Battery life percentage: {this.state.currentBatteryLife}</Text>
            </View>
          </View>
      </View>
    )
  }
})

module.exports = Settings;
