var chips, slicingLayout, op, init, current, ref$, SVGL, width, height, sliceDirection, opposite, lineDimension, oppDimension, preordered, postordered, expr, i, len$, n, len1$, tree, nodes, links, slicingSvgLayout, slice$ = [].slice;
chips = [
  {
    width: 10,
    height: 10
  }, {
    width: 5,
    height: 12
  }, {
    width: 3,
    height: 2
  }, {
    width: 5,
    height: 3
  }, {
    width: 8,
    height: 8
  }, {
    width: 3,
    height: 5
  }, {
    width: 6,
    height: 6
  }, {
    width: 1,
    height: 1
  }
];
function initialLayout(chips, n){
  n == null && (n = 0);
  return {
    node: 'H',
    children: [
      {
        node: n,
        width: chips[0].width * 10,
        height: chips[0].height * 10,
        chip: chips[0]
      }, chips.length === 2
        ? {
          node: n + 1,
          width: chips[1].width * 10,
          height: chips[1].height * 10,
          chip: chips[1]
        }
        : initialLayout(chips.slice(1), n + 1)
    ]
  };
}
slicingLayout = initialLayout(chips);
op = {
  H: 'V',
  V: 'H'
};
init = slicingLayout.node;
current = slicingLayout;
while (current = (ref$ = current.children) != null ? ref$[1] : void 8) {
  init = op[init];
  if (!(current.node !== 'H' && current.node !== 'V')) {
    current.node = init;
  }
}
SVGL = function(it){
  return document.createElementNS('http://www.w3.org/2000/svg', it);
};
width = height = 500;
sliceDirection = {
  H: 'width',
  V: 'height'
};
opposite = {
  width: 'height',
  height: 'width'
};
lineDimension = {
  width: 'x',
  height: 'y'
};
oppDimension = {
  x: 'y',
  y: 'x'
};
function calculateSize(layout){
  var left, right, dir, opp, fitted;
  if (layout.children != null) {
    left = calculateSize(layout.children[0]);
    right = calculateSize(layout.children[1]);
    dir = sliceDirection[layout.node];
    opp = opposite[dir];
    fitted = Math.max(left[dir], right[dir]);
    setSize(left, dir, fitted);
    setSize(right, dir, fitted);
    return layout[dir] = fitted, layout[opp] = left[opp] + right[opp], layout;
  } else {
    return layout;
  }
}
function setSize(layout, dir, value){
  var that;
  layout[dir] = value;
  if (that = sliceDirection[layout.node] === dir && layout.children) {
    setSize(that[0], dir, value);
    return setSize(that[1], dir, value);
  }
}
slicingLayout = calculateSize(slicingLayout);
console.log(slicingLayout);
function flatSvgLayout(layout, pos){
  var rectangles, sliceLines, ref$, left, right, dir, opp, lineDim, lineOpp, leftLayout, rightLayout, ref1$;
  pos == null && (pos = {
    x: 0,
    y: 0
  });
  rectangles = [];
  sliceLines = [];
  if (layout.children) {
    ref$ = layout.children, left = ref$[0], right = ref$[1];
    dir = sliceDirection[layout.node];
    opp = opposite[dir];
    lineDim = lineDimension[dir];
    lineOpp = oppDimension[lineDim];
    sliceLines.push((layout[lineDim + '1'] = pos[lineDim], layout[lineDim + '2'] = pos[lineDim] + layout[dir], layout[lineOpp + '1'] = pos[lineOpp] + left[opp], layout[lineOpp + '2'] = pos[lineOpp] + left[opp], layout));
    leftLayout = flatSvgLayout(left, pos);
    rightLayout = flatSvgLayout(right, (ref1$ = {}, ref1$[lineDim] = pos[lineDim], ref1$[lineOpp] = pos[lineOpp] + left[opp], ref1$));
    rectangles.push.apply(rectangles, slice$.call(leftLayout.rectangles).concat(slice$.call(rightLayout.rectangles)));
    sliceLines.push.apply(sliceLines, slice$.call(leftLayout.sliceLines).concat(slice$.call(rightLayout.sliceLines)));
  } else {
    rectangles.push((layout.rectX = pos.x, layout.rectY = pos.y, layout));
  }
  return {
    rectangles: rectangles,
    sliceLines: sliceLines
  };
}
function preorder(it){
  var order, visit;
  order = [];
  visit = function(it){
    var that, i$, x0$, len$, results$ = [];
    order.push(it);
    if (that = it.children) {
      for (i$ = 0, len$ = that.length; i$ < len$; ++i$) {
        x0$ = that[i$];
        results$.push(visit(x0$));
      }
      return results$;
    }
  };
  visit(it);
  return order;
}
function postorder(it){
  var order, visit;
  order = [];
  visit = function(it){
    var that, i$, x0$, len$;
    if (that = it.children) {
      for (i$ = 0, len$ = that.length; i$ < len$; ++i$) {
        x0$ = that[i$];
        visit(x0$);
      }
    }
    return order.push(it);
  };
  visit(it);
  return order;
}
preordered = preorder(slicingLayout);
postordered = postorder(slicingLayout);
expr = postordered;
for (i = 0, len$ = postordered.length; i < len$; ++i) {
  n = postordered[i];
  n.postorder = i;
}
for (i = 0, len1$ = preordered.length; i < len1$; ++i) {
  n = preordered[i];
  n.preorder = i;
}
tree = d3.layout.tree().size([400, 400]);
nodes = tree.nodes(slicingLayout);
links = tree.links(nodes);
slicingSvgLayout = flatSvgLayout(slicingLayout);
console.log(slicingSvgLayout);
document.addEventListener('DOMContentLoaded', function(){
  var maxDim, scale, slicingLayoutRoot, rectangles, x0$, lines, layoutRoot, link, nodeGroup, circles, exprRoot, highlight, setClass, highlightTree, mouseover, mouseout, tokens, i, ref$, len$, n;
  maxDim = Math.max(slicingLayout.width, slicingLayout.height);
  scale = 300 / maxDim;
  slicingLayoutRoot = d3.select('#slicing-rectangle').append('svg:svg').attr({
    width: 300,
    height: 300
  }).append('svg:g').attr('class', 'layout-container').attr('transform', "scale(" + scale + ")");
  rectangles = slicingLayoutRoot.append('svg:g').attr('class', 'layout-rectangles').selectAll('g.layout-rectangle-group').data(slicingSvgLayout.rectangles).enter().append('svg:g').attr({
    'class': 'layout-area',
    transform: function(arg$){
      var rectX, rectY;
      rectX = arg$.rectX, rectY = arg$.rectY;
      return "translate(" + rectX + ", " + rectY + ")";
    }
  });
  x0$ = rectangles;
  x0$.append('svg:rect').attr({
    id: function(it){
      return "l" + it.preorder;
    },
    'class': 'layout-rect',
    width: function(it){
      return it.width;
    },
    height: function(it){
      return it.height;
    }
  });
  x0$.append('svg:rect').attr({
    'class': 'layout-chip',
    width: function(it){
      return it.chip.width * 10;
    },
    height: function(it){
      return it.chip.height * 10;
    },
    x: function(it){
      return (it.width - it.chip.width * 10) / 2;
    },
    y: function(it){
      return (it.height - it.chip.height * 10) / 2;
    }
  });
  x0$.append('svg:text').attr({
    'class': 'layout-text',
    x: function(it){
      return it.width / 2;
    },
    y: function(it){
      return it.height / 2;
    }
  }).style('font-size', function(it){
    return Math.max(8, Math.min(26, it.height)) + "px";
  }).text(function(it){
    return it.node;
  });
  lines = slicingLayoutRoot.append('svg:g').attr('class', 'layout-lines').selectAll('line.layout-line').data(slicingSvgLayout.sliceLines).enter().append('svg:line').attr({
    id: function(it){
      return "l" + it.preorder;
    },
    'class': 'layout-line',
    x1: function(it){
      return it.x1;
    },
    x2: function(it){
      return it.x2;
    },
    y1: function(it){
      return it.y1;
    },
    y2: function(it){
      return it.y2;
    }
  });
  layoutRoot = d3.select('#slicing-tree').append('svg:svg').attr({
    width: 500,
    height: 500
  }).append('svg:g').attr({
    'class': 'container',
    transform: 'translate(50, 50)'
  });
  link = d3.svg.diagonal();
  layoutRoot.selectAll('path.link').data(links).enter().append('svg:path').attr({
    'class': 'link',
    d: link
  });
  nodeGroup = layoutRoot.selectAll('g.node').data(nodes).enter().append('svg:g').attr({
    'class': 'node',
    transform: function(arg$){
      var x, y;
      x = arg$.x, y = arg$.y;
      return "translate(" + x + ", " + y + ")";
    }
  });
  circles = nodeGroup.append('svg:circle').attr({
    'class': 'node-dot',
    r: 20
  });
  nodeGroup.append('svg:text').attr({
    'class': 'node-text'
  }).text(function(it){
    return it.node;
  });
  exprRoot = d3.select('#polish-expression').append('p');
  highlight = function(it, className, state){
    d3.select(tokens[0][it.postorder]).classed(className, state);
    d3.select(circles[0][it.preorder]).classed(className, state);
    return d3.select("#l" + it.preorder).classed(className, state);
  };
  setClass = function(state){
    return function(it){
      var that;
      highlight(it, 'hovered', state);
      if (that = it.children) {
        highlightTree(that[0], 'left-hovered', state);
        return highlightTree(that[1], 'right-hovered', state);
      }
    };
  };
  highlightTree = function(root, className, state){
    var that;
    highlight(root, className, state);
    if (that = root.children) {
      highlightTree(that[0], className, state);
      return highlightTree(that[1], className, state);
    }
  };
  mouseover = setClass(true);
  mouseout = setClass(false);
  tokens = exprRoot.selectAll('span.token').data(expr).enter().append('span').attr({
    'class': 'token'
  }).text(function(it){
    return it.node;
  }).on('mouseover', mouseover).on('mouseout', mouseout);
  nodeGroup.on('mouseover', mouseover).on('mouseout', mouseout);
  rectangles.on('mouseover', mouseover).on('mouseout', mouseout);
  for (i = 0, len$ = (ref$ = nodes).length; i < len$; ++i) {
    n = ref$[i];
    (fn$.call(this, document.getElementById("l" + n.preorder), i, n));
  }
  function fn$(el, i, n){
    el.addEventListener('mouseover', function(){
      return mouseover.call(this, n);
    });
    el.addEventListener('mouseout', function(){
      return mouseout.call(this, n);
    });
  }
});