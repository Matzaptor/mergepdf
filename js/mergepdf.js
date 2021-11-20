app.controller("mergepdf", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.mergepdf = $rootScope.mergepdf ? $rootScope.mergepdf : {
		items: []
	};

	$rootScope.mergepdf.merge = function() {
		return $rootScope.mergepdf.items.length > 1 ? $scope.ajax(
			"api/mergepdf/merge.php"
			,{ items: $rootScope.mergepdf.items }
			,true
		).then(
			(response) => {
				return $scope.download_file(response, undefined, true).then(
					(response) => {
						$rootScope.mergepdf.items.length = 0;
						$scope.toast("PDF uniti");
						return Promise.resolve(response);
					}
					,(response) => {return Promise.reject(response)}
				);
			}
			,(response) => {return Promise.reject(response)}
		) : $scope.alert_warning("Selezionare almeno due elementi");
	}

	$rootScope.mergepdf.attach = function(file, element) {
		let push = (file) => {
			if (file) {
				if (file.type == "application/pdf") {
					$rootScope.mergepdf.items.push({
						al_idutente: $scope.logged_user.username
						,al_descr: file.name
						//,al_path : "../../file/allegati/" + $scope.logged_user.username + "_" + new Date().valueOf()
						,al_type: file.type
						,al_size: file.size
						,blob_base64: file.blob_base64
						,al_date: new Date().toISOString()
					});
				} else {
					$scope.alert_warning("Il file " + file.name + " non è un pdf");
				}
			}
		}
		if (Array.isArray(file)) {
			for (let i = 0; i < file.length; i++) {
				push(file[i]);
			}
		} else if (file) {
			push(file);
		}

		if (element && element.length > 0) {
			element[0].value = null;
		}
	}

	$rootScope.mergepdf.remove = function(item, fl_ask_confirm) {
		if (fl_ask_confirm === undefined || fl_ask_confirm) {
			return $scope.alert_confirm("Sicuro di voler rimuovere l'elemento?", "SI", "NO").then(
				(yes) => { return $rootScope.mergepdf.remove(item, false) }
				,(no) => { return Promise.reject(no) }
			);
		} else {
			let idx = $rootScope.mergepdf.items.indexOf(item);
			if (idx > -1) $rootScope.mergepdf.items.splice(idx, 1);
			$scope.toast("PDF rimosso");
			return Promise.resolve(item);
		}
	}
}]);