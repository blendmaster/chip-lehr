var complement, sliceDirection, opposite, lineDimension, oppDimension, slice$ = [].slice;
function initialLayout(chips, n){
  n == null && (n = 0);
  return {
    node: 'H',
    id: "operator" + n,
    operand: false,
    operator: true,
    children: [
      chips.length === 2
        ? {
          node: n + 1,
          id: n + 1,
          operand: true,
          operator: false,
          chip: chips[1]
        }
        : initialLayout(chips.slice(1), n + 1), {
        node: n,
        id: n,
        operand: true,
        operator: false,
        chip: chips[0]
      }
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