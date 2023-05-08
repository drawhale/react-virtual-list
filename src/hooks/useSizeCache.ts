import { useMemo, useState } from "react";

type ItemSize = { width: number; height: number };

type UseSizeCacheProps = {
  totalItemCount: number;
  defaultItemHeight: number;
};

const useSizeCache = (props: UseSizeCacheProps) => {
  const { totalItemCount, defaultItemHeight } = props;
  const sizeCache = useMemo(
    () => new SizeCache({ totalItemCount, defaultItemHeight }),
    [totalItemCount, defaultItemHeight]
  );
  const [visibleItemCount, setVisibleItemCount] = useState(0);

  const setVisibleItemSize = () => {
    setVisibleItemCount((prevCount) => prevCount + 1);
  };

  return { sizeCache, visibleItemCount, setVisibleItemSize };
};

class SizeCache {
  private _itemSizes: ItemSize[] = [];
  private _itemAccumulateHeights: number[] = [];

  constructor(params: { totalItemCount: number; defaultItemHeight: number }) {
    const { totalItemCount, defaultItemHeight } = params;
    this._itemSizes = new Array(totalItemCount).fill({
      width: 0,
      height: defaultItemHeight,
    });
  }

  public setItemSize(index: number, size: ItemSize) {
    this._itemSizes[index] = size;
    this.setAccumulateHeights();
  }

  public getItemSizes() {
    return this._itemSizes;
  }

  public getItemSize(index: number) {
    return this._itemSizes[index];
  }

  private setAccumulateHeights = () => {
    this._itemAccumulateHeights = this._itemSizes.reduce(
      (acc, itemSize, index) => {
        if (index === 0) return [itemSize.height];
        acc[index] = acc[index - 1] + itemSize.height;
        return acc;
      },
      [] as number[]
    );
  };

  public getHeightToIndex = (index: number) => {
    if (index <= 0) return 0;
    return this._itemAccumulateHeights[index - 1];
  };

  public getTotalHeight = () => {
    return this._itemAccumulateHeights[this._itemSizes.length - 1];
  };

  public getIndexOfTopPosition = (top: number) => {
    for (let index = 1; index < this._itemSizes.length; index++) {
      if (
        this._itemAccumulateHeights[index - 1] < top &&
        top <= this._itemAccumulateHeights[index]
      ) {
        return index;
      }
    }

    return 0;
  };

  public getEndIndexOfVisibleItems = (
    startIndex: number,
    viewportHeight: number
  ) => {
    let visibleHeight = 0;

    for (let index = startIndex; index < this._itemSizes.length; index++) {
      visibleHeight += this._itemSizes[index].height;
      if (visibleHeight >= viewportHeight) {
        return Math.min(index + 1, this._itemSizes.length);
      }
    }

    return this._itemSizes.length;
  };
}

export default useSizeCache;
