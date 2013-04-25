var chips, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot, layoutBorder, move, R, P, slice$ = [].slice;
function displayLayout(expr){
  var layout, preordered, postordered, i, len$, n, len1$, slicingSvgLayout, maxDim, scale, rectangles, x0$, x1$, group, x2$, lines, x3$, tree, nodes, links, link, linkNodes, x4$, nodeGroup, x5$, g, x6$, circles, tokens, x7$, x8$, x9$, highlight, setClass, highlightTree, mouseover, mouseout;
  dNumber(expr);
  layout = treeFrom(expr);
  preordered = preorder(layout);
  postordered = postorder(layout);
  for (i = 0, len$ = postordered.length; i < len$; ++i) {
    n = postordered[i];
    n.postorder = i;
  }
  for (i = 0, len1$ = preordered.length; i < len1$; ++i) {
    n = preordered[i];
    n.preorder = i;
  }
  calculateSize(layout);
  expandRects(layout);
  slicingSvgLayout = flatSvgLayout(layout);
  maxDim = 10 * Math.max(layout.width, layout.height);
  scale = 300 / maxDim;
  layoutRoot.transition().duration(750).attr('transform', "scale(" + scale + ")");
  layoutBorder.transition().duration(750).attr({
    width: layout.width * 10,
    height: layout.height * 10
  });
  rectangles = rectRoot.selectAll('g.layout-area').data(slicingSvgLayout.rectangles, function(it){
    return it.id;
  });
  x0$ = rectangles;
  x1$ = x0$.enter();
  group = x1$.append('svg:g').attr('class', 'layout-area').attr({
    transform: function(arg$){
      var rectX, rectY;
      rectX = arg$.rectX, rectY = arg$.rectY;
      return "translate(" + 10 * rectX + ", " + 10 * rectY + ")";
    }
  });
  x2$ = group;
  x2$.append('svg:rect').attr('class', 'layout-rect').attr({
    width: function(it){
      return it.width * 10;
    },
    height: function(it){
      return it.height * 10;
    }
  });
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
  x4$.exit().transition().duration(750).style('stroke-opacity', 0).remove();
  x4$.enter().append('svg:path').attr('class', 'link').style('stroke-opacity', 0);
  x4$.transition().duration(750).attr('d', link).style('stroke-opacity', 1);
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
  exprRoot.attr({
    width: expr.length * 50,
    height: 100
  });
  tokens = exprRoot.selectAll('.token').data(postordered, function(it){
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
  }).each('end', function(){
    return d3.select(this).on('mouseover', mouseover).on('mouseout', mouseout);
  });
  highlight = function(it, className, state){
    d3.select(tokens[0][it.idx]).classed(className, state);
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
  mouseout = function(){
    d3.selectAll('.hovered').classed('hovered', false);
    d3.selectAll('.left-hovered').classed('left-hovered', false);
    d3.selectAll('.right-hovered').classed('right-hovered', false);
  };
  nodeGroup.on('mouseover', mouseover).on('mouseout', mouseout);
  rectangles.on('mouseover', mouseover).on('mouseout', mouseout);
  lines.on('mouseover', mouseover).on('mouseout', mouseout);
  tokens.on('click', function(node){
    var it, next, newExpr, last, current, len, i, to$, to1$;
    it = expr[node.idx];
    next = expr[it.idx + 1];
    if (it.operand && (next != null && next.operand)) {
      newExpr = move[0](expr, it, next);
    } else if (it.operator) {
      if (next != null && (next != null && next.operand) && valid(expr, it, next)) {
        newExpr = move[2](expr, it, next);
      } else {
        last = expr[it.idx - 1];
        if (!(last != null && last.operand)) {
          return;
        }
        current = it.node;
        len = 0;
        for (i = it.idx + 1, to$ = expr.length; i < to$; ++i) {
          if (expr[i].operator && expr[i].node !== current) {
            current = expr[i].node;
            len++;
          } else {
            break;
          }
        }
        newExpr = move[1](expr, it.idx, len);
      }
    } else if (it.operand) {
      for (i = it.idx + 1, to1$ = expr.length; i < to1$; ++i) {
        if (expr[i].operand) {
          newExpr = move[0](expr, it, expr[i]);
          break;
        }
      }
    }
    if (newExpr != null) {
      tokens.on('mouseover', null).on('mouseout', null);
      packHash(newExpr, chips);
    }
  });
}
move = [
  (function(){
    function move1(expr, operand1, operand2){
      var x0$, tmp, ref$;
      x0$ = expr.map(function(it){
        return import$({}, it);
      });
      tmp = x0$[operand1.idx];
      x0$[operand1.idx] = (ref$ = x0$[operand2.idx], ref$.idx = operand1.idx, ref$);
      x0$[operand2.idx] = (tmp.idx = operand2.idx, tmp);
      return x0$;
    }
    return move1;
  }()), (function(){
    function move2(expr, chainStart, len){
      var x0$, i, to$, ref$;
      x0$ = expr.map(function(it){
        return import$({}, it);
      });
      for (i = chainStart, to$ = chainStart + len; i <= to$; ++i) {
        (ref$ = x0$[i]).node = complement[ref$.node];
      }
      return x0$;
    }
    return move2;
  }()), (function(){
    function move3(expr, alpha1, alpha2){
      var x0$, tmp, ref$;
      x0$ = expr.map(function(it){
        return import$({}, it);
      });
      tmp = x0$[alpha1.idx];
      x0$[alpha1.idx] = (ref$ = x0$[alpha2.idx], ref$.idx = alpha1.idx, ref$);
      x0$[alpha2.idx] = (tmp.idx = alpha2.idx, tmp);
      return x0$;
    }
    return move3;
  }())
];
function valid(expr, alpha1, alpha2){
  var alpha3;
  alpha3 = expr[alpha2.idx + 1];
  if (alpha3 != null && alpha3.node === alpha1.node) {
    return false;
  }
  if (alpha1.operand && alpha2.operator) {
    return 2 * alpha2.d < alpha1.idx;
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
window.addEventListener('hashchange', function(){
  var data;
  data = unpackHash();
  chips = data.chips;
  displayLayout(data.expr);
});
document.addEventListener('DOMContentLoaded', function(){
  var data, history;
  layoutRoot = d3.select('#slicing-rectangle').append('svg:svg').attr({
    width: 300,
    height: 300
  }).append('svg:g').attr('class', 'layout-container');
  rectRoot = layoutRoot.append('svg:g').attr('class', 'layout-rectangles');
  layoutBorder = layoutRoot.append('svg:rect').attr({
    id: 'layout-border',
    width: '100%',
    height: '100%'
  });
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
  data = unpackHash();
  chips = data.chips;
  displayLayout(data.expr);
  history = d3.select('#history');
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}