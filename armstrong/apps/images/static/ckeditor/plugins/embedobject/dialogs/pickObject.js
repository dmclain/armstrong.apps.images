CKEDITOR.dialog.add( 'pickObject', function( editor )
{
	// Function called in onShow to load selected element.
	var loadElements = function( element )
	{
		this._.selectedElement = element;

		var attributeValue = element.data( 'cke-saved-name' );
		this.setValueOf( 'info','txtName', attributeValue || '' );
	};

	function createFakeEmbed( editor, embed )
	{
		return editor.createFakeElement( embed, 'arm_embed', 'embed' );
	}

	function updatePreview() {
		var dialog = this.getDialog();
		var params = {
			'content_type': dialog.getValueOf('info', 'content_type'),
			'object_id': dialog.getValueOf('info', 'object_id'),
			'template': dialog.getValueOf('info', 'template'),
		}
        $.get('/admin/armstrong/search/',
              params,
              function(html){
	              	var el = dialog.getContentElement('info', 'preview');
	              	el.html = html;
	              	$('#' + el.domId).html(html);
	          },
              'html');
	}

	return {
		title : 'Embed Object',
		minWidth : 300,
		minHeight : 60,
		onOk : function()
		{
			var result = this.getContentElement( 'info', 'preview' ).html;
			var sel = editor.getSelection();
			var range = sel && sel.getRanges()[0];
			range.insertNode($(result));
			delete this._.selectedElement;
		},

		onHide : function()
		{
			delete this._.selectedElement;
		},

		onShow : function()
		{
			this.getContentElement( 'info', 'txtName' ).focus();
		},
		contents : [
			{
				id : 'info',
				label : editor.lang.anchor.title,
				accessKey : 'I',
				elements :
				[
					{
						type : 'select',
						id : 'content_type',
						label : 'Content Type',
						required: true,
						items : [
							['images','23']
						],
						validate : function()
						{
							if ( !this.getValue() )
							{
								alert( 'Please choose a content type.' );
								return false;
							}
							return true;
						},
						onChange : function()
						{
						}
					},
					{
						type : 'text',
						id : 'object_id',
						label : 'Object ID',
						required: true,
						validate : function()
						{
							if ( !this.getValue() )
							{
								alert( 'Please choose an object.' );
								return false;
							}
							return true;
						},
						onChange : updatePreview
					},
					{
						type : 'select',
						id : 'template',
						label : 'Template',
						required: true,
						items : [
							['masthead','masthead'],
							['inline','inline']
						],
						validate : function()
						{
							if ( !this.getValue() )
							{
								alert( 'Please choose a template.' );
								return false;
							}
							return true;
						},
						onChange : updatePreview
					},
					{
						type : 'html',
						id : 'preview',
						label: 'preview',
						html: '<div>Preview</div>'
					}
				]
			}
		]
	};
} );
