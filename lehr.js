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
    var tree, nodes, links, layoutRoot, link, nodeGroup, circles, exprRoot, expr, visit, tokens;
    tree = d3.layout.tree().size([500, 500]).children(function(it){
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
    layoutRoot = d3.select('body').append('svg:svg').attr({
      width: 600,
      height: 600
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
    exprRoot = d3.select('body').append('p');
    expr = [];
    visit = function(it){
      var that;
      expr.push(it.node);
      if (that = it.left) {
        visit(that);
      }
      if (that = it.right) {
        return visit(that);
      }
    };
    visit(data);
    tokens = exprRoot.selectAll('span.token').data(expr).enter().append('span').attr({
      'class': 'token'
    }).text(function(it){
      return it;
    }).on('mouseover', function(_, i){
      return d3.select(circles[0][i]).classed('hovered', true);
    }).on('mouseout', function(_, i){
      return d3.select(circles[0][i]).classed('hovered', false);
    });
    nodeGroup.on('mouseover', function(_, i){
      return d3.select(tokens[0][i]).classed('highlight', true);
    }).on('mouseout', function(_, i){
      return d3.select(tokens[0][i]).classed('highlight', false);
    });
  });
}).call(this);
