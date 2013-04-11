(function(){
  var data;
  data = {
    node: 'V',
    left: {
      node: 'H',
      left: {
        node: 'V',
        left: {
          node: 'H',
          left: {
            node: 1
          },
          right: {
            node: 6
          }
        },
        right: {
          node: 2
        }
      },
      right: {
        node: 'V',
        left: {
          node: 7
        },
        right: {
          node: 5
        }
      }
    },
    right: {
      node: 'H',
      left: {
        node: 3
      },
      right: {
        node: 4
      }
    }
  };
  document.addEventListener('DOMContentLoaded', function(){
    var tree, nodes, links, i, len$, n, layoutRoot, link, nodeGroup, circles, exprRoot, expr, visit, len1$, setClass, mouseover, mouseout, tokens, len2$;
    tree = d3.layout.tree().size([400, 400]).children(function(it){
      var x0$, that;
      x0$ = [];
      if (that = it.left) {
        x0$.push(that);
      }
      if (that = it.right) {
        x0$.push(that);
      }
      return x0$;
    });
    nodes = tree.nodes(data);
    links = tree.links(nodes);
    for (i = 0, len$ = nodes.length; i < len$; ++i) {
      n = nodes[i];
      n.preorder = i;
    }
    console.log(nodes);
    console.log(data);
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
    expr = [];
    visit = function(it){
      var that;
      if (that = it.left) {
        visit(that);
      }
      if (that = it.right) {
        visit(that);
      }
      return expr.push(it);
    };
    visit(data);
    for (i = 0, len1$ = expr.length; i < len1$; ++i) {
      n = expr[i];
      n.postorder = i;
    }
    console.log(circles);
    setClass = function(state){
      return function(it){
        var that;
        d3.select(tokens[0][it.postorder]).classed('hovered', state);
        d3.select(circles[0][it.preorder]).classed('hovered', state);
        d3.select("#l" + it.preorder).classed('hovered', state);
        if (that = it.left) {
          d3.select(tokens[0][that.postorder]).classed('left-hovered', state);
          d3.select(circles[0][that.preorder]).classed('left-hovered', state);
          d3.select("#l" + that.preorder).classed('left-hovered', state);
        }
        if (that = it.right) {
          d3.select(tokens[0][that.postorder]).classed('right-hovered', state);
          d3.select(circles[0][that.preorder]).classed('right-hovered', state);
          return d3.select("#l" + that.preorder).classed('right-hovered', state);
        }
      };
    };
    mouseover = setClass(true);
    mouseout = setClass(false);
    tokens = exprRoot.selectAll('span.token').data(expr).enter().append('span').attr({
      'class': 'token'
    }).text(function(it){
      return it.node;
    }).on('mouseover', mouseover).on('mouseout', mouseout);
    nodeGroup.on('mouseover', mouseover).on('mouseout', mouseout);
    for (i = 0, len2$ = nodes.length; i < len2$; ++i) {
      n = nodes[i];
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
}).call(this);
