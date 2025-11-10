import { useEffect, useRef, useMemo } from "react";
import { spline } from "@georgedoescode/spline";
import { createNoise2D } from "simplex-noise";
import styles from "./animatedpath.module.css";

interface AnimatedPathProps {
  children: React.ReactNode;
}

const AnimatedPath = ({ children }: AnimatedPathProps) => {
  const NUM_POINTS = 6;
  const RAD = 75;

  const pathRef = useRef<SVGPathElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const points = useMemo(() => createPoints(), []);

  useEffect(() => {
    const simplex = new createNoise2D();
    let hueNoiseOffset = 0;
    let noiseStep = 0.0005;
    let rafId: number;
    let lastTime = 0;

    const path = pathRef.current!;
    const root = rootRef.current!;

    function animate(timestamp: number) {
      if (timestamp - lastTime < 32) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;

      path.setAttribute("d", spline(points, 1, true));

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const nX = simplex(point.noiseOffsetX, point.noiseOffsetX);
        const nY = simplex(point.noiseOffsetY, point.noiseOffsetY);

        point.x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
        point.y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

        point.noiseOffsetX += noiseStep;
        point.noiseOffsetY += noiseStep;
      }

      const hueNoise = simplex(hueNoiseOffset, hueNoiseOffset);
      const hue = map(hueNoise, -1, 1, 0, 360);

      root.style.setProperty("--startColor", `hsl(${hue}, 100%, 75%)`);
      root.style.setProperty("--stopColor", `hsl(${hue + 60}, 100%, 75%)`);
      document.body.style.background = `hsl(${hue + 60}, 75%, 10%)`;

      hueNoiseOffset += noiseStep / 6;
      rafId = requestAnimationFrame(animate);
    }

    const handleMouseOver = () => {
      noiseStep = 0.005;
    };

    const handleMouseLeave = () => {
      noiseStep = 0.001;
    };

    rafId = requestAnimationFrame(animate);

    path.addEventListener("mouseover", handleMouseOver, { passive: true });
    path.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      path.removeEventListener("mouseover", handleMouseOver);
      path.removeEventListener("mouseleave", handleMouseLeave);
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

  function createPoints() {
    const points = [];
    const angleStep = (Math.PI * 2) / NUM_POINTS;

    for (let i = 1; i <= NUM_POINTS; i++) {
      const theta = i * angleStep;

      const x = 100 + Math.cos(theta) * RAD;
      const y = 100 + Math.sin(theta) * RAD;

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
    <div className={styles.container} ref={(el) => (rootRef.current = el)}>
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
        <path ref={pathRef} fill="url(#gradient)" d={spline(points, 1, true)} />
      </svg>
      <div className={styles.childrenContainer}>{children}</div>
    </div>
  );
};

export default AnimatedPath;
