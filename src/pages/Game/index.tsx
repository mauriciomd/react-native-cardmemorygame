import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { differenceInSeconds, differenceInMinutes } from 'date-fns';

import Card from '../../components/Card';

interface Card {
  icon: string;
  id: number;
  isCovered: boolean;
  hasMatched: boolean;
}

interface CurrentTime {
  time: Date;
  formattedTime: string;
}

const Game: React.FC = () => {
  const { goBack } = useNavigation();

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState(-1);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [currentTime, setCurrentTime] = useState<CurrentTime>({
    time: new Date(),
    formattedTime: '00:00',
  });

  const cardsName = useMemo(() => {
    return [
      'alpha-a-box',
      'alpha-i-box',
      'alpha-m-box',
      'alpha-o-box',
      'alpha-t-box',
      'alpha-v-box',
      'alpha-x-box',
      'alpha-y-box',
    ];
  }, []);

  useEffect(() => {
    const gridSize = 16;

    const unsortCards: Card[] = [];
    cardsName.forEach(name => {
      let filledCards = 0;
      do {
        const index = Math.floor(Math.random() * gridSize);
        if (unsortCards[index] === undefined) {
          unsortCards[index] = {
            icon: name,
            id: index,
            isCovered: true,
            hasMatched: false,
          };
          filledCards += 1;
        }
      } while (filledCards < 2);
    });

    setCards(unsortCards);

    const interval = setInterval(() => {
      const date = new Date();
      let difInSeconds = differenceInSeconds(date, currentTime.time);
      const difInMinutes = differenceInMinutes(date, currentTime.time);

      if (difInMinutes > 0 && difInSeconds >= 60) {
        difInSeconds -= 60 * difInMinutes;
      }

      const formattedMinutes = difInMinutes.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });

      const formattedSeconds = difInSeconds.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });

      setCurrentTime(state => ({
        ...state,
        formattedTime: `${formattedMinutes}:${formattedSeconds}`,
      }));
    }, 1000);

    setCurrentInterval(interval);
  }, [currentTime.time, cardsName]);

  const restartGame = useCallback(() => {
    clearInterval(currentInterval);
    setCards([]);
    setCurrentTime({
      time: new Date(),
      formattedTime: '00:00',
    });
  }, [currentInterval]);

  const checkGameOver = useCallback(
    (deck: Card[]) => {
      const hasAnyCoveredCards = deck.find(card => card.hasMatched === false);

      if (!hasAnyCoveredCards) {
        Alert.alert('Game over!', 'You have found all the pieces', undefined, {
          cancelable: false,
        });
        restartGame();
        return true;
      }

      return false;
    },
    [restartGame],
  );

  const handleGoBack = useCallback(() => {
    clearInterval(currentInterval);
    goBack();
  }, [currentInterval, goBack]);

  function handleFrontFlip(card: number): void {
    if (selectedCardId !== card) {
      const previousSelectedCard = cards.find(
        item => item.id === selectedCardId,
      );
      const currentSelectedCard = cards.find(item => item.id === card);

      if (previousSelectedCard && currentSelectedCard) {
        if (previousSelectedCard.icon === currentSelectedCard.icon) {
          const icon = previousSelectedCard.icon;
          const newCardsState = cards.map(item =>
            item.icon !== icon ? item : { ...item, hasMatched: true },
          );

          if (!checkGameOver(newCardsState)) {
            setCards(newCardsState);
          }
        }
      }
    }

    setSelectedCardId(card);
  }

  function handleBackFlip(): void {
    setSelectedCardId(-1);
  }

  return (
    <SafeAreaView style={styles.background}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Icon name="keyboard-backspace" size={32} color="#124061" />
      </TouchableOpacity>

      <Text style={styles.timer}>{currentTime.formattedTime}</Text>

      <FlatList
        style={styles.cardList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        numColumns={4}
        data={cards}
        keyExtractor={card => String(card.id)}
        renderItem={({ item }) => (
          <View style={styles.cardItem}>
            <Card
              iconName={item.icon}
              position={item.id}
              hasMatched={item.hasMatched}
              handleOnFrontFlip={handleFrontFlip}
              handleOnBackFlip={handleBackFlip}
            />
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>Restart Game</Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
};

export default Game;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#DEDFE0',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 10,
  },
  timer: {
    marginTop: 30,
    fontSize: 52,
    color: '#8D9499',
    fontWeight: 'bold',
  },
  cardList: {
    marginTop: 30,
  },
  cardItem: {
    width: 90,
    height: 120,
    margin: 5,
  },
  restartButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
    backgroundColor: '#8D9499',
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restartButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});
