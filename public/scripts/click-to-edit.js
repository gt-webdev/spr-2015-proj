/*
	Click-To-Edit Directive
	By: Titus Woo
	Makes text editable on click
*/

angular.module('tkw', []);

angular.module('tkw').directive('clickToEdit', function ($compile) {
	var editing = false;

	function viewTemplate() {
		return '<p>{{ data }}</p>';
	}

	function editTemplate(tag, height) {
		tag = tag || 'textarea'
		if (tag === 'input') {
			return '<input type="text" ng-blur="finishEditing()" ng-model="data">';
		} else {
			return '<'+tag+' ng-blur="finishEditing()" style="height:' + height + 'px" ng-model="data"></'+tag+'>';
		}
	}

	var linker = function (scope, elem, attrs) {
		elem.addClass('tw click-to-edit');

		elem.on('click', function () {
			if (!editing) {
				var height = elem[0].offsetHeight;
				elem.html(editTemplate(scope.tag, height));
				$compile(elem.contents())(scope);
				editing = true;
			}
		});	

		scope.finishEditing = function () {
			console.log('fired');
			elem.html(viewTemplate());
			$compile(elem.contents())(scope);
			editing = false;
			scope.onComplete()(scope.data);
		};

		elem.html(viewTemplate());
		$compile(elem.contents())(scope);
	};

	return {
		restrict: 'A',
		scope: {
			data: '=',
			onComplete: '&',
			tag: '@'
		},
		replace: false,
		link: linker
	};
});
