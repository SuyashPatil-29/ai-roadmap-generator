import { HierarchyNode, hierarchy, tree } from "d3-hierarchy";
import { ReactFlowProvider } from "reactflow";
import { Node } from "../shared/types/common";
import { Drawer } from "./drawer";
import "reactflow/dist/base.css";
import "reactflow/dist/style.css";
import ReactFlowPro from "./react-flow-pro";

type Props = {
  data: Node[];
};

function ExpandCollapse(props: Props) {
  const { data } = props;

  const h: HierarchyNode<unknown> = hierarchy<unknown>(data[0]);
  h.descendants().forEach((d: any, i: number) => {
    d.id = `${i}`;
    d._children = d.children;
    d.children = null;
  });

  return (
    <div className="w-full h-[90vh]">
      <ReactFlowProvider>
        <Drawer />
        <ReactFlowPro {...props} h={h} data={data} />
      </ReactFlowProvider>
    </div>
  );
}

export default ExpandCollapse;
