<?php
$beansMaps = (Object) [
	/* questa assegnazione iniziale serve per inizializzare la mappa in modo che
	non lanci warning quando successivamente verranno inseriti i bean */
	# "BaseBean" => => null,
	"UtenteBean" => null
];
# BaseBean
/*
$beansMaps->BaseBean = (Object) [
	"dbh" => PDO
	,"sqlTableName" => "sqlTableName"
	,"sqlFieldsMap" => (Object) [
		"jsFieldName" => (Object) [
			"name" => "sqlFieldName"
			,"options" => (Object) [
				"type" => null | "date" | "base64"
				,"path" => jsFieldNamePath	# obbligatorio per type base64
			]
		]
	]
	,"pksMap" => [
		"jsFieldName" => (Object) [
			"options" => (Object) [
				"autoincrement" => true | false
			]
		]
	]
	,"children" => [
		"jsFieldName" => (Object) [
			"beanName" => "beanChildName"
			,"fksMap" => (Object) [
				"jsChildField" => (Object) [
					"name" => "jsFatherField"
				]
			]
			,"flGetFirst" => true | false
			,"flReadOnly" => true | false
		]
	]
]
*/
# UtenteBean
$beansMaps->UtenteBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "utenti"
	,"sqlFieldsMap" => (Object) [
		"username" => (Object) [
			"name" => "ut_username"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"descr" => (Object) [
			"name" => "ut_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"mail" => (Object) [
			"name" => "ut_mail"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"fl_enabled" => (Object) [
			"name" => "ut_flEnabled"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"username" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
	]
];
?>