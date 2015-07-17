'use strict';

var React = require('react-native');
var RNChart = require('react-native-chart');

var {
  View,
  Text,
  StyleSheet,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * 0.95);
var deviceHeight = (require('Dimensions').get('window').width * 0.70);

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    margin: 10,
    width: deviceWidth,
    height: deviceHeight,
  },
});

var OneDayChart = React.createClass({
  getInitialState: function() {
    return {
      chartData: [
          {
            name:'BarChart',
            type:'bar',
            color1:'#48BBEC',
            color2: '#FFA500',
            widthPercent:0.6,
            showYAxisLabels: false,
            data: this.props.chartData,
          },
        ],
      stepCount: this.props.stepCount,
      activeData: this.props.activeData,
      inactiveData: this.props.inactiveData,
    };
  },
  componentWillMount: function() {
    if (this.props.xLabels.length === 1) {
      this.setState({
        hasData: true
      });
      return;
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      chartData: [
        {
          name:'BarChart',
          type:'bar',
          color1:'#48BBEC',
          color2: '#FFA500',
          widthPercent:0.6,
          data: nextProps.chartData,
        },
      ],
      stepCount: nextProps.stepCount,
      hasData: false,
      activeData: nextProps.activeData,
      inactiveData: nextProps.inactiveData,
    }, function() {
      this.setState({
        hasData: true,
      });
    });
  },
  activityTime: function(rawTime) {
    if (rawTime > 60) {
      if (rawTime > 3600) {
        return (rawTime - (rawTime % 360)) / 360 + ' hours ' + (rawTime - (rawTime % 60)) / 60 + ' minutes ' + rawTime % 60 + ' seconds';
      } else {
        return (rawTime - (rawTime % 60)) / 60 + ' minutes ' + rawTime % 60 + ' seconds';
      }
    } else {
      return rawTime + ' seconds';
    }
  },
  render: function() {
    var hasData = this.state.hasData ? (<RNChart style={styles.chart}
      chartData={this.state.chartData}
      xLabels={this.props.xLabels}
      verticalGridStep="1"
      showAxis={false}>
    </RNChart>) :
    (<Text>Please wear your Backbone more to gather more information!</Text>)
    return (
      <View style={styles.container}>
        <View>
          {hasData}
        </View>
        <View>
          <Text>Steps taken: {this.state.stepCount}</Text>
          <Text>Time active: {this.activityTime(this.state.activeData)}</Text>
          <Text>Time inactive: {this.activityTime(this.state.inactiveData)}</Text>
        </View>
      </View>
    )
  }
})

module.exports = OneDayChart;
