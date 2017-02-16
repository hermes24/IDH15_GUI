function home() {
	window.location.href = '/home'
}
function edit() {
	window.location.href = '/editRange'
}
function deleteRange() {
	window.location.href = '/delete'
}

$(document).ready(
		function() {

			var hc = new HomeController();
			var av = new AccountValidator();
			
			$('#range-form').ajaxForm({
				success	: function(responseText, status, xhr, $form){
					if (status == 'success') hc.onUpdateSuccess();
					console.log("profiel update button succes");
				},
				error : function(e){
					if (e.responseText == 'email-taken'){
						av.showInvalidEmail();
					}	else if (e.responseText == 'username-taken'){
						av.showInvalidUserName();
					}
				}
			});


			$('#name-tf').focus();

			// customize the account settings form //

			$('#range-form h2').text('Range Instellingen');
			$('#user-tf').attr('disabled', 'disabled');
			$('#send-form-request-btn1').html('Zend');

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
