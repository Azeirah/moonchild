var style = `
  .mc-scrubbable {
    border-bottom: 1px dashed blue;
  }
  .mc-scrubbable:hover,
  body.mc-scrubbing .mc-scrubbable {
    border-bottom: 1px solid blue;
  }
  .mc-scrubbable:hover {
    cursor: pointer;
  }
  body.mc-scrubbing * {
    cursor: ew-resize !important;
  }
`;

function handleDrag(el, handlers) {
  if (_.isFunction(handlers))
    handlers = {
      drag: handlers
    };

  el.addEventListener('mousedown', function(e) {
    if (handlers.start)
      handlers.start.call(e.target, e);
    e.preventDefault();
    window.addEventListener('mousemove', handlers.drag);
    window.addEventListener('mouseup', function done() {
      window.removeEventListener('mousemove', handlers.drag);
      window.removeEventListener('mouseup', done);
      if (handlers.end)
        handlers.end.call(e.target, e);
    });
  });
};

var ScrubbableWidget = Moonchild.Widget.extend({
  create: function(node) {
    var el = createElement('span');
    el.classList.add('mc-scrubbable');

    var origin;
    var originalValue = node.value;

    var self = this;
    handleDrag(el, {
      start: function(e) {
        origin = {
          x: e.clientX,
          y: e.clientY
        };
        document.body.classList.add('mc-scrubbing');
      },
      drag: function(e) {
        el.textContent = originalValue + (e.clientX - origin.x);
      },
      end: function(e) {
        document.body.classList.remove('mc-scrubbing');
        Moonchild.getEditor().replaceNodeText(node, el.textContent);
      }
    });
    return el;
  },
  render: function(el, node) {
    el.textContent = node.raw;
  },
});

Moonchild.registerExtension('scrubble', [], function(moonchild) {
  moonchild.on('parse', function(ast) {
    ast.where({
      'type': 'Literal'
    }).each(function(node) {
      if (_.isNumber(node.value))
        moonchild.addWidget(moonchild.REPLACE, node, ScrubbableWidget);
    });
  });
}, style);
