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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const points = useMemo(() => createPoints(), []);

  useEffect(() => {
    const simplex = new createNoise2D();
    let hueNoiseOffset = 0;
    const hueNoiseStep = 0.00008;
    let noiseStep = 0.0005;
    let rafId: number | null = null;
    let lastTime = 0;
    let lastHue = Number.NaN;
    let lastPathD = "";
    let isVisible = false;

    const pathElement = pathRef.current;
    if (!pathElement || !containerRef.current) {
      return;
    }
    const container = containerRef.current!;

    function animate(timestamp: number) {
      if (timestamp - lastTime < 16) {
        rafId = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;

      const path = pathRef.current;
      if (!path) {
        return;
      }

      const newD = spline(points, 1, true);
      if (newD !== lastPathD) {
        path.setAttribute("d", newD);
        lastPathD = newD;
      }

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const nX = simplex(point.noiseOffsetX, point.noiseOffsetX);
        const nY = simplex(point.noiseOffsetY, point.noiseOffsetY);

        point.x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
        point.y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

        point.noiseOffsetX += noiseStep;
        point.noiseOffsetY += noiseStep;
      }

      hueNoiseOffset += hueNoiseStep;
      const hueNoise = simplex(hueNoiseOffset, hueNoiseOffset);
      const hue = Math.round(map(hueNoise, -1, 1, 0, 360));
      if (hue !== lastHue) {
        container.style.setProperty("--hue", `${hue}`);
        document.body.style.background = `hsl(${hue + 60}, 75%, 10%)`;
        lastHue = hue;
      }

      rafId = requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (rafId === null) {
        lastTime = 0;
        rafId = requestAnimationFrame(animate);
      }
    }

    function stopAnimation() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const handleMouseOver = () => {
      noiseStep = 0.002;
    };

    const handleMouseLeave = () => {
      noiseStep = 0.001;
    };

    pathElement.addEventListener("mouseover", handleMouseOver, { passive: true });
    pathElement.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });

    return () => {
      stopAnimation();
      observer.disconnect();
      pathElement.removeEventListener("mouseover", handleMouseOver);
      pathElement.removeEventListener("mouseleave", handleMouseLeave);
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
    <div ref={containerRef} className={styles.container}>
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
