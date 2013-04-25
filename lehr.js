var oldExpr, expr, move, R, P, layoutRoot, rectRoot, lineRoot, exprRoot, treeRoot, linkRoot, nodeRoot, slice$ = [].slice;
function displayLayout(layout, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot){
  var preordered, postordered, i$, x0$, len$, i, len1$, n, len2$, slicingSvgLayout, maxDim, scale, rectangles, x1$, x2$, group, x3$, lines, x4$, tree, nodes, links, link, linkNodes, x5$, nodeGroup, x6$, g, x7$, circles, tokens, x8$, x9$, x10$, highlight, setClass, highlightTree, mouseover, mouseout;
  preordered = preorder(layout);
  postordered = postorder(layout);
  dNumber(postordered);
  for (i$ = 0, len$ = preordered.length; i$ < len$; ++i$) {
    x0$ = preordered[i$];
    delete x0$.parent;
  }
  for (i = 0, len1$ = postordered.length; i < len1$; ++i) {
    n = postordered[i];
    n.postorder = i;
  }
  for (i = 0, len2$ = preordered.length; i < len2$; ++i) {
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
  x1$ = rectangles;
  x2$ = x1$.enter();
  group = x2$.append('svg:g').attr('class', 'layout-area').attr('transform', "translate(0,0)");
  x3$ = group;
  x3$.append('svg:rect').attr('class', 'layout-rect');
  x3$.append('svg:rect').attr('class', 'layout-chip');
  x3$.append('svg:text').attr('class', 'layout-text');
  x1$.transition().duration(750).attr({
    transform: function(arg$){
      var rectX, rectY;
      rectX = arg$.rectX, rectY = arg$.rectY;
      return "translate(" + 10 * rectX + ", " + 10 * rectY + ")";
    }
  });
  x1$.select('.layout-rect').attr('id', function(it){
    return "l" + it.preorder;
  }).classed('left-hovered', false).classed('right-hovered', false).transition().duration(750).attr({
    width: function(it){
      return it.width * 10;
    },
    height: function(it){
      return it.height * 10;
    }
  });
  x1$.select('.layout-chip').transition().duration(750).attr({
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
  x1$.select('.layout-text').text(function(it){
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
  x4$ = lines;
  x4$.enter().append('svg:line').attr('class', 'layout-line');
  x4$.attr({
    id: function(it){
      return "l" + it.preorder;
    }
  });
  x4$.transition().duration(750).attr({
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
  x5$ = linkNodes;
  x5$.exit().transition().duration(750).style('stroke-opacity', 0).remove();
  x5$.enter().append('svg:path').attr('class', 'link').style('stroke-opacity', 0);
  x5$.transition().duration(750).attr('d', link).style('stroke-opacity', 1);
  nodeGroup = nodeRoot.selectAll('g.node').data(nodes, function(it){
    return it.id;
  });
  x6$ = nodeGroup.enter();
  g = x6$.append('svg:g').attr({
    'class': 'node',
    transform: 'translate(0,0)'
  });
  x7$ = g;
  x7$.append('svg:circle').attr({
    'class': 'node-dot',
    r: 20
  });
  x7$.append('svg:text').attr({
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
  circles = nodeGroup.select('.node-dot').classed('left-hovered', false).classed('right-hovered', false);
  expr = postordered;
  exprRoot.attr({
    width: postordered.length * 50,
    height: 100
  });
  tokens = exprRoot.selectAll('.token').data(expr, function(it){
    return it.id;
  });
  x8$ = tokens;
  x9$ = x8$.enter();
  g = x9$.append('svg:g').attr('class', 'token').attr('transform', 'translate(0,0)');
  x10$ = g;
  x10$.append('svg:rect').attr({
    'class': 'token-rect',
    width: 50,
    height: 50,
    x: -25,
    y: -25
  });
  x10$.append('text').attr({
    'class': 'token-text'
  });
  x8$.select('.token-text').text(function(it){
    return it.node;
  });
  x8$.classed('left-hovered', false);
  x8$.classed('right-hovered', false);
  x8$.transition().duration(750).attr({
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
  tokens.on('mouseover', mouseover).on('mouseout', mouseout);
  nodeGroup.on('mouseover', mouseover).on('mouseout', mouseout);
  rectangles.on('mouseover', mouseover).on('mouseout', mouseout);
  lines.on('mouseover', mouseover).on('mouseout', mouseout);
  tokens.on('click', function(it){
    var next, newExpr, last, current, len, i, to$, to1$, layout;
    next = expr[it.postorder + 1];
    if (it.operand && (next != null && next.operand)) {
      newExpr = move[0](expr, it, next);
    } else if (it.operator) {
      if (next != null && (next != null && next.operand) && valid(expr, it, next)) {
        newExpr = move[2](expr, it, next);
      } else {
        last = expr[it.postorder - 1];
        if (!(last != null && last.operand)) {
          return;
        }
        current = it.node;
        len = 0;
        for (i = it.postorder + 1, to$ = expr.length; i < to$; ++i) {
          if (expr[i].operator && expr[i].node !== current) {
            current = expr[i].node;
            len++;
          } else {
            break;
          }
        }
        newExpr = move[1](expr, it.postorder, len);
        console.log('moving 2');
      }
    } else if (it.operand) {
      for (i = it.postorder + 1, to1$ = expr.length; i < to1$; ++i) {
        if (expr[i].operand) {
          newExpr = move[0](expr, it, expr[i]);
          break;
        }
      }
    }
    if (newExpr != null) {
      oldExpr = expr;
      layout = layoutFrom(newExpr);
      displayLayout(layout, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot);
    }
  });
}
function undo(){
  var tmp, layout;
  tmp = expr;
  expr = oldExpr;
  oldExpr = tmp;
  console.log(oldExpr, tmp);
  layout = layoutFrom(expr);
  displayLayout(layout, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot);
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
      x0$[alpha1.postorder] = alpha2;
      x0$[alpha2.postorder] = alpha1;
      return x0$;
    }
    return move3;
  }())
];
function valid(expr, alpha1, alpha2){
  var alpha3;
  alpha3 = expr[alpha2.postorder + 1];
  if (alpha3 != null && alpha3.node === alpha1.node) {
    return false;
  }
  if (alpha1.operand && alpha2.operator) {
    return 2 * alpha2.d < alpha1.postorder;
  } else {
    return true;
  }
}
function cost(layout){
  return layout.width * layout.height;
}
R = 0.85;
function nextTemperature(oldTemp){
  return R * oldTemp;
}
function chooseMove(expr){
  var candidates, compLen, i, to$, compStart, last, start, to1$, len, to2$;
  candidates = [];
  compLen = 0;
  for (i = 0, to$ = expr.length - 1; i < to$; ++i) {
    if (expr[i].operand && expr[i + 1].operand) {
      candidates.push({
        move: 0,
        args: [expr[i], expr[i + 1]]
      });
    }
    if (expr[i].operator && expr[i].node !== last) {
      compStart = i;
      compLen++;
      last = expr[i].node;
    }
    if (expr[i].operand) {
      if (compLen > 0) {
        for (start = compStart, to1$ = compStart + compLen; start < to1$; ++start) {
          for (len = 1, to2$ = compStart + compLen - start; len <= to2$; ++len) {
            candidates.push({
              move: 1,
              args: [start, len]
            });
          }
        }
      }
      last = void 8;
      compLen = 0;
    }
    if (valid(expr, expr[i], expr[i + 1])) {
      candidates.push({
        move: 2,
        args: [expr[i], expr[i + 1]]
      });
    }
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}
P = 0.95;
function intialTemp(layout){
  var expr, c, moves, res$, i, m, newC, sum, avg;
  expr = postorder(layout);
  c = cost(layout);
  res$ = [];
  for (i = 0; i < 100; ++i) {
    m = chooseMove(expr);
    expr = move[m.move].apply(move, [expr].concat(slice$.call(m.args)));
    layout = layoutFrom(expr);
    calculateSize(layout);
    newC = cost(layout);
    if (newC > c) {
      res$.push(newC - c);
    }
  }
  moves = res$;
  sum = moves.reduce(function(a, b){
    return a + b;
  });
  avg = sum / moves.length;
  return -avg / Math.log(P);
}
function anneal(layout){
  var temp;
  temp = initialTemp(layout);
}
document.addEventListener('DOMContentLoaded', function(){
  var chips, layout, history;
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
  displayLayout(layout, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot);
  history = d3.select('#history');
  document.getElementById('undo').onclick = undo;
});