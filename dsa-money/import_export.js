ccm.files[ 'import_export.js' ] = {
	"tag": "div",
	"inner": [
		{
			"tag": "div",
			"class": "row",
			"inner": [
				{
					"tag": "div",
					"class": "col-lg-5",
				},
				{
					"tag": "div",
					"class": "col-lg-2",
					"inner": {
						"tag": "div",
						"class": "btn-group",
						"role": "group",
						"aria-label": "Basic example",
						"inner": [
							{
								"tag": "button",
								"class": "btn btn-secondary",
								"type" : "button",
								"inner": "Export",
								"onclick": "%exportHandler%"
							},{
								"tag": "button",
								"class": "btn btn-secondary",
								"type" : "button",
								"inner": "Import",
								"onclick": "%importHandler%"
							},
						]
					}
				},
				{
					"tag": "div",
					"class": "col-lg-5",
				},
			]
		},
		{
			"tag": "div",
			"class": "row",
			"style": "margin-top:10px",
				"inner": [
				{
					"tag": "div",
					"class": "col-lg-4",
				},
				{
					"tag": "div",
					"class": "col-lg-4",
					"inner": [{
						"tag": "div",
						"class": "input-group",
						"inner": [					
							{
								"tag": "div",
								"class": "input-group-prepend",
								"inner":{
									"tag": "span",
									"class": "input-group-text",
									"inner": "Copy/Paste <br/>your data here"
								}
							},
							{
								"id":"importExportTextArea",
								"tag": "textarea",
								"class": "form-control",
								"aria-label" : "Copy/Paste your data here",
								"inner":"%text%"
							},
						]
					},
					]
				},
				{
					"tag": "div",
					"class": "col-lg-4",
				},
			]
		}
	]
};