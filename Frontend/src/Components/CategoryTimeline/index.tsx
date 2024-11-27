import { Timeline } from "@mantine/core";
import { ICategory } from "../../Types/Category";
import { memo } from "react";

interface Props {
  parentCategory: ICategory[];
  setNewParentId: (value: string) => void;
}

const CategoryTimeline = memo(({ parentCategory, setNewParentId }: Props) => {
  const timelineItem = parentCategory.map((x, index) => {
    return (
      <Timeline.Item
        className={parentCategory.length - 1 == index ? "" : "pointer"}
        key={x.id}
        title={x.name}
        onClick={() => {
          if (parentCategory.length - 1 == index) {
            return;
          }
          setNewParentId(x.id);
        }}
      ></Timeline.Item>
    );
  });

  return <Timeline active={parentCategory.length - 1}>{timelineItem}</Timeline>;
});

export default CategoryTimeline;
