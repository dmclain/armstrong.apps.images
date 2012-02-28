CKEDITOR.dialog.add( 'pickObject', function( editor )
{
	function loadContentTypes(dialog) {
		$.get('/admin/armstrong/search/generickey/facets/',
			_.bind(displayContentTypes, dialog),
			'json');
	}

	function displayContentTypes( types ) {
		this['content_types'] = types;
		var select = this.getContentElement('info', 'content_type');
		select.clear();
		var keys = _.keys(types);
		keys.sort();
		_.each(keys, function(key){
			select.add(key, key);
		})
	}

	function contentTypeChanged() {
		updateObjectPicker();
		loadTemplateList(this);
	}

	function updateObjectPicker() {
		var dialog = this.getDialog();
		var object_id_input_id = dialog.getContentElement('info', 'object_id').getInputElement().$.id;
		var selector = '#' + dialog.getContentElement('info', 'popup_launcher').domId;
		$(selector).html('Loading ...');
		var content_object_name = dialog.getValueOf('info', 'content_type');
		var content_object = dialog['content_types'][content_object_name];
		var html = '<a href="/admin/'+ content_object['app_label'] +'/'+ content_object_name +'" class="related-lookup" id="lookup_' + object_id_input_id + '" onclick="return showRelatedObjectLookupPopup(this);"> <img src="https://d2o6nd3dubbyr6.cloudfront.net/common/admin/img/admin/selector-search.gif" width="16" height="16" alt="Lookup" /></a>'
		$(selector).html(html);
	}

	function loadTemplateList(dialog) {
		$.get('/admin/armstrong/search/generickey/facets/',
			_.bind(displayTemplateList, dialog),
			'json');
	}

	function displayTemplateList( templates ) {
		var select = this.getContentElement('info', 'template');
		select.clear();
		_.each(templates, function(template){
			select.add(template, template);
		})
	}

	function updatePreview() {
		var dialog = this.getDialog();
		var params = {
			'content_type': dialog['content_types'][dialog.getValueOf('info', 'content_type')]['id'],
			'object_id': dialog.getValueOf('info', 'object_id'),
			'template': dialog.getValueOf('info', 'template'),
		}
		$.get('/admin/armstrong/render_model_preview/',
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
			loadContentTypes(this);
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
							['Loading...','']
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
						onChange : updateObjectPicker
					},
					{
						type: 'hbox',
						children: [
							{
								type : 'text',
								id : 'object_id',
								label : 'Object ID',
								required : true,
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
								type : 'html',
								id : 'popup_launcher',
								label: 'preview',
								html: ''
							}
						]
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
