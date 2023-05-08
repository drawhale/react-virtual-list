import type { FC } from "react";
import VirtualList from "./VirtualList";

const List: FC = () => {
  const datas = new Array(100).fill(0).map((_, index) => index + 1);
  return (
    <VirtualList>
      {datas.map((data, index) => (
        <div
          key={index}
          style={{
            height: `${Math.trunc(Math.random() * 100 + 20)}px`,
            borderBottom: "1px solid #ccc",
          }}
        >
          Item {data}
        </div>
      ))}
    </VirtualList>
  );
};

export default List;
