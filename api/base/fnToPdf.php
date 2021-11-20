<?php

require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/PDFShift.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/PDFShiftException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/InvalidRequestException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/NoCreditsException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/RateLimitException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/ServerException.php");
require(__DIR__ . "/../lib/pdfshift-php-1.0.9/src/Exceptions/InvalidApiKeyException.php");

use \PDFShift\PDFShift;
PDFShift::setApiKey($pdfshift_api_key);

function toPdf($template = null, $options = null, $pdfpostdata = null) {
	global $fl_prod;
	global $url;

	$response = (Object) [
		"status" => false
		,"response" => "init"
	];

	$options = isset($options) && $options ? $options : (Object) [];
	if ($fl_prod != 3) {
		@$options->sandbox = true;
	}

	if (isset($url) && $url) {
		if ($template) {
			$temp_dest = "";
			$temp_filename = "";
			$temp_path = "/../../file/temp/pdfshift";

			if ($fl_prod == 3) {
				$characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
				while (!$temp_dest) {
					$temp_filename = "";
					for ($i = 0; $i < 50; $i++) {
						$temp_filename .= $characters[rand(0, strlen($characters) - 1)];
					}
					$temp_filename .= ".html";
					$temp_dest = __DIR__ . "/$temp_path/$temp_filename";
					if (file_exists($temp_dest)) {
						$temp_dest = "";
					}
				}
			} else {
				$temp_filename .= "test.html";
				$temp_dest = __DIR__ . "/$temp_path/$temp_filename";
			}

			if (file_put_contents($temp_dest, str_replace(
				"[TEMPLATE]"
				,isset($template) ? "../../../ubprint/tmpl/$template" : "undefined"
				,str_replace(
					"[POSTDATA]"
					,json_encode(isset($pdfpostdata) ? $pdfpostdata : null)
					,file_get_contents(__DIR__ . "/../../ubprint/ubprint.html")
				)
			))) {
				try {
					if ($fl_prod != 0) {
						$response->response = PDFShift::convertTo(str_replace("/../../", $url, $temp_path) . "/$temp_filename", (Array) $options, null);
					} else {
						$response->response = "cribbio!!!! in ambiente di dev non funziona. PDFSwift ha bisogno di poter accedere da remoto all'ubprint -.-'";
					}
					if ($fl_prod == 3) {
						unlink($temp_dest);
					}
					$response->status = true;
				} catch (Exception $e) {
					$response->response = "Errore generazione pdf: " . $e->getMessage();
				}
			} else {
				$response->response = "Errore generazione pdf: impossibile creare il file html";
			}
		} else {
			$response->response = "template is null";
		}
	} else {
		$response->response = "url is null";
	}

	return $response;
}
?>