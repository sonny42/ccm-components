ccm.files[ 'money_unit_block.js' ] = {
	"tag": "div",
	"class": "row",
	"style": "margin-top:10px",
	"inner": [
		{
			"tag": "div",
			"class": "col-lg-2",
			"style": "text-align:right",
			"inner": [
				{
					"tag": "button",
					"class": "btn btn-primary buttonSpacer",
					"type" : "button",
					"inner": "Convert Down",
					"value": "%unit%",
					"onclick": "%convertMinusFunc%",
				}
			]
		},
		{
			"tag": "div",
			"class": "col-lg-3",
			"style": "text-align:center",
			"inner": [
				{
					"tag": "button",
					"class": "btn btn-primary buttonSpacer",
					"type" : "button",
					"inner": "-10",
					"value": "%unit%",
					"onclick": "%minusTenFunc%"
				},{
					"tag": "button",
					"class": "btn btn-primary buttonSpacer",
					"type" : "button",
					"inner": "-5",
					"value": "%unit%",
					"onclick": "%minusFiveFunc%"
				},{
					"tag": "button",
					"class": "btn btn-primary",
					"type" : "button",
					"inner": "-",
					"value": "%unit%",
					"onclick": "%minusFunc%"
				}
			]
		},
		{
			"tag": "div",
			"class": "col-lg-2",
			"inner": {
				"tag": "input",
				"type": "text",
				"class": "form-control",
				"id": "%unit%",
				"name": "%unit%",
				"value": "%moneyValue%",
			}
		},
		{
			"tag": "div",
			"class": "col-lg-3",
			"style": "text-align:center",
			"inner": [
				{
					"tag": "button",
					"class": "btn btn-primary buttonSpacer",
					"type" : "button",
					"inner": "+",
					"value": "%unit%",
					"onclick": "%plusFunc%"
				},{
					"tag": "button",
					"class": "btn btn-primary buttonSpacer",
					"type" : "button",
					"inner": "+5",
					"value": "%unit%",
					"onclick": "%plusFiveFunc%"
				},{
					"tag": "button",
					"class": "btn btn-primary buttonSpacer",
					"type" : "button",
					"inner": "+10",
					"value": "%unit%",
					"onclick": "%plusTenFunc%"
				}
			]
		},
		{
			"tag": "div",
			"class": "col-lg-2",
			"inner": [
				{
					"tag": "button",
					"class": "btn btn-primary",
					"type" : "button",
					"inner": "Convert Up",
					"value": "%unit%",
					"onclick": "%convertPlusFunc%",
					"disabled" : ""
				}
			]
		},
	]
};