import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import WavyHeader from '../../components/WavyHeader';

const Home: React.FC = () => {
  const { navigate } = useNavigation();
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const buttonLoopAnimation = useRef(new Animated.ValueXY({ x: 1, y: 1 }))
    .current;

  useEffect(() => {
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    function animate(): void {
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(buttonLoopAnimation, {
          toValue: {
            x: 0.7,
            y: 1.3,
          },
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(buttonLoopAnimation, {
          toValue: {
            x: 1,
            y: 1,
          },
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    }

    animate();
  }, [fadeInAnimation, buttonLoopAnimation]);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.background}>
        <WavyHeader
          svgColor="#124061"
          headerContainerStyle={styles.headerContainerStyle}
          svgStyle={styles.svgStyle}
        />

        <Animated.View
          style={[styles.titleContainer, { opacity: fadeInAnimation }]}
        >
          <Text style={styles.title}>Card Memory Game</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.playButtonContainer,
            {
              transform: [
                { scaleX: buttonLoopAnimation.x },
                { scaleY: buttonLoopAnimation.y },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigate('Game')}
          >
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#DEDFE0',
    alignItems: 'center',
  },
  headerContainerStyle: {
    backgroundColor: '#124061',
    height: 390,
  },
  svgStyle: {
    position: 'absolute',
    top: 310,
  },
  titleContainer: {
    marginTop: 150,
    width: 300,
  },
  title: {
    fontSize: 48,
    color: '#DEDFE0',
    textShadowColor: '#6b6b6b',
    textShadowRadius: 5,
    textShadowOffset: {
      width: 3,
      height: 3,
    },
    textAlign: 'center',
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: 140,
    backgroundColor: '#6B7A75',
    borderRadius: 10,
    width: 210,
    height: 90,
  },
  playButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: 38,
    color: '#DEDFE0',
  },
});
