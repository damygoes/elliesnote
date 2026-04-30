import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/shared/constants/theme';

type ScrollDirection = 'up' | 'down';
type IconSet = 'set1' | 'set2' | 'set3';

interface Props {
  scrollDirection?: ScrollDirection;
  iconSet?: IconSet;
}

const ICON_SIZE = 26;
const ITEM_HEIGHT = ICON_SIZE + 18;
const DURATION = 8000;

const ICON_SETS: Record<IconSet, readonly string[]> = {
  set1: [
    'heart-outline',
    'fitness-outline',
    'leaf-outline',
    'sunny-outline',
    'water-outline',
    'moon-outline',
    'walk-outline',
  ],
  set2: [
    'pulse-outline',
    'bed-outline',
    'cafe-outline',
    'bicycle-outline',
    'nutrition-outline',
    'body-outline',
    'flower-outline',
  ],
  set3: [
    'sparkles-outline',
    'medkit-outline',
    'timer-outline',
    'thermometer-outline',
    'ear-outline',
    'cloudy-night-outline',
    'bandage-outline',
  ],
};

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export function SmoothInfiniteScroll({
  scrollDirection = 'up',
  iconSet = 'set1',
}: Props) {
  const icons = ICON_SETS[iconSet];
  const totalHeight = icons.length * ITEM_HEIGHT;
  const translateY = useSharedValue(
    scrollDirection === 'up' ? 0 : -totalHeight,
  );

  useEffect(() => {
    const toValue = scrollDirection === 'up' ? -totalHeight : 0;
    const fromValue = scrollDirection === 'up' ? 0 : -totalHeight;
    translateY.value = fromValue;
    translateY.value = withRepeat(
      withTiming(toValue, { duration: DURATION, easing: Easing.linear }),
      -1,
      false,
    );
  }, [scrollDirection, totalHeight, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Duplicate icons to create seamless loop
  const doubled = [...icons, ...icons];

  return (
    <View style={styles.column}>
      <Animated.View style={animStyle}>
        {doubled.map((name, i) => (
          <View key={i} style={styles.item}>
            <Ionicons
              name={name as IoniconName}
              size={ICON_SIZE}
              color={Colors.light.primary_soft}
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 44,
    overflow: 'hidden',
    height: 420,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
