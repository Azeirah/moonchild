function createFileLoader (moonchild, channel) {
  var fileLoader = Object.create(null);

  // assuming that the editor doesn't get changed
  // weird stuff will happen if the editor -does- get changed
  var editor = moonchild.getEditor()._codeMirror;

  channel.on("fileLoad", function (messageData) {
    // assuming JSON structure of form
    // {
    //   ...
    //   text: ""
    //   ...
    // }

    var text = messageData.content;

    editor.setValue(text);

    // let the editor know that a change happened
    moonchild.poke();
  });

  // is there an internal list of keycodes included somewhere in JavaScript?
  // maybe somewhere hidden in event.bla.keycodes
  var keycodes = {
    s: 83
  };

  // should use a codemirror api here..
  window.addEventListener("keydown", function (event) {
    // ctrl + s
    // barely any browser supports event.key, let's use event.which instead

    // if (event.ctrlKey && event.key === "s") {
    if (event.ctrlKey && event.which === keycodes.s) {
      event.preventDefault();
      console.log("saving! (purposefully ignored by the server at the moment)");

      channel.send("saveFile", {content: editor.value});
    }
  });

  // var someData = {data: "nothing yet!!"};
  // and second, moonchild on ctrl+s
  // channel.send("save", someData);


}

function loadText(editor, text) {
  console.log("Loading in some text");
  console.log(globalEditor);
  globalEditor._codeMirror.setValue(text);

  onChange(text);
}