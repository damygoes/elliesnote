import { SmoothInfiniteScroll } from '@/shared/components/SmoothInfiniteScroll';
import { Colors } from '@/shared/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export function InfiniteScrollHeader() {
  return (
    <View style={styles.infiniteScrollContainer}>
      <View>
        <SmoothInfiniteScroll scrollDirection="down" iconSet="set1" />
      </View>
      <View>
        <SmoothInfiniteScroll scrollDirection="up" iconSet="set2" />
      </View>
      <View>
        <SmoothInfiniteScroll scrollDirection="down" iconSet="set3" />
      </View>

      <LinearGradient
        colors={['transparent', Colors.light.background_primary]}
        style={styles.gradientOverlay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  infiniteScrollContainer: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Colors.light.background_primary,
  },
  gradientOverlay: {
    position: 'absolute',
    height: 220,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
