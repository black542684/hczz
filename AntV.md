<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>流程图</title>
    <style>::-webkit-scrollbar{display:none;}html,body{overflow:hidden;margin:0;}</style>
</head>
<body>
<div id="mountNode"></div>
<script>/*Fixing iframe window.innerHeight 0 issue in Safari*/document.body.clientHeight;</script>
<script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.g6-3.0.0/build/g6.js"></script>
<script src="https://gw.alipayobjects.com/os/antv/assets/lib/jquery-3.2.1.min.js"></script>
<script src="https://gw.alipayobjects.com/os/lib/dagre/0.8.4/dist/dagre.min.js"></script>
<script>
  var data = {
    nodes: [{
      id: '1'
  }, {
      id: '2'
  }, {
      id: '33'
  }, {
      id: '44'
  }, {
      id: '55'
  }, {
      id: '66'
  }, {
      id: '77'
  }, {
      id: '88'
  }],
    edges: [{
      source: '1',
      target: '2'
  }, {
      source: '2',
      target: '33'
  }, {
      source: '2',
      target: '44'
  }, {
      source: '2',
      target: '55'
  }, {
      source: '33',
      target: '66'
  }, {
      source: '44',
      target: '77'
  }, {
      source: '55',
      target: '88'
  }]
  };
  var g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(function() {
    return {};
  });
  g.setGraph({
    rankdir: 'TB'
  });
  data.nodes.forEach(function(node) {
    node.label = node.id;
    g.setNode(node.id, {
      width: 150,
      height: 50
    });
  });
  data.edges.forEach(function(edge) {
    g.setEdge(edge.source, edge.target);
  });
  dagre.layout(g);
  var coord = void 0;
  g.nodes().forEach(function(node, i) {
    coord = g.node(node);
    data.nodes[i].x = coord.x;
    data.nodes[i].y = coord.y;
  });
  g.edges().forEach(function(edge, i) {
    coord = g.edge(edge);
    data.edges[i].startPoint = coord.points[0];
    data.edges[i].endPoint = coord.points[coord.points.length - 1];
    data.edges[i].controlPoints = coord.points.slice(1, coord.points.length - 1);
  });
  G6.registerNode('operation', {
    drawShape: function drawShape(cfg, group) {
      var rect = group.addShape('rect', {
        attrs: {
          x: -75,
          y: -25,
          width: 150,
          height: 50,
          radius: 10,
          stroke: 'red',        //  节点边框颜色
          fill: 'green',        //  节点背景颜色
          fillOpacity: 0.45,    //  节点背景透明度
          lineWidth: 2          //  边框宽
        }
      });
      return rect;
    }
  }, 'single-shape');

  var graph = new G6.Graph({
    container: 'mountNode',
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: 2,
    modes: {
      default: ['drag-canvas', 'zoom-canvas']
    },
    defaultNode: {
      shape: 'operation',
      labelCfg: {
        style: {
          fill: '#666',
          fontSize: 14,
          fontWeight: 'bold'
        }
      }
    },
    defaultEdge: {
      shape: 'polyline'
    },
    edgeStyle: {
      default: {
        endArrow: true,
        lineWidth: 2,
        stroke: '#ccc'
      }
    }
  });
  graph.data(data);
  graph.render();
  graph.fitView();
</script>
</body>
</html>
