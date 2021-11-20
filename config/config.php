<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

/** Solitamente è lo stesso di config.js
 * 0 = DEV
 * 1 = TEST
 * 2 = DEMO
 * 3 = PROD
 */
$fl_prod = 0;

# DEV
# URL
$url						= "http://matteo.dev104.local/mergepdf/";
# DB
$db_host					= "127.0.0.1";
$db_name					= "mergepdf";
$db_user					= "devdb";
$db_pass					= "devdb";
# SESSION
$session_logged				= "mergepdf_user";
# TIMEZONE
echo date_default_timezone_set("UTC") ? "" : "timezone_identifier is not valid.<br/>\n";
# SMTP
$smtp_Host					= "smtps.aruba.it";		// SMTP server example
$smtp_SMTPDebug				= 2;					// enables SMTP debug information (for testing)
$smtp_SMTPAuth				= true;					// enable SMTP authentication
$smtp_Port					= 465;					// set the SMTP port
$smtp_Username				= "matzaptor@matzaptor.it";
$smtp_Password				= "Veronica1996";
$mails = (Object) [];

$dbh = null;
try {
	# $dbh = new PDO("dblib:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
	# $dbh = new PDO("sqlsrv:Server=$db_host;Database=$db_name", "$db_user", "$db_pass");
	$dbh = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass, [PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"]);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_NATURAL);
} catch (PDOException $e) {
	echo "dbh -> " . $e->getMessage() . ".<br/>\n";
}

if (session_status() == PHP_SESSION_NONE) {
	session_start();
}
?>