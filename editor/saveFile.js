function createFileSaver (moonchild, channel) {
    // assuming that the editor doesn't get changed
    // weird stuff will happen if the editor -does- get changed
    var editor = moonchild.getEditor()._codeMirror;
    var keycodes = {
      "s": 83
    };

    window.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.which === keycodes.s) {
            // prevent the default save webpage dialog from popping up
            event.preventDefault();

            // the user should be given some kind of feedback that the file got saved
            // maybe a small popup or a circle flashing green somewhere..?
            channel.send('saveFile', {content: editor.getValue()});
        }
    });
}
