import { Timeline } from "@mantine/core";
import { ICategory } from "../../Types/Category";
import { memo } from "react";

interface Props {
  parentCategory: ICategory[];
  setNewParentId: (value: string) => void;
}

const CategoryTimeline = memo(({ parentCategory, setNewParentId }: Props) => {
  const timelineItem = parentCategory.map((x) => {
    return <Timeline.Item className="pointer" key={x.id} title={x.name} onClick={() => setNewParentId(x.id)}></Timeline.Item>;
  });

  return <Timeline active={parentCategory.length - 1}>{timelineItem}</Timeline>;
});

export default CategoryTimeline;
