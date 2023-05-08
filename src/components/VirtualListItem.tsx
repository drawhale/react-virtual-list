import { useEffect, useRef } from "react";

import type { FC, ReactNode } from "react";

export type ItemKey = number;
export type ItemSize = { width: number; height: number };
export type ItemVisibleHandler = (key: ItemKey, size: ItemSize) => void;

type Props = {
  itemKey: ItemKey;
  top: number;
  children: ReactNode;
  onVisible: ItemVisibleHandler;
};

const VirtualListItem: FC<Props> = ({ itemKey, top, children, onVisible }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { width = 0, height = 0 } =
      ref.current?.getBoundingClientRect() || {};
    onVisible(itemKey, { width, height });
  }, [ref]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        position: "absolute",
        backgroundColor: "#00000011",
        top: "0px",
        transform: `translateY(${top}px)`,
      }}
    >
      {children}
    </div>
  );
};

export default VirtualListItem;
