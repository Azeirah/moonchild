var moonchild = Moonchild.registerExtension();
Moonchild.setEditor(new Editor());

// global settings...
// timeout before editor rerenders plugins
var onChangeTimeout = 250;

var codeMirror;  // TODO: Get rid of this global.


// Private helpers
// ---------------

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function editorOnChange(cm, changeObj) {
  Moonchild.onChange(cm.getValue());
}

function renderNode(cm, node) {
  var widgetInfo = moonchild.getWidget(node);
  if (widgetInfo)
    renderWidget(cm, node, widgetInfo);
  else
    clearWidgets(cm, node);
}

// Editor
// ------

function Editor() {
  var rerenderPlugins = _.debounce(editorOnChange, onChangeTimeout);

  codeMirror = this._codeMirror = CodeMirror.fromTextArea($('textarea'));
  codeMirror.on('change', rerenderPlugins);

  var render = _.partial(renderNode, codeMirror);
  moonchild.on('render', function(ast, comments) {
    ast.each(render);
    comments.each(render);
  });

  moonchild.on('extension-loaded', function (extensionName) {
    rerenderPlugins(codeMirror);
  });

  codeMirror.on('cursorActivity', function(cm, e) {
    var adjacentMarks = cm.findMarksAt(cm.getCursor());
    if (adjacentMarks.length === 0 || !adjacentMarks[0].replacedWith)
      return;

    var markEl = widgetForMark(adjacentMarks[0]);
    var widgetType = markEl._moonchildWidgetType;
    if (widgetType && widgetType.editable)
      console.log(markEl);
  });
}

Editor.prototype.replaceRange = function(fromOffset, toOffset, text) {
  this._codeMirror.replaceRange(text, fromOffset, toOffset);
};

Editor.prototype.insertText = function(offset, text) {
  this.replaceRange(offset, null, text);
};

Editor.prototype.replaceNodeText = function(node, text) {
  this.replaceRange(esLocToCm(node.loc.start), esLocToCm(node.loc.end), text);
};
