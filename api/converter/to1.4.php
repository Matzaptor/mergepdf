<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];

$trash = [];
try {
	if (isset($_SESSION[$session_logged])) {
		$postdata	= file_get_contents("php://input");
		$request	= json_decode($postdata);

		$items		= isset($request->items)			? $request->items		: [];

		if ($items) {
			if (!is_array($items)) $items = [$items];

			$flOk = true;
			$paths = [];

			foreach ($items as $item) {
				$path = "../../file/allegati/" . $user->username . "_" . microtime(true);
				$fullpath = __DIR__ . "/". $path;
				if (!file_put_contents($fullpath, base64_decode($item->blob_base64))) {
					throw new Exception("Failed to save blob in '$path'");
				};
				$trash[] = $fullpath;

				$path_output = "../../file/allegati/" . $user->username . "_" . microtime(true) . "_v1.4.pdf";
				$fullpath_output = __DIR__ . "/". $path_output;

				$cmd = "gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -sOutputFile='$fullpath_output' '$fullpath'";		// metto gli apici perchè non accetta le cartelle con spazi
				$merge_error = shell_exec($cmd);

				if ($merge_error) {
					$response->response = $merge_error;
					$flOk = false;
					break;
				} else {
					$paths[] = $path_output;
				}
			}

			if ($flOk) {
				$response->response = $paths;
				$response->status = true;
			}
		} else {
			$response->response = "Nessun elemento da elaborare";
		}
	} else {
		$response->response = "Sessione scaduta";
	}
} catch (Exception $e) {
	$response->response = "Fatal error";
	echo $e->getMessage();
}

try {
	foreach ($trash as $path) {
		try {
			if (file_exists($path)) {
				unlink($path);
			}
		} catch (Exception $e) {
			/// ehhh, capita...
		}
	}
} catch (Exception $e) {
	/// ehhh, capita...
}

$obStr = ob_get_clean();
$response->response = $response->status ? $response->response : $response->response . ($obStr ? ". More info: " . $obStr : "");
ob_end_clean();
echo json_encode($response);
?>