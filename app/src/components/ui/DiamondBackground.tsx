import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Polygon,
  Rect,
  Defs,
  Filter,
  FeGaussianBlur,
} from "react-native-svg";
import { Colors } from "../../styles/commonStyles";

const DiamondBackground: React.FC = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height - 200;

  return (
    <View style={styles.diamondContainer}>
      <Svg width="100%" height="100%" color-interpolation-filters="sRGB">
        <Defs>
          <Filter id="blurFilterOuter">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </Filter>
          <Filter id="blurFilterInner">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="30" />
          </Filter>
        </Defs>

        <Polygon
          points={`
          ${windowWidth / 2},0
          ${windowWidth},${windowHeight / 2}
          ${windowWidth / 2},${windowHeight}
          0,${windowHeight / 2}
        `}
          fill={Colors.backgroundGradientMid}
          opacity={0.5}
          filter="url(#blurFilterOuter)"
        />

        <Polygon
          points={`
          ${windowWidth / 2},${windowHeight / 2 - windowHeight / 4}
          ${windowWidth / 2 + windowWidth / 4},${windowHeight / 2}
          ${windowWidth / 2},${windowHeight / 2 + windowHeight / 4}
          ${windowWidth / 2 - windowWidth / 4},${windowHeight / 2}
        `}
          fill={Colors.backgroundGradientStart}
          opacity={0.1}
          filter="url(#blurFilterInner)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  diamondContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: Colors.background,
  },
});

export default DiamondBackground;
