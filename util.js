var complement, sliceDirection, opposite, lineDimension, oppDimension, slice$ = [].slice;
function initialExpr(chips){
  var expr, n, i, ref$, len$, chip;
  expr = [{
    node: 0,
    id: 0,
    operand: true,
    operator: false,
    chip: chips[0],
    idx: 0
  }];
  n = 1;
  for (i = 0, len$ = (ref$ = chips.slice(1)).length; i < len$; ++i) {
    chip = ref$[i];
    expr.push({
      node: i + 1,
      id: i + 1,
      operand: true,
      operator: false,
      chip: chip,
      idx: n++
    }, {
      node: 'H',
      id: "op" + i,
      operand: false,
      operator: true,
      idx: n++
    });
  }
  return expr;
}
function treeFrom(expr){
  var nodes, stack, next, right, left;
  nodes = expr.map(function(it){
    return import$({}, it);
  });
  stack = [nodes.shift(), nodes.shift()];
  while (next = nodes.shift()) {
    if (next.operator) {
      right = stack.pop();
      left = stack.pop();
      next.children = [left, right];
    }
    stack.push(next);
  }
  return stack[0];
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
  var zeros, i$, x0$, len$, results$ = [];
  zeros = 0;
  for (i$ = 0, len$ = expr.length; i$ < len$; ++i$) {
    x0$ = expr[i$];
    if (x0$.operator) {
      zeros++;
    }
    results$.push(x0$.d = zeros);
  }
  return results$;
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
function calculateSize(root){
  var left, right, dir, opp, fitted, ref$;
  if (root.children != null) {
    left = calculateSize(root.children[0]);
    right = calculateSize(root.children[1]);
    dir = sliceDirection[root.node];
    opp = opposite[dir];
    fitted = Math.max(left[dir], right[dir]);
    return root[dir] = fitted, root[opp] = left[opp] + right[opp], root;
  } else {
    return root.width = (ref$ = root.chip).width, root.height = ref$.height, root;
  }
}
function expandRects(root, size){
  var ref$, left, right, half, stretch;
  size == null && (size = {
    width: root.width,
    height: root.height
  });
  if (root.width < size.width) {
    root.width = size.width;
  }
  if (root.height < size.height) {
    root.height = size.height;
  }
  if (root.children != null) {
    ref$ = root.children, left = ref$[0], right = ref$[1];
    switch (root.node) {
    case 'H':
      half = root.height / 2;
      stretch = 0;
      if (left.height < half && right.height < half) {
        stretch = half;
      }
      expandRects(left, {
        width: root.width,
        height: Math.max(stretch, left.height)
      });
      return expandRects(right, {
        width: root.width,
        height: Math.max(stretch, right.height)
      });
    case 'V':
      half = root.width / 2;
      stretch = 0;
      if (left.width < half && right.width < half) {
        stretch = half;
      }
      expandRects(left, {
        height: root.height,
        width: Math.max(stretch, left.width)
      });
      return expandRects(right, {
        height: root.height,
        width: Math.max(stretch, right.width)
      });
    }
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
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}