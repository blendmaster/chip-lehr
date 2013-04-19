var chips, slicingLayout, op, init, current, ref$, SVGL, width, height, sliceDirection, opposite, lineDimension, oppDimension, expr, visit, i, len$, n, tree, nodes, links, len1$;
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
function slicingRectangle(layout, position){
  var children, x0$, left, right, dir, opp, lineDim, lineOpp, leftRect, rightRect, ref$, x1$, x2$, x3$, x4$;
  children = layout.children;
  position == null && (position = {
    x: 0,
    y: 0
  });
  x0$ = SVGL('svg');
  x0$.setAttribute('class', "layout-slice layout-slice-" + layout.node);
  x0$.setAttribute('width', layout.width);
  x0$.setAttribute('height', layout.height);
  x0$.setAttribute('x', position.x);
  x0$.setAttribute('y', position.y);
  if (children != null) {
    left = children[0], right = children[1];
    dir = sliceDirection[layout.node];
    opp = opposite[dir];
    lineDim = lineDimension[dir];
    lineOpp = oppDimension[lineDim];
    leftRect = slicingRectangle(left);
    rightRect = slicingRectangle(right, (ref$ = {}, ref$[lineDim] = 0, ref$[lineOpp] = left[opp], ref$));
    x0$.appendChild(leftRect);
    x0$.appendChild(rightRect);
    x0$.appendChild((x1$ = SVGL('line'), x1$.setAttribute('class', "layout-line layout-line-" + layout.node), x1$.setAttribute('id', "l" + layout.preorder), x1$.setAttribute(lineDim + '1', 0), x1$.setAttribute(lineDim + '2', layout[dir]), x1$.setAttribute(lineOpp + '1', left[opp]), x1$.setAttribute(lineOpp + '2', left[opp]), x1$));
  } else {
    x0$.appendChild((x2$ = SVGL('rect'), x2$.setAttribute('id', "l" + layout.preorder), x2$.setAttribute('class', 'layout-rect'), x2$.setAttribute('width', '100%'), x2$.setAttribute('height', '100%'), x2$));
    x0$.appendChild((x3$ = SVGL('rect'), x3$.setAttribute('id', "chip" + layout.node), x3$.setAttribute('class', 'chip-rect'), x3$.setAttribute('width', layout.chip.width), x3$.setAttribute('height', layout.chip.height), x3$.setAttribute('x', layout.width / 2 - layout.chip.width), x3$.setAttribute('y', layout.chip.height), x3$));
    x0$.appendChild((x4$ = SVGL('text'), x4$.setAttribute('class', 'layout-text'), x4$.setAttribute('x', layout.width / 2), x4$.setAttribute('y', layout.height / 2), x4$.textContent = layout.node, x4$));
  }
  return x0$;
}
expr = [];
visit = function(it){
  var that, i$, x0$, len$;
  if (that = it.children) {
    for (i$ = 0, len$ = that.length; i$ < len$; ++i$) {
      x0$ = that[i$];
      visit(x0$);
    }
  }
  return expr.push(it);
};
visit(slicingLayout);
for (i = 0, len$ = expr.length; i < len$; ++i) {
  n = expr[i];
  n.postorder = i;
}
tree = d3.layout.tree().size([400, 400]);
nodes = tree.nodes(slicingLayout);
links = tree.links(nodes);
for (i = 0, len1$ = nodes.length; i < len1$; ++i) {
  n = nodes[i];
  n.preorder = i;
}
document.addEventListener('DOMContentLoaded', function(){
  var layoutRoot, link, nodeGroup, circles, exprRoot, highlight, setClass, highlightTree, mouseover, mouseout, tokens, i, ref$, len$, n;
  document.getElementById('slicing-rectangle').appendChild(slicingRectangle(slicingLayout));
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