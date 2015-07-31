'use strict';

var React = require('react-native');
var RNChart = require('react-native-chart');

var {
  View,
  Text,
  StyleSheet
} = React;

var deviceWidth = (require('Dimensions').get('window').width * 0.85);
var deviceHeight = (require('Dimensions').get('window').height * 0.48);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  chart: {
    margin: 10,
    width: deviceWidth,
    height: deviceHeight,
  },
  chartContainer: {
    borderWidth: 2,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  activityText: {
    margin: 10,
    fontSize: 16,
  },
  dayActiveText: {
    margin: 10,
    fontSize: 16,
    color: '#48BBEC',
  },
  dayInactiveText: {
    margin: 10,
    marginBottom: 25,
    fontSize: 16,
    color: '#FFA500'
  }
});

var FiveDayChart = React.createClass({
    getInitialState: function() {
    return {
      chartData: [
          {
            name:'BarChart',
            type:'bar',
            color1:'#48BBEC',
            color2: '#FFA500',
            widthPercent:0.6,
            data: this.props.chartData,
          },
        ],
        stepCount: this.props.stepCount,
    };
  },
  componentWillMount: function() {
    if (this.props.xLabels.length === 5) {
      this.setState({
        hasData: true
      });
      return;
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.xLabels.length === 5 && this.props.xLabels[this.props.xLabels.length - 1] !== nextProps.xLabels[nextProps.xLabels.length - 1]) {
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
      }, function() {
        this.setState({
          hasData: true,
        });
      });
    }
  },
  shouldComponentUpdate: function(nextProps) {
    return this.props.xLabels[this.props.xLabels.length - 1] !== nextProps.xLabels[nextProps.xLabels.length - 1];
  },
  addDayData: function(active) {
    var counter = 0;
    for (var i = active; i < this.props.chartData.length; i += 2) {
      counter += this.props.chartData[i];
    }
    return counter;
  },
  addSteps: function() {
    var counter = 0;
    for (var i = 0; i < this.props.stepCount.length; i++) {
      counter += this.props.stepCount[i];
    }
    return counter;
  },
  activityTime: function(rawTime) {
    if (rawTime > 60) {
      if (rawTime > 3600) {
        return (rawTime - (rawTime % 360)) / 360 + 'h ' + (rawTime - (rawTime % 60)) / 60 + 'm ' + rawTime % 60 + 's';
      } else {
        return (rawTime - (rawTime % 60)) / 60 + 'm ' + rawTime % 60 + 's';
      }
    } else {
      return rawTime + 's';
    }
  },
  render: function() {
    var hasData = this.state.hasData ?
    (<View>
      <RNChart style={styles.chart}
      chartData={this.state.chartData}
      xLabels={this.props.xLabels}
      verticalGridStep="1">
      </RNChart>
      <Text style={styles.activityText}>Steps taken: {this.addSteps()}</Text>
      <Text style={styles.dayActiveText}>Time active: {this.activityTime(this.addDayData(0))}</Text>
      <Text style={styles.dayInactiveText}>Time inactive: {this.activityTime(this.addDayData(1))}</Text>
    </View>) :
    (<Text style={{margin: 15}}>Please wear your Backbone more to gather more information!</Text>)
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          {hasData}
        </View>
      </View>
    )
  }
})

module.exports = FiveDayChart;
