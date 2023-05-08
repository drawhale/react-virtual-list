import { useEffect, useRef, useState } from "react";

const useScroll = <T extends HTMLElement>() => {
  const scrollRef = useRef<T>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      requestAnimationFrame(() => setScrollTop((e.target as T).scrollTop));
    };

    scrollRef.current?.addEventListener("scroll", handleScroll);
  }, [scrollRef]);

  return { scrollRef, scrollTop };
};

export default useScroll;
