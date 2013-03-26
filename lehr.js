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
    var tree, nodes, links, layoutRoot, link, nodeGroup;
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
    nodeGroup.append('svg:circle').attr({
      'class': 'node-dot',
      r: 3
    });
    nodeGroup.append('svg:text').attr({
      textAnchor: 'start',
      dx: -20
    }).text(function(it){
      return it.node;
    });
  });
}).call(this);
