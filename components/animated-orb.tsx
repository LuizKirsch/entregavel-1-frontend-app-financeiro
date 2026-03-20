import { useEffect } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  size: number;
  color: string;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  delay?: number;
};

// Spring lento e com bastante amortecimento — parece flutuar
const SPRING = {
  damping: 18,
  stiffness: 8,
  mass: 3,
};

const RANGE = 45;
const MIN_INTERVAL = 2800;
const MAX_INTERVAL = 5000;

export function AnimatedOrb({ size, color, top, bottom, left, right, delay = 0 }: Props) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    let tx: ReturnType<typeof setTimeout>;
    let ty: ReturnType<typeof setTimeout>;

    function moveX() {
      x.value = withSpring((Math.random() - 0.5) * RANGE * 2, SPRING);
      tx = setTimeout(moveX, MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL));
    }

    function moveY() {
      y.value = withSpring((Math.random() - 0.5) * RANGE * 2, SPRING);
      ty = setTimeout(moveY, MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL));
    }

    tx = setTimeout(moveX, delay);
    ty = setTimeout(moveY, delay + 500);

    return () => {
      clearTimeout(tx);
      clearTimeout(ty);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          bottom,
          left,
          right,
        },
        style,
      ]}
    />
  );
}
