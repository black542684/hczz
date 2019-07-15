<template>
  <div class="flow-chart" id="flowChart"></div>
</template>
<script>
import G6 from "@antv/g6";
//  引入流程图节点图片
import processNodeDefault from "../../static/image/processNodeDefault.png";
import processNodeSuccess from "../../static/image/processNodeSuccess.png";
export default {
  name: "flowChart",
  data() {
    return {};
  },
  props: ["chartData", "processIsShow",'aNum'],
  watch: {
    processIsShow(nv) {
      if (!nv) return
      let nodes = [];
      let edges = [];
      this.chartData.elements.forEach(item => {
        let currentImg =
          item.current || item.completed
            ? processNodeSuccess
            : processNodeDefault;
        if (item.id !== "startEvent1") {
          nodes.push({
            id: item.id,
            x: item.x,
            y: item.y,
            size: [40, 40],
            shape: "image",
            img: currentImg,
            label: `
            ${item.userName} ${item.name}
            ${item.endTime}`,
            labelCfg: {
              position: "bottom",
              textAlign: "left"
            }
          });
        }
      });
      this.chartData.flows.forEach(item => {
        if (item.sourceRef !== "startEvent1") {
          edges.push({
            source: item.sourceRef,
            target: item.targetRef,
            style: {
              endArrow: true
            }
          });
        }
      });
      const data = {
        nodes: nodes,
        edges: edges
      }
      this.initChart(data)
    }
  },
  created() {},
  methods: {
    initChart(data) {
        //graph.destroy();
      const graph = new G6.Graph({
        container: "flowChart",
        width: 1306,
        height: 480,
        nodeStyle: {
          default: {
            fill: "#f7faff", //  节点背景色
            stroke: "#c0ccd7" //  节点边框色
          }
        },
        edgeStyle: {
          default: {
            stroke: "#bfcbd6", //  连接线颜色
            lineWidth: 2
          }
        }
      });
      graph.read(data);
    }
  }
};
</script>

