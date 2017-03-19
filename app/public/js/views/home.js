function home() {
	window.location.href = '/home'
}
function edit() {
	window.location.href = '/editRange'
}
function customers() {
	window.location.href = '/customers'
}
function rangeManagement() {
	window.location.href = '/rangeManagement'
}
function newCustomer() {
	window.location.href = '/newCustomer'
}

function disconnect(newData) {
	console.log(newData);
	this.disconnectCustomer(newData);
}

function removeCustomer(newData){
	console.log(newData);
	this.removeCustomer(newData);
}

function removeRange(newData){
	console.log(newData);
	this.removeRange(newData);
}

function newRange(newData){
	window.location.href = '/newRange'
}

	this.removeCustomer = function(newData) {
		var that = this;
		var rv = new RangeValidator();
		$
			.ajax({
					url : '/removeCustomer',
					type : 'POST',
					data : {
						id : newData
					},
					success : function(data) {
						that
								console.log("SUCCES");
								rv.successMessage("Customer succesfully removed");
								setTimeout(function(){window.location.href = '/customers';}, 1500)
					},
					error : function(jqXHR) {
								console.log("ERROR");
								rv.errorMessage("Remove Error");
					}
					});
		}

	this.removeRange = function(newData) {
		var that = this;
		var rv = new RangeValidator();
		$
			.ajax({
					url : '/removeRange',
					type : 'POST',
					data : {
						id : newData
					},
					success : function(data) {
						that
								console.log("SUCCES");
								rv.successMessage("Range succesfully removed");
								setTimeout(function(){window.location.href = '/rangeManagement';}, 1500)
					},
					error : function(jqXHR) {
								console.log("ERROR");
								rv.errorMessage("Remove Error");
					}
					});
		}


	



	this.disconnectCustomer = function(newData) {
		var that = this;
		var rv = new RangeValidator();
		$
				.ajax({
					url : '/disconnectCustomer',
					type : 'POST',
					data : {
						id : newData
					},
					success : function(data) {
						that
								console.log("SUCCES");
								rv.successMessage("Customer succesfully disconnected from range");
								setTimeout(function(){window.location.href = '/editRange';}, 1500)
					},
					error : function(jqXHR) {
								console.log("ERROR");
					}
				});
	}


$(document).ready(
	function() {

		var hc = new HomeController();
		var rv = new RangeValidator();
		var av = new AccountValidator();

		$('#couple-range-form').ajaxForm({
			beforeSubmit : function(formData, jqForm, options){
			console.log("beforeSubmit");
			// append 'remember-me' option to formData to write local cookie //
			formData.push({name:'spoed', value:$('.button-rememember-me-glyph').hasClass('glyphicon-ok')});
			},
			success	: function(responseText, status, xhr, $form){
				if (responseText == 'UPDATE-OK'){
					rv.successMessage(responseText);
					console.log("SUCCES IN home.js : UPDATE-OK -- /home");
					setTimeout(function(){window.location.href = '/home';}, 1500)

				}
			},
			error : function(e){
				if (e.responseText == 'UPDATE-ERROR'){
					rv.errorMessage(e.responseText);
					console.log("ERROR IN home.js : UPDATE-ERROR");
					setTimeout(function(){window.location.href = '/home';}, 2000)
				}	
			}
		});

			// Validator and check for new customer form.
			// hier een controle inbouwen op nummer van customer
			$('#new-customer-form').ajaxForm({
				success	: function(responseText, status, xhr, $form){
					if (responseText == 'INSERT-DONE'){
						rv.successMessage(responseText);
						console.log("SUCCES IN home.js : INSERT-DONE -- /customers");
						setTimeout(function(){window.location.href = '/customers';}, 1500)

					}
				},
				error : function(e){
					if (e.responseText == 'NUMBER-IN-USE'){
						rv.errorMessage(e.responseText);
						console.log("ERROR IN home.js : NUMBER-IN-USE");
						setTimeout(function(){window.location.href = '/newCustomer';}, 2000)
					}	
				}
			});

						// Validator and check for new customer form.
			// hier een controle inbouwen op nummer van customer
			$('#new-range-form').ajaxForm({
				success	: function(responseText, status, xhr, $form){
					if (responseText == 'INSERT-DONE'){
						rv.successMessage(responseText);
						console.log("SUCCES IN home.js : INSERT-DONE -- /rangeManagement");
						setTimeout(function(){window.location.href = '/rangeManagement';}, 1500)

					}
				},
				error : function(e){
					if (e.responseText == 'ERROR-INSERT-RANGE'){
						rv.errorMessage(e.responseText);
						console.log("ERROR IN home.js : NUMBER-IN-USE");
						setTimeout(function(){window.location.href = '/newRange';}, 2000)
					}	
				}
			});




			$('#name-tf').focus();

			// customize the home form // 
			$('#couple-range-form h2').text('Home');


			// customize the edit range form //
			$('#edit-range-form h2').text('Range Overview');
	
			
			// customize the range settings form //

			$('#range-form h2').text('Range Settings');
			$('#user-tf').attr('disabled', 'disabled');

			// customize the customers settings form //
			
			$('#customer-form h2').text('Customers Settings');
			$('#add-customer-btn').html('Nieuw');
			$('#add-customer-to-db-btn').html('Toevoegen');
			$('#send-form-request-btn1').html('Zend');

			// customize the new range settings form //

			$('#new-range-form h2').text('Add Range');
			$('#add-range-btn').html('Nieuw');
			
			// customize new customer form settings // 

			$('#new-customer-form h2').text('Add Customer');

			// setup the confirm window that displays when the user chooses to
			// delete their account //

			$('.modal-confirm').modal({
				show : false,
				keyboard : true,
				backdrop : true
			});
			$('.modal-confirm .modal-header h4').text('Delete Account');
			$('.modal-confirm .modal-body p').html(
				'Are you sure you want to delete your account?');
			$('.modal-confirm .cancel').html('Cancel');
			$('.modal-confirm .submit').html('Delete');
			$('.modal-confirm .submit').addClass('btn-danger');

		});
