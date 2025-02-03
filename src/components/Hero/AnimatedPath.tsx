import { useEffect, useRef } from "react";
import { spline } from "@georgedoescode/spline";
import { createNoise2D } from "simplex-noise";
import styles from "./animatedpath.module.css";

interface AnimatedPathProps {
  children: React.ReactNode;
}

const AnimatedPath = ({ children }: AnimatedPathProps) => {
  const simplex = new createNoise2D();
  const numPoints = 6;
  const rad = 75;

  // Use useRef to maintain mutable values without triggering rerenders
  const pointsRef = useRef(createPoints());
  const noiseStepRef = useRef(0.0005);
  const hueNoiseOffsetRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const path = document.querySelector<SVGPathElement>("path")!;
    const root = document.documentElement;

    function animate() {
      const points = pointsRef.current;
      path.setAttribute("d", spline(points, 1, true));

      // For every point...
      points.forEach((point) => {
        const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
        const nY = noise(point.noiseOffsetY, point.noiseOffsetY);

        const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
        const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

        point.x = x;
        point.y = y;

        point.noiseOffsetX += noiseStepRef.current;
        point.noiseOffsetY += noiseStepRef.current;
      });

      const hueNoise = noise(
        hueNoiseOffsetRef.current,
        hueNoiseOffsetRef.current
      );
      const hue = map(hueNoise, -1, 1, 0, 360);

      root.style.setProperty("--startColor", `hsl(${hue}, 100%, 75%)`);
      root.style.setProperty("--stopColor", `hsl(${hue + 60}, 100%, 75%)`);
      document.body.style.background = `hsl(${hue + 60}, 75%, 5%)`;

      hueNoiseOffsetRef.current += noiseStepRef.current / 6;

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    const handleMouseOver = () => {
      noiseStepRef.current = 0.001;
    };

    const handleMouseLeave = () => {
      noiseStepRef.current = 0.0005;
    };

    path.addEventListener("mouseover", handleMouseOver);
    path.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      path.removeEventListener("mouseover", handleMouseOver);
      path.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
    return simplex(x, y);
  }

  function createPoints() {
    const points = [];
    const angleStep = (Math.PI * 2) / numPoints;

    for (let i = 1; i <= numPoints; i++) {
      const theta = i * angleStep;

      const x = 100 + Math.cos(theta) * rad;
      const y = 100 + Math.sin(theta) * rad;

      points.push({
        x: x,
        y: y,
        originX: x,
        originY: y,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      });
    }

    return points;
  }

  return (
    <div className={styles.container}>
      <svg viewBox="0 0 200 200" className={styles.blob}>
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop
              id="gradientStop1"
              offset="0%"
              stopColor="var(--startColor)"
            />
            <stop
              id="gradientStop2"
              offset="100%"
              stopColor="var(--stopColor)"
            />
          </linearGradient>
        </defs>
        <path fill="url(#gradient)" d={spline(pointsRef.current, 1, true)} />
      </svg>
      <div className={styles.childrenContainer}>{children}</div>
    </div>
  );
};

export default AnimatedPath;
