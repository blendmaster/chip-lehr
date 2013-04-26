var chips, layoutRoot, rectRoot, lineRoot, treeRoot, linkRoot, nodeRoot, exprRoot, layoutBorder, move, annealing, last;
function displayLayout(expr){
  var layout, preordered, postordered, i, len$, n, len1$, slicingSvgLayout, maxDim, scale, rectangles, x0$, x1$, group, x2$, lines, x3$, tree, nodes, links, link, linkNodes, x4$, nodeGroup, x5$, g, x6$, texts, circles, maxWidth, exprWidth, charWidth, tokens, x7$, x8$, x9$, highlight, setClass, highlightTree, mouseover, mouseout;
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
  $('area').value = layout.width * layout.height;
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
  x0$.exit().remove();
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
    return Math.max(8, Math.min(36, it.height * 10, it.width * 10)) + "px";
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
  x3$.exit().remove();
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
  nodeGroup.exit().remove();
  x5$ = nodeGroup.enter();
  g = x5$.append('svg:g').attr({
    'class': 'node',
    transform: 'translate(0,0)'
  });
  x6$ = g;
  x6$.append('svg:circle').attr({
    'class': 'node-dot',
    r: 10
  });
  x6$.append('svg:text').attr({
    'class': 'node-text'
  });
  texts = nodeGroup.select('.node-text');
  nodeGroup.filter(function(it){
    var t;
    t = this.querySelector('.node-text');
    return it.node != t.textContent;
  }).insert('svg:circle', ':first-child').attr({
    'class': 'highlight-dot',
    r: 10
  }).style({
    fill: '#000'
  }).transition().duration(750).attr('r', 30).style('opacity', 0).remove();
  texts.text(function(it){
    return it.node;
  });
  nodeGroup.transition().duration(750).attr('transform', function(arg$){
    var x, y;
    x = arg$.x, y = arg$.y;
    return "translate(" + x + ", " + y + ")";
  });
  circles = nodeGroup.select('.node-dot');
  maxWidth = document.documentElement.clientWidth - 100;
  exprWidth = Math.min(maxWidth, expr.length * 50);
  charWidth = exprWidth / expr.length;
  exprRoot.attr({
    width: exprWidth,
    height: 100
  });
  tokens = exprRoot.selectAll('.token').data(postordered, function(it){
    return it.id;
  });
  x7$ = tokens;
  x7$.exit().remove();
  x7$.filter(function(it){
    var t;
    t = this.querySelector('.token-text');
    return it.node != t.textContent;
  }).insert('svg:circle', ':first-child').attr({
    'class': 'highlight-dot',
    r: 10
  }).style({
    fill: '#000'
  }).transition().duration(750).attr('r', 50).style('opacity', 0).remove();
  x8$ = x7$.enter();
  g = x8$.append('svg:g').attr('class', 'token').attr('transform', 'translate(0,0)');
  x9$ = g;
  x9$.append('svg:rect').attr({
    'class': 'token-rect',
    height: 50,
    x: -(charWidth / 2),
    y: -25
  });
  x9$.append('text').attr({
    'class': 'token-text'
  });
  x7$.select('.token-text').text(function(it){
    return it.node;
  }).transition().duration(750).style('font-size', function(){
    return Math.max(8, Math.min(36, charWidth / 2)) + "px";
  });
  x7$.select('.token-rect').transition().duration(750).attr({
    width: charWidth
  });
  x7$.transition().duration(750).attr({
    transform: function(_, i){
      return "translate(" + (i * charWidth + charWidth / 2) + ", 50)";
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
    var it, next, moveNo, n, newExpr, last, current, len, i, to$;
    it = expr[node.idx];
    next = expr[it.idx + 1];
    moveNo = $$('input[type=radio]').filter(function(it){
      return it.checked;
    })[0].value;
    switch (moveNo) {
    case '0':
      if (it.operand) {
        n = it.idx + 1;
        while (next != null && next.operator) {
          next = expr[n++];
        }
        if (next != null) {
          newExpr = move[0](expr, it, next);
        }
      }
      break;
    case '1':
      last = expr[it.idx - 1];
      if (it.operator && (last == null || last.operand)) {
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
      break;
    case '2':
      if (it.operator) {
        if ((next != null && next.operand) && valid(expr, it, next)) {
          newExpr = move[2](expr, it, next);
        }
      } else {
        if ((next != null && next.operator) && valid(expr, it, next)) {
          newExpr = move[2](expr, it, next);
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
  } else {
    if (alpha1.operand && alpha2.operator) {
      return 2 * alpha2.d < alpha1.idx + 1;
    } else {
      return true;
    }
  }
}
window.addEventListener('hashchange', function(){
  var data;
  data = unpackHash();
  chips = data.chips;
  displayLayout(data.expr);
});
annealing = {};
document.addEventListener('DOMContentLoaded', function(){
  var data;
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
  $('chips').value = chips.map(function(it){
    return it.width + "x" + it.height;
  }).join('    ');
  $('load').onclick = function(){
    var loadedChips, i$, x0$, len$, expr, e;
    try {
      loadedChips = unpackChips($('chips').value);
      for (i$ = 0, len$ = loadedChips.length; i$ < len$; ++i$) {
        x0$ = loadedChips[i$];
        if (!(x0$.width && x0$.height)) {
          throw new Error("I don't think those are valid chips...");
        }
      }
      expr = initialExpr(loadedChips);
      packHash(expr, loadedChips);
    } catch (e$) {
      e = e$;
      alert(e.message);
    }
  };
  $('randomize').onclick = function(){
    var no, newChips, res$, i, to$, expr;
    no = parseInt($('rand-no').value, 10);
    $('rand-no').value = no;
    res$ = [];
    for (i = 0, to$ = Math.max(10, Math.min(25, no)); i < to$; ++i) {
      res$.push({
        width: Math.random() * 15 | 0 + 1,
        height: Math.random() * 10 | 0 + 1
      });
    }
    newChips = res$;
    $('chips').value = newChips.map(function(it){
      return it.width + "x" + it.height;
    }).join('    ');
    expr = initialExpr(newChips);
    packHash(expr, newChips);
  };
  displayLayout(data.expr);
  annealing.movesEl = $('moves');
  annealing.lastCostEl = $('last-cost');
  annealing.bestCostEl = $('best-cost');
  annealing.tempMeterEl = $('temp-meter');
  annealing.start = $('start');
  annealing.stop = $('stop');
  annealing.start.disabled = false;
  annealing.stop.disabled = true;
  annealing.movesEl.value = 0;
  annealing.lastCostEl.value = 0;
  annealing.bestCostEl.value = 0;
  annealing.start.onclick = startAnnealing;
  annealing.stop.onclick = stopAnnealing;
});
function startAnnealing(){
  var expr, tree, a, x0$;
  expr = unpackHash().expr;
  tree = treeFrom(expr);
  calculateSize(tree);
  a = annealing;
  a.movesEl.value = 0;
  a.lastCostEl.value = tree.width * tree.height;
  a.bestCostEl.value = tree.width * tree.height;
  a.start.disabled = true;
  a.stop.disabled = false;
  x0$ = a.worker = new Worker('anneal.js');
  x0$.onmessage = annealMessage;
  x0$.postMessage({
    chips: chips,
    expr: expr
  });
  return x0$;
}
function stopAnnealing(){
  var a;
  annealing.worker.terminate();
  a = annealing;
  a.start.disabled = false;
  a.stop.disabled = true;
  return packHash(a.bestExpr, chips);
}
last = Date.now();
function annealMessage(arg$){
  var data, a, x0$;
  data = arg$.data;
  a = annealing;
  switch (data.type) {
  case 'log':
    return console.log(data.message);
  case 'init':
    return a.tempMeterEl.max = data.temp;
  case 'new-expr':
    return packHash(a.bestExpr, chips);
  case 'progress':
    a.bestExpr = data.best;
    a.movesEl.value = data.moves;
    a.lastCostEl.value = data.curCost;
    a.bestCostEl.value = data.bestCost;
    x0$ = a.tempMeterEl;
    x0$.value = data.temp;
    x0$.textContent = data.temp;
    if (Date.now() - last > 1000) {
      last = Date.now();
      return packHash(data.cur, chips);
    }
    break;
  case 'done':
    return stopAnnealing();
  }
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}