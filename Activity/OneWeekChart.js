'use strict';

var React = require('react-native');
var RNChart = require('react-native-chart');

var {
  View,
  Text,
  StyleSheet
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

var OneWeekChart = React.createClass({
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
    if (this.props.xLabels.length === 7) {
      this.setState({
        hasData: true
      });
      return;
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.xLabels.length === 7 && nextProps.shouldUpdate) {
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
        console.log('We are going to update...');
        this.setState({
          hasData: true,
        });
      });
    }
  },
  render: function() {
    var hasData = this.state.hasData ? (<RNChart style={styles.chart}
      chartData={this.state.chartData}
      xLabels={this.props.xLabels}
      verticalGridStep="1">
    </RNChart>) :
    (<Text style={{margin: 15}}>Please wear your Backbone more to gather more information!</Text>)
    return (
      <View style={styles.container}>
        {hasData}
      </View>
    )
  }
})

module.exports = OneWeekChart;
