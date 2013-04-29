"use strict";
var complement, sliceDirection, opposite, lineDimension, oppDimension, move, R, possible, moves, P, temps, costs, bestCosts, slice$ = [].slice;
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
      for (i = chainStart, to$ = chainStart + len; i < to$; ++i) {
        if (x0$[i].operand) {
          log(i);
          log(expr);
          log(chainStart);
          log(len);
          log(x0$[i]);
          log(expr.slice(chainStart, chainStart + len));
          throw new Error("you fucked up");
        }
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
function cost(expr){
  var tree;
  tree = treeFrom(expr);
  calculateSize(tree);
  return tree.width * tree.height;
}
R = 0.85;
function nextTemperature(oldTemp){
  return R * oldTemp;
}
function chooseMove(expr){
  var candidates, m, lastOperand, i$, len$, cur, startChain, chainLen, i, to$, to1$, next, taken;
  candidates = [];
  switch (m = Math.floor(Math.random() * 3)) {
  case 0:
    for (i$ = 0, len$ = expr.length; i$ < len$; ++i$) {
      cur = expr[i$];
      if (cur.operand) {
        if (lastOperand) {
          candidates.push([lastOperand, cur]);
        }
        lastOperand = cur;
      }
    }
    break;
  case 1:
    chainLen = 0;
    for (i = 0, to$ = expr.length; i < to$; ++i) {
      cur = expr[i];
      if (cur.operand) {
        if (chainLen > 0) {
          candidates.push([startChain, chainLen]);
          chainLen = 0;
          startChain = void 8;
        }
      } else {
        startChain == null && (startChain = i);
        chainLen++;
      }
    }
    if (chainLen > 0) {
      candidates.push([startChain, chainLen]);
    }
    break;
  case 2:
    for (i = 0, to1$ = expr.length - 1; i < to1$; ++i) {
      cur = expr[i];
      next = expr[i + 1];
      if (cur.operand) {
        if (next.operator && valid(expr, cur, next)) {
          candidates.push([cur, next]);
        }
      } else {
        if (next.operand && valid(expr, cur, next)) {
          candidates.push([cur, next]);
        }
      }
    }
  }
  if (candidates.length === 0) {
    return chooseMove(expr);
  } else {
    moves[m]++;
    taken = Math.floor(Math.random() * candidates.length);
    possible.push(taken);
    return move[m].apply(move, [expr].concat(slice$.call(candidates[taken])));
  }
}
P = 0.95;
function initialTemp(expr){
  var c, moves, res$, i, m, newC, sum, avg;
  c = cost(expr);
  res$ = [];
  for (i = 0; i < 100; ++i) {
    m = chooseMove(expr);
    newC = cost(m);
    if (newC > c) {
      res$.push(newC - c);
    }
  }
  moves = res$;
  sum = moves.reduce(function(a, b){
    return a + b;
  }, 0);
  avg = sum / moves.length;
  log('avg');
  log(avg);
  log('temp');
  log(-avg / Math.log(P));
  return 5 * -avg / Math.log(P);
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
function anneal(chips, expr, temp){
  var cur, best, curCost, bestCost, N, maxMoves, overallTotal, accepted, downhill, total, i, m, c;
  temp = initialTemp(expr);
  postMessage({
    type: 'init',
    temp: temp
  });
  cur = best = expr;
  curCost = bestCost = cost(expr);
  temps.push(temp);
  costs.push(curCost);
  bestCosts.push(bestCost);
  N = 10 * (expr.length + chips.length);
  maxMoves = 10 * N;
  log(maxMoves);
  overallTotal = 0;
  while (temp > 0.1) {
    accepted = 0;
    downhill = 0;
    total = 0;
    for (i = 0; i < maxMoves; ++i) {
      total++;
      m = chooseMove(cur);
      dNumber(m);
      c = cost(m);
      if (c <= curCost) {
        if (c < bestCost) {
          best = m;
          bestCost = c;
          cur = m;
          progress({
            curCost: curCost,
            bestCost: bestCost,
            best: best,
            cur: cur,
            temp: temp,
            moves: overallTotal,
            temps: temps,
            costs: costs,
            bestCosts: bestCosts
          });
          postMessage({
            type: 'new-best'
          });
        }
        if (c != curCost) {
          accepted++;
        }
        downhill++;
        cur = m;
        curCost = c;
      } else {
        if (makeMove(temp, curCost, c)) {
          cur = m;
          curCost = c;
          accepted++;
        }
      }
      if (downhill > N) {
        break;
      }
      overallTotal++;
      if (overallTotal % 1000 === 0) {
        costs.push(curCost);
        bestCosts.push(bestCost);
      }
    }
    temp = nextTemperature(temp);
    temps.push(temp);
    progress({
      curCost: curCost,
      bestCost: bestCost,
      cur: cur,
      best: best,
      temp: temp,
      moves: overallTotal,
      temps: temps,
      costs: costs,
      bestCosts: bestCosts
    });
    if (accepted / total < 0.05) {
      break;
    }
  }
  return best;
}
function makeMove(temp, curCost, newCost){
  return Math.exp(-(newCost - curCost) / temp) > Math.random();
}
this.onmessage = function(arg$){
  var data, chips, expr, sum, avg;
  data = arg$.data, chips = data.chips, expr = data.expr;
  moves = {
    0: 0,
    1: 0,
    2: 0
  };
  temps = [];
  costs = [];
  bestCosts = [];
  possible = [];
  anneal(chips, expr);
  log(moves);
  sum = possible.reduce(function(a, b){
    return a + b;
  }, 0);
  avg = sum / possible.length;
  log('avg possile');
  log(avg);
  postMessage({
    type: 'done',
    bestCosts: bestCosts,
    temps: temps,
    costs: costs
  });
};
function progress(it){
  return postMessage((import$({
    type: 'progress'
  }, it)));
}
function log(it){
  return postMessage({
    type: 'log',
    message: it
  });
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}