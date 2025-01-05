import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polygon, Defs, Filter, FeGaussianBlur } from "react-native-svg";
import { Colors } from "../../styles/commonStyles";

const DiamondBackground: React.FC = () => {
  return (
    <View style={styles.diamondContainer}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <Defs>
          <Filter id="blurFilterOuter">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="50" />
          </Filter>
          <Filter id="blurFilterInner">
            <FeGaussianBlur in="SourceGraphic" stdDeviation="25" />
          </Filter>
        </Defs>

        <Polygon
          points="100,0 200,100 100,200 0,100"
          fill={Colors.backgroundGradientMid}
          opacity={0.5}
          filter="url(#blurFilterOuter)"
        />
        <Polygon
          points="100,50 150,100 100,150 50,100"
          fill={Colors.backgroundGradientStart}
          opacity={0.3}
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
