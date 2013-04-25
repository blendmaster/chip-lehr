var complement, sliceDirection, opposite, lineDimension, oppDimension, move, slice$ = [].slice;
function initialLayout(chips, n){
  n == null && (n = 0);
  return {
    node: 'H',
    id: "operator" + n,
    operand: false,
    operator: true,
    children: [
      {
        node: n,
        id: n,
        operand: true,
        operator: false,
        chip: chips[0]
      }, chips.length === 2
        ? {
          node: n + 1,
          id: n + 1,
          operand: true,
          operator: false,
          chip: chips[1]
        }
        : initialLayout(chips.slice(1), n + 1)
    ]
  };
}
complement = {
  H: 'V',
  V: 'H'
};
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
  var left, right, dir, opp, fitted, ref$;
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
    return layout.width = (ref$ = layout.chip).width, layout.height = ref$.height, layout;
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
function dNumber(expr){
  var zeros, i$, x0$, len$, d, results$ = [];
  zeros = 0;
  for (i$ = 0, len$ = expr.length; i$ < len$; ++i$) {
    x0$ = expr[i$];
    d = x0$.node === 'H' || x0$.node === 'V' ? 0 : 1;
    zeros += d;
    results$.push(x0$.d = zeros);
  }
  return results$;
}
function displayLayout(layout, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot){
  var preordered, postordered, i, len$, n, len1$, slicingSvgLayout, maxDim, scale, rectangles, x0$, x1$, group, x2$, lines, x3$, tree, nodes, links, link, linkNodes, x4$, nodeGroup, x5$, g, x6$, circles, expr, tokens, x7$, x8$, x9$, highlight, setClass, highlightTree, mouseover, mouseout;
  preordered = preorder(layout);
  postordered = postorder(layout);
  dNumber(postordered);
  for (i = 0, len$ = postordered.length; i < len$; ++i) {
    n = postordered[i];
    n.postorder = i;
  }
  for (i = 0, len1$ = preordered.length; i < len1$; ++i) {
    n = preordered[i];
    n.preorder = i;
  }
  calculateSize(layout);
  slicingSvgLayout = flatSvgLayout(layout);
  maxDim = 10 * Math.max(layout.width, layout.height);
  scale = 300 / maxDim;
  layoutRoot.transition().duration(750).attr('transform', "scale(" + scale + ")");
  rectangles = rectRoot.selectAll('g.layout-area').data(slicingSvgLayout.rectangles, function(it){
    return it.id;
  });
  x0$ = rectangles;
  x1$ = x0$.enter();
  group = x1$.append('svg:g').attr('class', 'layout-area').attr('transform', "translate(0,0)");
  x2$ = group;
  x2$.append('svg:rect').attr('class', 'layout-rect');
  x2$.append('svg:rect').attr('class', 'layout-chip');
  x2$.append('svg:text').attr('class', 'layout-text');
  x0$.transition().duration(750).attr({
    transform: function(arg$){
      var rectX, rectY;
      rectX = arg$.rectX, rectY = arg$.rectY;
      return "translate(" + 10 * rectX + ", " + 10 * rectY + ")";
    }
  });
  x0$.select('.layout-rect').attr('id', function(it){
    return "l" + it.preorder;
  }).transition().duration(750).attr({
    width: function(it){
      return it.width * 10;
    },
    height: function(it){
      return it.height * 10;
    }
  });
  x0$.select('.layout-chip').transition().duration(750).attr({
    width: function(it){
      return it.chip.width * 10;
    },
    height: function(it){
      return it.chip.height * 10;
    },
    x: function(it){
      return (it.width * 10 - it.chip.width * 10) / 2;
    },
    y: function(it){
      return (it.height * 10 - it.chip.height * 10) / 2;
    }
  });
  x0$.select('.layout-text').text(function(it){
    return it.node;
  }).transition().duration(750).style('font-size', function(it){
    return Math.max(8, Math.min(36, it.height * 10)) + "px";
  }).attr({
    x: function(it){
      return it.width * 10 / 2;
    },
    y: function(it){
      return it.height * 10 / 2;
    }
  });
  lines = lineRoot.selectAll('line.layout-line').data(slicingSvgLayout.sliceLines, function(it){
    return it.id;
  });
  x3$ = lines;
  x3$.enter().append('svg:line').attr('class', 'layout-line');
  x3$.attr({
    id: function(it){
      return "l" + it.preorder;
    }
  });
  x3$.transition().duration(750).attr({
    x1: function(it){
      return it.x1 * 10;
    },
    x2: function(it){
      return it.x2 * 10;
    },
    y1: function(it){
      return it.y1 * 10;
    },
    y2: function(it){
      return it.y2 * 10;
    }
  });
  tree = d3.layout.tree().size([400, 400]);
  nodes = tree.nodes(layout);
  links = tree.links(nodes);
  link = d3.svg.diagonal();
  linkNodes = linkRoot.selectAll('path.link').data(links, function(it){
    var s, t;
    s = it.source.id;
    t = it.target.id;
    if (s > t) {
      return s + "" + t;
    } else {
      return t + "" + s;
    }
  });
  x4$ = linkNodes;
  x4$.exit().remove();
  x4$.enter().append('svg:path').attr('class', 'link');
  x4$.transition().duration(750).attr('d', link);
  nodeGroup = nodeRoot.selectAll('g.node').data(nodes, function(it){
    return it.id;
  });
  x5$ = nodeGroup.enter();
  g = x5$.append('svg:g').attr({
    'class': 'node',
    transform: 'translate(0,0)'
  });
  x6$ = g;
  x6$.append('svg:circle').attr({
    'class': 'node-dot',
    r: 20
  });
  x6$.append('svg:text').attr({
    'class': 'node-text'
  });
  nodeGroup.select('.node-text').text(function(it){
    return it.node;
  });
  nodeGroup.transition().duration(750).attr('transform', function(arg$){
    var x, y;
    x = arg$.x, y = arg$.y;
    return "translate(" + x + ", " + y + ")";
  });
  circles = nodeGroup.select('.node-dot');
  expr = postordered;
  exprRoot.attr({
    width: postordered.length * 50,
    height: 100
  });
  tokens = exprRoot.selectAll('.token').data(expr, function(it){
    return it.id;
  });
  x7$ = tokens;
  x8$ = x7$.enter();
  g = x8$.append('svg:g').attr('class', 'token').attr('transform', 'translate(0,0)');
  x9$ = g;
  x9$.append('svg:rect').attr({
    'class': 'token-rect',
    width: 50,
    height: 50,
    x: -25,
    y: -25
  });
  x9$.append('text').attr({
    'class': 'token-text'
  });
  x7$.select('.token-text').text(function(it){
    return it.node;
  });
  x7$.transition().duration(750).attr({
    transform: function(_, i){
      return "translate(" + (i * 50 + 25) + ", 50)";
    }
  });
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
  tokens.classed('left-hovered', false).classed('right-hovered', false).on('mouseover', mouseover).on('mouseout', mouseout);
  nodeGroup.classed('left-hovered', false).classed('right-hovered', false).on('mouseover', mouseover).on('mouseout', mouseout);
  rectangles.classed('left-hovered', false).classed('right-hovered', false).on('mouseover', mouseover).on('mouseout', mouseout);
  lines.classed('left-hovered', false).classed('right-hovered', false).on('mouseover', mouseover).on('mouseout', mouseout);
  tokens.on('click', function(it){
    var next, newExpr, layout, current, len, i, to$;
    next = expr[it.postorder + 1];
    if (it.operand && (next != null && next.operand)) {
      newExpr = move[0](expr, it, next);
      layout = layoutFrom(newExpr);
      displayLayout(layout, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot);
    } else if (it.operator) {
      current = it.node;
      len = 0;
      for (i = it.postorder + 1, to$ = expr.length; i < to$; ++i) {
        if (expr[i].node !== current) {
          current = expr[i].node;
          len++;
        } else {
          break;
        }
      }
      newExpr = move[1](expr, it.postorder, len);
      layout = layoutFrom(newExpr);
      displayLayout(layout, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot);
    }
  });
}
function layoutFrom(expr){
  var stack, next, right, left;
  expr = expr.slice();
  stack = [expr.shift(), expr.shift()];
  while (next = expr.shift()) {
    if (next.operator) {
      right = stack.pop();
      left = stack.pop();
      next.children = [left, right];
    }
    stack.push(next);
  }
  return stack[0];
}
move = [
  (function(){
    function move1(expr, rect1, rect2){
      var x0$;
      x0$ = expr.slice();
      x0$[rect1.postorder] = rect2;
      x0$[rect2.postorder] = rect1;
      return x0$;
    }
    return move1;
  }()), (function(){
    function move2(expr, chainStart, len){
      var x0$, i, to$, ref$;
      x0$ = expr.slice();
      for (i = chainStart, to$ = chainStart + len; i <= to$; ++i) {
        (ref$ = x0$[i]).node = complement[ref$.node];
      }
      return x0$;
    }
    return move2;
  }()), (function(){
    function move3(expr, alpha1, alpha2){
      var x0$;
      x0$ = expr.slice();
      x0$[alpha1.postorder] = alpha1;
      x0$[alpha2.postorder] = alpha2;
      return x0$;
    }
    return move3;
  }())
];
function validity(alpha1, alpha2){
  if (alpha1.node === 'H' || alpha1.node === 'V') {
    return 2 * alpha2.d < alpha1.postorder;
  } else {
    return true;
  }
}
document.addEventListener('DOMContentLoaded', function(){
  var layoutRoot, rectRoot, lineRoot, exprRoot, treeRoot, linkRoot, nodeRoot, chips, layout, op, init, current, ref$;
  layoutRoot = d3.select('#slicing-rectangle').append('svg:svg').attr({
    width: 300,
    height: 300
  }).append('svg:g').attr('class', 'layout-container');
  rectRoot = layoutRoot.append('svg:g').attr('class', 'layout-rectangles');
  lineRoot = layoutRoot.append('svg:g').attr('class', 'layout-lines');
  exprRoot = d3.select('#polish-expression').append('svg:svg');
  treeRoot = d3.select('#slicing-tree').append('svg:svg').attr({
    width: 500,
    height: 500
  }).append('svg:g').attr({
    id: 'tree-root',
    transform: 'translate(50, 50)'
  });
  linkRoot = treeRoot.append('svg:g').attr({
    id: 'link-root'
  });
  nodeRoot = treeRoot.append('svg:g').attr({
    id: 'node-root'
  });
  chips = [
    {
      width: 10,
      height: 10
    }, {
      width: 6,
      height: 12
    }, {
      width: 3,
      height: 2
    }, {
      width: 5,
      height: 3
    }, {
      width: 5,
      height: 3
    }, {
      width: 5,
      height: 3
    }
  ];
  layout = initialLayout(chips);
  op = {
    H: 'V',
    V: 'H'
  };
  init = layout.node;
  current = layout;
  while (current = (ref$ = current.children) != null ? ref$[1] : void 8) {
    init = op[init];
    if (!(current.node !== 'H' && current.node !== 'V')) {
      current.node = init;
    }
  }
  displayLayout(layout, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot);
});