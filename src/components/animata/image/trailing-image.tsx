import React, {
  createRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { motion, useAnimation } from "framer-motion";

import { useMousePosition } from "../../../../hook/useMousePosition";
import { getDistance, lerp } from "../../../../lib/utils";

interface AnimatedImageRef {
  show: (params: {
    x: number;
    y: number;
    zIndex: number;
    newX: number;
    newY: number;
  }) => void;
  isActive: () => boolean;
}

const AnimatedImage = forwardRef<AnimatedImageRef, { src: string }>(
  ({ src }, ref) => {
    const controls = useAnimation();
    const isRunning = useRef(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(ref, () => ({
      isActive: () => isRunning.current,
      show: async ({
        x,
        y,
        newX,
        newY,
        zIndex,
      }: {
        x: number;
        y: number;
        zIndex: number;
        newX: number;
        newY: number;
      }) => {
        if (!imgRef.current) return;

        const rect = imgRef.current.getBoundingClientRect();

        const center = (posX: number, posY: number) => {
          const coords = {
            x: posX - rect.width / 2,
            y: posY - rect.height / 2,
          };
          return `translate(${coords.x}px, ${coords.y}px)`;
        };

        controls.stop();

        controls.set({
          opacity: isRunning.current ? 1 : 0.75,
          zIndex,
          transform: `${center(x, y)} scale(1)`,
          transition: { ease: "circOut" },
        });

        isRunning.current = true;

        await controls.start({
          opacity: 1,
          transform: `${center(newX, newY)} scale(1)`,
          transition: { duration: 0.9, ease: "circOut" },
        });

        await Promise.all([
          controls.start({
            transition: { duration: 1, ease: "easeInOut" },
            transform: `${center(newX, newY)} scale(0.1)`,
          }),
          controls.start({
            opacity: 0,
            transition: { duration: 1.1, ease: "easeOut" },
          }),
        ]);

        isRunning.current = false;
      },
    }));

    useEffect(() => {
      // Animation controls setup after component mounts
      return () => {
        controls.stop();
      };
    }, [controls]);

    return (
      <motion.img
        ref={imgRef}
        initial={{ opacity: 0, scale: 1 }}
        animate={controls}
        src={src}
        alt="trail element"
        className="absolute h-56 w-44 object-cover"
      />
    );
  }
);

AnimatedImage.displayName = "AnimatedImage";

const images = [
  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726090242/learning-webdev-blog/booking-hotel/2_dvsk6q.png",
  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726090242/learning-webdev-blog/booking-hotel/6_gp0qee.png",
  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726090242/learning-webdev-blog/booking-hotel/1_ixfrfp.png",
  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726090242/learning-webdev-blog/booking-hotel/3_dxvybi.png",
  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726090242/learning-webdev-blog/booking-hotel/4_ikf1p3.png",
  "https://res.cloudinary.com/drqbhj6ft/image/upload/v1726090242/learning-webdev-blog/booking-hotel/5_hnbffe.png",
];

const TrailingImage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Create a maximum of 20 trails for a smoother experience
  const trailsRef = useRef(
    Array.from(
      { length: Math.max(20, images.length) },
      createRef<AnimatedImageRef>
    )
  );

  const lastPosition = useRef({ x: 0, y: 0 });
  const cachedPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const zIndex = useRef(1);

  const update = useCallback((cursor: { x: number; y: number }) => {
    const activeRefCount = trailsRef.current.filter((ref) =>
      ref.current?.isActive()
    ).length;
    if (activeRefCount === 0) {
      // Reset zIndex since there are no active references
      // This prevents zIndex from incrementing indefinitely
      zIndex.current = 1;
    }

    const distance = getDistance(
      cursor.x,
      cursor.y,
      lastPosition.current.x,
      lastPosition.current.y
    );
    const threshold = 50;

    const newCachePosition = {
      x: lerp(cachedPosition.current.x || cursor.x, cursor.x, 0.1),
      y: lerp(cachedPosition.current.y || cursor.y, cursor.y, 0.1),
    };
    cachedPosition.current = newCachePosition;

    if (distance > threshold) {
      imageIndex.current = (imageIndex.current + 1) % trailsRef.current.length;
      zIndex.current = zIndex.current + 1;
      lastPosition.current = cursor;
      trailsRef.current[imageIndex.current].current?.show?.({
        x: newCachePosition.x,
        y: newCachePosition.y,
        zIndex: zIndex.current,
        newX: cursor.x,
        newY: cursor.y,
      });
    }
  }, []);

  useMousePosition(containerRef, update);

  return (
    <div
      ref={containerRef}
      className="storybook-fix absolute flex min-h-96 w-[45%] z-40"
    >
      {trailsRef.current.map((ref, index) => (
        <AnimatedImage
          key={index}
          ref={ref}
          src={images[index % images.length]}
        />
      ))}
    </div>
  );
};

export default TrailingImage;
