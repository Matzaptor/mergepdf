app.controller("converter", ["$rootScope", "$scope", function($rootScope, $scope) {
	$rootScope.converter = $rootScope.converter ? $rootScope.converter : {
		items: []
	};

	$rootScope.converter.to1_4 = function(file, element) {
		let push = (file) => {
			if (file) {
				if (file.type == "application/pdf") {
					$rootScope.converter.items.push({
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

		return $rootScope.converter.items.length > 0 ? $scope.ajax(
			"api/converter/compress.php"
			,{ items: $rootScope.converter.items }
			,true
		).then(
			(response) => {
				return Promise.all((Array.isArray(response) ? response : [response]).map(item => {
					return $scope.download_file(item, undefined, true)
				})).then(
					(response) => {
						$rootScope.converter.items.length = 0;
						$scope.toast("PDF convertito");
						return Promise.resolve(response);
					}
					,(response) => {
						$rootScope.converter.items.length = 0;
						return Promise.reject(response);
					}
				);
			}
			,(response) => {
				$rootScope.converter.items.length = 0;
				return Promise.reject(response);
			}
		) : $scope.alert_warning("Selezionare almeno un elemento");
	}

	$rootScope.converter.compress = function(file, element) {
		let push = (file) => {
			if (file) {
				if (file.type == "application/pdf") {
					$rootScope.converter.items.push({
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

		return $rootScope.converter.items.length > 0 ? $scope.ajax(
			"api/converter/to1.4.php"
			,{ items: $rootScope.converter.items }
			,true
		).then(
			(response) => {
				return Promise.all((Array.isArray(response) ? response : [response]).map(item => {
					return $scope.download_file(item, undefined, true)
				})).then(
					(response) => {
						$rootScope.converter.items.length = 0;
						$scope.toast("PDF convertito");
						return Promise.resolve(response);
					}
					,(response) => {
						$rootScope.converter.items.length = 0;
						return Promise.reject(response);
					}
				);
			}
			,(response) => {
				$rootScope.converter.items.length = 0;
				return Promise.reject(response);
			}
		) : $scope.alert_warning("Selezionare almeno un elemento");
	}
}]);