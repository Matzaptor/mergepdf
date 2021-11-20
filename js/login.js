app.controller("login", ["$scope", "$rootScope", function($scope, $rootScope) {
	$rootScope.logged_user = undefined;

	$scope.key = utenti_chiavi; // true | false | undefined
	
	$rootScope.loginBean = {};

	$scope.toggle_key = function() {
		$scope.key = !$scope.key;
		$rootScope.loginBean = {};
		$scope.focus_by_id("username");
	}

	$rootScope.login = function(username, password, ricordami) {
		return username && (password || $scope.key) ? $scope.ajax(
			"api/login/login.php"
			,{
				username: username
				,password: $scope.key ? undefined : password
				,ricordami: ricordami
			}
			,true
		).then(
			(response) => {return $rootScope.ricordami()}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject("no username or password or key");
	}
	$rootScope.registra = function(username, password, mail, cf) {
		return username && password && mail ? $scope.ajax(
			"api/login/registra.php"
			,{
				username: username
				,password: password
				,mail: mail
				,cf: cf
			}
			,true
		).then(
			(response) => {
				return $scope.alert_success("Manca poco! Controlla la tua casella email per completare la registrazione").then(
					(text) => {return $rootScope.ricordami()}
					,(text) => {return Promise.reject(text)}
				)
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject("no username or password or mail");
	}
	$rootScope.recupera_step1 = function(username) {
		return username ? $scope.ajax(
			"api/login/recupera.php"
			,{username: username}
			,true
		).then(
			(response) => {
				return $scope.alert_success("Manca poco! Controlla la tua casella email per completare il recupero").then(
					(text) => {return $rootScope.ricordami()}
					,(text) => {return Promise.reject(text)}
				);
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject("username is null");
	}
	$rootScope.recupera_step1 = function(username) {
		return username ? $scope.ajax(
			"api/login/recupera.php"
			,{
				username: username
			}
			,true
		).then(
			(response) => {
				return $scope.alert_success("Manca poco! Controlla la tua casella email per completare il recupero").then(
					(text) => {return $rootScope.ricordami()}
					,(text) => {return Promise.reject(text)}
				);
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject("username is null");
	}
	$rootScope.recupera_step2 = function(password) {
		let token = $rootScope.loginBean.recupera_token;
		return token && password ? $scope.ajax(
			"api/login/recupera.php"
			,{
				token: token
				,password: password
			}
			,true
		).then(
			(response) => {
				$scope.page("recupera_step3");
				return $rootScope.ricordami();
			}
			,(response) => {return Promise.reject(response)}
		) : Promise.reject("no token or password");
	}

	$rootScope.ricordami = function() {
		return $scope.ajax(
			"api/login/ricordami.php"
			,{}
			,true
		).then(
			(response) => {
				$rootScope.logged_user = response;
				if ($rootScope.logged_user && $rootScope.logged_user.fl_developer == "1") {
					$rootScope.logged_user.fl_direttivo = "1";
					$rootScope.logged_user.fl_contabile = "1";
				} else if (!$rootScope.logged_user && $scope.page() != "recupera_step2") {
					localStorage.clear();
					$scope.page("login");
				}
				return Promise.resolve($rootScope.logged_user);
			}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.logout = function() {
		return $scope.ajax(
			"api/login/logout.php"
			,{}
			,true
		).then(
			(response) => {return $rootScope.ricordami()}
			,(response) => {return Promise.reject(response)}
		);
	}

	$rootScope.change_password = function(username) {
		let dialog = {};
		dialog.clickOutsideToClose = true;
		dialog.title = "Cambia password";
		dialog.class = "";
		dialog.content_tmpl = "tmpl/change_password.tmpl.html";
		dialog.toolbar_action_buttons_tmpl = "tmpl/default_toolbar_action_buttons.tmpl.html";
		dialog.disabledform = false;
		dialog.editableform = true;

		dialog.username = username ? username : $rootScope.logged_user.username;
		dialog.fl_force = username && username != $rootScope.logged_user.username; //questo dovrebbe significare anche che sono admin...

		return $scope.alert(dialog).then(
			(answer) => {
				return $scope.ajax(
					"api/login/change_password.php"
					,{
						username: answer.username
						,old_password: answer.old_password
						,new_password: answer.new_password
					}
					,true
				).then(
					(response) => {
						$scope.toast(response);
						return Promise.resolve(response);
					}
					,(response) => {return Promise.reject(response)}
				);
			}
			,(answer) => {return Promise.reject(answer)}
		);
	}
}]);