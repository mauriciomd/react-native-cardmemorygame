import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface WavyHeaderProps {
  svgColor: string;
  headerContainerStyle: StyleProp<ViewStyle>;
  svgStyle: StyleProp<ViewStyle>;
}

const WavyHeader: React.FC<WavyHeaderProps> = ({
  headerContainerStyle,
  svgColor,
  svgStyle,
}) => {
  return (
    <View style={styles.container}>
      <View style={headerContainerStyle}>
        <Svg height="60%" width="100%" viewBox="0 0 1440 320" style={svgStyle}>
          <Path
            fill={svgColor}
            d="M0,224L205.7,288L411.4,256L617.1,128L822.9,128L1028.6,224L1234.3,288L1440,256L1440,0L1234.3,0L1028.6,0L822.9,0L617.1,0L411.4,0L205.7,0L0,0Z"
          />
        </Svg>
      </View>
    </View>
  );
};

export default WavyHeader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
});
