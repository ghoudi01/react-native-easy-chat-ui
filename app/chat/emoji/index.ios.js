import React, {PureComponent} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import ViewPagerAndroidContainer from '../components/android-container';
import ViewPagerAndroid from '@react-native-community/viewpager';
import Control from './control';
import {EMOJIS_DATA, DEFAULT_EMOJI} from '../../source/emojis';
const {width, height} = Dimensions.get('window');
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
export default class EmojiPanel extends PureComponent {
  constructor(props) {
    super(props);
    const {allPanelHeight, isIphoneX, iphoneXBottomPadding} = props;
    this.totalHeight = allPanelHeight + (isIphoneX ? iphoneXBottomPadding : 0);
    this.state = {
      pageIndex: 0,
    };
    this.total = 0;
  }

  switchComponent(e) {
    if (Platform.OS === 'ios') {
      let {x} = e.nativeEvent.contentOffset;
      let cardIndex = Math.round(x / width);
      if (x >= width / 2 && x < width / 2 + 10)
        this.scroll.scrollTo({x: width * cardIndex, y: 0, animated: true});
      this.setState({pageIndex: cardIndex});
    } else {
      let {position, offset} = e.nativeEvent;
      if (offset === 0) {
        this.setState({pageIndex: position});
      }
    }
  }

  render() {
    const {panelContainerHeight, ImageComponent} = this.props;
    const ContainerComponent = Platform.select({
      ios: ScrollView,
      android: ViewPagerAndroid,
    });
    this.total = 0;
    return (
      <Animated.View
        style={[
          styles.container,
          {
            position: 'absolute',
            height: panelContainerHeight,
            backgroundColor: '#f5f5f5',
            bottom: this.props.emojiHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [-panelContainerHeight, 0],
            }),
            opacity: this.props.emojiHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}>
        <EmojiSelector
          columns={10}
          showSearchBar={false}
          category={Categories.symbols}
          onEmojiSelected={(emoji) => this.props.onPress(emoji)}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
});
