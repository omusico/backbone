'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} = React;

var Icon = require('FAKIconImage');
var deviceWidth = require('Dimensions').get('window').width;

var styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});

var CustomTabBar = React.createClass({
  selectedTabIcons: [],
  unselectedTabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.activeTab === page;

    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)}>
        <View style={styles.tab}>
          <Icon name={name} size={40} color='#48BBEC' style={{width: 40, height: 40, position: 'absolute', top: 0, left: 30}}
            ref={(icon) => { this.selectedTabIcons[page] = icon }}/>
          <Icon name={name} size={40} color='#ccc' style={{width: 40, height: 40, position: 'absolute', top: 0, left: 30}}
            ref={(icon) => { this.unselectedTabIcons[page] = icon }}/>
        </View>
      </TouchableOpacity>
    );
  },

  setAnimationValue(value) {
    var currentPage = this.props.activeTab;

    this.unselectedTabIcons.forEach((icon, i) => {
      if (value - i >= 0 && value - i <= 1) {
        icon.setNativeProps({opacity: value - i});
      }
      if (i - value >= 0 &&  i - value <= 1) {
        icon.setNativeProps({opacity: i - value});
      }
    });
  },

  render() {
    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  },
});

module.exports = CustomTabBar;
