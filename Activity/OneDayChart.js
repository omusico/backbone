'use strict';

var React = require('react-native');
var RNChart = require('react-native-chart');

var {
  View,
  Text,
  StyleSheet,
} = React;

var deviceWidth = (require('Dimensions').get('window').width * 0.85);
var deviceHeight = (require('Dimensions').get('window').height * 0.41);

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
  },
  activeBar: {
    marginBottom: 5,
    backgroundColor: '#48BBEC',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveBar: {
    marginBottom: 5,
    backgroundColor: '#FFA500',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  hasNoData: {
    margin: 15,
  }
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
        return (rawTime - (rawTime % 360)) / 360 + 'h ' + (rawTime - (rawTime % 60)) / 60 + 'm ' + rawTime % 60 + 's';
      } else {
        return (rawTime - (rawTime % 60)) / 60 + 'm ' + rawTime % 60 + 's';
      }
    } else {
      return rawTime + 's';
    }
  },
  render: function() {
    var activityText = (this.props.userActive === "YES") ? (<View style={styles.activeBar}>
      <Text style={styles.activeStateText}>You're currently active!</Text>
    </View>) :
    (<View style={styles.inactiveBar}>
      <Text style={styles.activeStateText}>You're currently inactive!</Text>
    </View>)
    var hasData = this.state.hasData ? (<RNChart style={styles.chart}
      chartData={this.state.chartData}
      xLabels={this.props.xLabels}
      verticalGridStep="1"
      showAxis={false}>
    </RNChart>) :
    (<Text style={styles.hasNoData}>Please wear your Backbone more to gather more information!</Text>)
    var isConnected = this.state.stepCount ? (<Text>{this.state.stepCount}</Text>) :
    (<Text>"Syncing with device..."</Text>)
    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          {hasData}
          {activityText}
          <Text style={styles.activityText}>Steps taken: {isConnected}</Text>
          <Text style={styles.dayActiveText}>Time active: {this.activityTime(this.state.activeData)}</Text>
          <Text style={styles.dayInactiveText}>Time inactive: {this.activityTime(this.state.inactiveData)}</Text>
        </View>
      </View>
    )
  }
})

module.exports = OneDayChart;
