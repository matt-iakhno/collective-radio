import { useEffect, useRef, useState } from "react";
import { spline } from "@georgedoescode/spline";
import { createNoise2D } from "simplex-noise";
import styles from "./animatedpath.module.css";

interface AnimatedPathProps {
  children: React.ReactNode;
}

interface BlobPoint {
  x: number;
  y: number;
  originX: number;
  originY: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
}

const AnimatedPath = ({ children }: AnimatedPathProps) => {
  const [colors, setColors] = useState({
    startColor: "hsl(0, 100%, 75%)",
    stopColor: "hsl(60, 100%, 75%)",
    backgroundColor: "hsl(60, 75%, 5%)",
  });

  // Use refs for values that shouldn't trigger re-renders
  const simplex = useRef(createNoise2D());
  const points = useRef<BlobPoint[]>([]);
  const hueNoiseOffset = useRef(0);
  const noiseStep = useRef(0.0005);
  const animationFrameId = useRef<number>();

  // Create points only once
  useEffect(() => {
    const numPoints = 6;
    const rad = 75;
    const angleStep = (Math.PI * 2) / numPoints;

    points.current = Array.from({ length: numPoints }, (_, i) => {
      const theta = (i + 1) * angleStep;
      const x = 100 + Math.cos(theta) * rad;
      const y = 100 + Math.sin(theta) * rad;
      return {
        x,
        y,
        originX: x,
        originY: y,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      };
    });
  }, []);

  // Animation effect
  useEffect(() => {
    const path = document.querySelector<SVGPathElement>("path");
    if (!path) return;

    function map(
      n: number,
      start1: number,
      end1: number,
      start2: number,
      end2: number
    ) {
      return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
    }

    function noise(x: number, y: number) {
      return simplex.current(x, y);
    }

    function animate() {
      path?.setAttribute("d", spline(points.current, 1, true));

      // Update points
      points.current.forEach((point) => {
        const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
        const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
        const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
        const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);
        point.x = x;
        point.y = y;
        point.noiseOffsetX += noiseStep.current;
        point.noiseOffsetY += noiseStep.current;
      });

      const hueNoise = noise(hueNoiseOffset.current, hueNoiseOffset.current);
      const hue = map(hueNoise, -1, 1, 0, 360);

      setColors(() => ({
        startColor: `hsl(${hue}, 100%, 75%)`,
        stopColor: `hsl(${hue + 60}, 100%, 75%)`,
        backgroundColor: `hsl(${hue + 60}, 75%, 5%)`,
      }));

      hueNoiseOffset.current += noiseStep.current / 6;
      animationFrameId.current = requestAnimationFrame(animate);
    }

    // Handle mouse events
    const handleMouseOver = () => {
      noiseStep.current = 0.001;
    };

    const handleMouseLeave = () => {
      noiseStep.current = 0.0005;
    };

    path.addEventListener("mouseover", handleMouseOver);
    path.addEventListener("mouseleave", handleMouseLeave);

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      path.removeEventListener("mouseover", handleMouseOver);
      path.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []); // Empty dependency array since we're using refs

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <svg viewBox="0 0 200 200" className={styles.blob}>
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop
              id="gradientStop1"
              offset="0%"
              style={{ stopColor: colors.startColor }}
            />
            <stop
              id="gradientStop2"
              offset="100%"
              style={{ stopColor: colors.stopColor }}
            />
          </linearGradient>
        </defs>
        <path fill="url(#gradient)" d={spline(points.current, 1, true)} />
      </svg>
      <div className={styles.childrenContainer}>{children}</div>
    </div>
  );
};

export default AnimatedPath;
