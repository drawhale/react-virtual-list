import { Children, useRef } from "react";
import useScroll from "hooks/useScroll";
import VirtualListItem from "./VirtualListItem";
import useSizeCache from "hooks/useSizeCache";

import type { FC, ReactNode } from "react";
import type { ItemVisibleHandler } from "./VirtualListItem";

const DEFAULT_HEIGHT = 50;
const BEFORE_SPARE_COUNT = 2;
const AFTER_SPARE_COUNT = 2;

type Props = {
  children: ReactNode;
};

const VirtualList: FC<Props> = ({ children }) => {
  const { scrollRef, scrollTop } = useScroll<HTMLDivElement>();
  const outlineRef = useRef<HTMLDivElement>(null);

  const totalItemCount = Children.count(children);

  const { sizeCache, setVisibleItemSize } = useSizeCache({
    totalItemCount,
    defaultItemHeight: DEFAULT_HEIGHT,
  });

  const handleItemVisible: ItemVisibleHandler = (key, size) => {
    const cached = sizeCache.getItemSize(key);
    if (
      !cached ||
      (cached.width !== size.width && cached.height !== size.height)
    ) {
      sizeCache.setItemSize(key, size);
      setVisibleItemSize();
    }
  };

  const scrollContainerHeight = scrollRef.current?.offsetHeight || 0;
  const startIndex = sizeCache.getIndexOfTopPosition(scrollTop);
  const endIndex = sizeCache.getEndIndexOfVisibleItems(
    startIndex,
    scrollContainerHeight
  );

  const visibleStartIndex = Math.max(startIndex - BEFORE_SPARE_COUNT, 0);
  const visibleEndIndex = Math.min(
    endIndex + AFTER_SPARE_COUNT,
    totalItemCount
  );

  const displayChildren = [
    ...Children.toArray(children).slice(visibleStartIndex, visibleEndIndex),
  ];

  const totalHeight = sizeCache.getTotalHeight();

  return (
    <div
      ref={scrollRef}
      style={{
        position: "relative",
        border: "1px solid #ccc",
        margin: "20px",
        height: "200px",
        overflow: "auto",
      }}
    >
      <div ref={outlineRef} style={{ height: `${totalHeight}px` }}></div>
      <div>
        {displayChildren.map((child, index) => {
          const itemKey = index + visibleStartIndex;
          const prevHeight = sizeCache.getHeightToIndex(itemKey);

          return (
            <VirtualListItem
              key={itemKey}
              itemKey={itemKey}
              top={prevHeight}
              onVisible={handleItemVisible}
            >
              {child}
            </VirtualListItem>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualList;
