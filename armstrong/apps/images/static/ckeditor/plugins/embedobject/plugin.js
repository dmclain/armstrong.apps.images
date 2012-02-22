CKEDITOR.plugins.add('embedobject', {
    init: function(editor) {
        editor.addCommand('pickObject', new CKEDITOR.dialogCommand('pickObject'));
        editor.ui.addButton('EmbedObject', {
            label: 'Embed Object',
            icon: this.path + 'toolBarButton.png',
            command: 'pickObject'
        });
        CKEDITOR.dialog.add('pickObject', this.path + 'dialogs/pickObject.js');
    }
});