import React, { useState, useCallback, useRef, useMemo } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CardProps {
  position: number;
  iconName: string;
  hasMatched?: boolean;
  handleOnFrontFlip(card: number): void;
  handleOnBackFlip(card?: number): void;
}

const Card: React.FC<CardProps> = ({
  iconName,
  position,
  hasMatched,
  handleOnFrontFlip,
  handleOnBackFlip,
}) => {
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const fadeOutAnimation = useRef(new Animated.Value(1)).current;
  const [isShowed, setIsShowed] = useState(false);
  const [showFadeAnaimation, setShowFadeAnaimation] = useState(true);

  const toggleCard = useCallback(() => {
    Animated.spring(animatedRotation, {
      toValue: 180,
      tension: 25,
      friction: 15,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        Animated.spring(animatedRotation, {
          toValue: 0,
          tension: 25,
          friction: 15,
          useNativeDriver: true,
        }).start();
        handleOnBackFlip();
        setIsShowed(state => !state);
      }
    });

    setTimeout(() => {
      setIsShowed(state => !state);
      handleOnFrontFlip(position);
    }, 100);
  }, [animatedRotation, handleOnFrontFlip, handleOnBackFlip, position]);

  const frontFlipAnimation = useMemo(() => {
    return {
      transform: [
        {
          rotateY: animatedRotation.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    };
  }, [animatedRotation]);

  const backFlipAnimation = useMemo(() => {
    return {
      transform: [
        {
          rotateY: animatedRotation.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '0deg'],
          }),
        },
      ],
    };
  }, [animatedRotation]);

  const createAfadeOutAnimation = useMemo(() => {
    return Animated.timing(fadeOutAnimation, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    });
  }, [fadeOutAnimation]);

  if (hasMatched) {
    if (showFadeAnaimation && isShowed) {
      setShowFadeAnaimation(false);
      createAfadeOutAnimation.start();
    }

    return (
      <Animated.View style={[styles.showed, { opacity: fadeOutAnimation }]}>
        <Icon name={iconName} size={60} color="#FFFFFF" />
      </Animated.View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={toggleCard} disabled={isShowed}>
      <Animated.View
        style={
          isShowed
            ? [frontFlipAnimation, styles.showed]
            : [backFlipAnimation, styles.covered]
        }
      >
        {isShowed && <Icon name={iconName} size={60} color="#FFFFFF" />}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Card;

const styles = StyleSheet.create({
  showed: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#124061',
    shadowColor: '#8D9499',
    shadowRadius: 10,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
  },
  covered: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B7A75',
    shadowColor: '#666',
    shadowRadius: 5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
  },
});
