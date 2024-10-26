import React, { useEffect } from "react";
import { spline } from "@georgedoescode/spline";
import { createNoise2D } from "simplex-noise";
import styles from "./AnimatedPath.module.css"; // Import the CSS module

interface AnimatedPathProps {
  children: React.ReactNode; // Accept children as a prop
}

const AnimatedPath: React.FC<AnimatedPathProps> = ({ children }) => {
  const simplex = new createNoise2D();
  const numPoints = 6;
  const rad = 75;
  const points = createPoints();

  let hueNoiseOffset = 0;
  let noiseStep = 0.0005; // Reduced by a factor of 10

  useEffect(() => {
    const path = document.querySelector<SVGPathElement>("path")!;
    const root = document.documentElement;

    function animate() {
      path.setAttribute("d", spline(points, 1, true));

      // For every point...
      points.forEach((point) => {
        const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
        const nY = noise(point.noiseOffsetY, point.noiseOffsetY);

        const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
        const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

        point.x = x;
        point.y = y;

        point.noiseOffsetX += noiseStep;
        point.noiseOffsetY += noiseStep;
      });

      const hueNoise = noise(hueNoiseOffset, hueNoiseOffset);
      const hue = map(hueNoise, -1, 1, 0, 360);

      root.style.setProperty("--startColor", `hsl(${hue}, 100%, 75%)`);
      root.style.setProperty("--stopColor", `hsl(${hue + 60}, 100%, 75%)`);
      document.body.style.background = `hsl(${hue + 60}, 75%, 5%)`;

      hueNoiseOffset += noiseStep / 6;

      requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    // Add event listeners for mouse events
    path.addEventListener("mouseover", () => {
      noiseStep = 0.001; // Adjusted accordingly
    });

    path.addEventListener("mouseleave", () => {
      noiseStep = 0.0005; // Adjusted accordingly
    });

    // Clean up on component unmount
    return () => {
      path.removeEventListener("mouseover", () => {
        noiseStep = 0.001;
      });
      path.removeEventListener("mouseleave", () => {
        noiseStep = 0.0005;
      });
    };
  }, [points]);

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
      <svg viewBox="0 0 200 200" className={styles.svg}>
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
        <path fill="url(#gradient)" d={spline(points, 1, true)} />
      </svg>
      <div className={styles.childrenContainer}>
        {children} {/* Render children on top of the animated blob */}
      </div>
    </div>
  );
};

export default AnimatedPath;
