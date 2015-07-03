'use strict';

var React = require('react-native');
var RNChart = require('react-native-chart');
var Firebase = require('firebase');

var {
  StyleSheet,
  View,
  Component,
  Text,
  TouchableHighlight,
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    marginTop: 25,
    width: 300,
    height: 200,
  },
});

var xLabels = ['1','2','3','4','5','6', '7'];

var ActivityChart = React.createClass({
  getInitialState: function() {
    return {
      chartData: null,
    }
  },
  componentWillMount: function() {
    var context = this;
    var ref = new Firebase("https://sweltering-fire-6261.firebaseio.com/users/");
    ref.child(this.props.userID).on('value', function(snapshot) {
      console.log('SNAPSHOT!!! ', snapshot.val());
      var snapshotVal = snapshot.val();
      context.setState({
        chartData: [
          {
            name:'BarChart',
            type:'bar',
            color:'#48BBEC',
            widthPercent:0.6,
            data: snapshotVal.activityData,
          },
        ]
      });
    }, function(errorObject) {
      console.log('The read failed: ', errorObject.code);
    });
  },
  render: function() {
    return (
        <View style={styles.container}>
          <RNChart style={styles.chart}
            chartData={this.state.chartData}
            xLabels={xLabels}>
          </RNChart>
        </View>
    )
  },
})

module.exports = ActivityChart;
