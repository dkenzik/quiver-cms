'use strict';

/**
 * @ngdoc directive
 * @name quiverCmsApp.directive:braintreeDropIn
 * @description
 * # braintreeDropIn
 */
angular.module('quiverCmsApp')
  .directive('braintreeDropIn', function (CommerceService, NotificationService, $compile) {
  	var template = '<form id="checkout" name="braintreeDropIn"><div id="dropin"></div><button class="small small-12 text-x-medium-important margin-zero-important" ng-disabled="disabled">Add Payment Method</button></form>';
    return {
      restrict: 'EA',
      scope: {
      	token: "="
      },
      link: function postLink(scope, element, attrs) {
      	console.log(scope.token);
      	var braintreeSetup = function (token) {
		      braintree.setup(token, 'dropin', {
		        container: 'dropin',
		        paymentMethodNonceReceived: function (e, nonce) {
		        	scope.disabled = true;
		          CommerceService.createPaymentMethod(nonce).then(function (response) {
		            if (response.error) {
		              NotificationService.error('Card Error', response.error);
		            } else {
		              NotificationService.success('Card Added');
		              setupForm();
		            }
		            scope.disabled = false;
		          }, function (err) {
		            NotificationService.error('Card Error', err);    
		            scope.disabled = false;
		          });
		          
		        }
		      });  
		    },
		    setupForm = function (token) {
		    	element.empty();
		    	element.html(template);
		    	$compile(element)(scope);
		    	braintreeSetup(scope.token);
		    };

		    scope.$watch('token', function () {
		    	if (scope.token) {
		    		setupForm(scope.token)
		    	}
		    });
		    
      }
    };
  });
