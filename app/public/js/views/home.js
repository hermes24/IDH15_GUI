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

			$('#account-form').ajaxForm({
				beforeSubmit : function(formData, jqForm, options) {
					if (av.validateForm() == false) {
						return false;
					} else {
						// push the disabled username field onto the form data
						// array //
						formData.push({
							name : 'user',
							value : $('#user-tf').val()
						})
						return true;
					}
				},
				success : function(responseText, status, xhr, $form) {
					if (status == 'success')
						hc.onUpdateSuccess();
						console.log("Range zend button succes");
				},
				error : function(e) {
					if (e.responseText == 'email-taken') {
						av.showInvalidEmail();
					} else if (e.responseText == 'username-taken') {
						av.showInvalidUserName();
					}
				}
			});
			$('#name-tf').focus();

			// customize the account settings form //

			$('#range-form h2').text('Range Instellingen');
			$('#account-form #sub1').text(
					'Here are the current settings for your account.');
			$('#user-tf').attr('disabled', 'disabled');
			$('#account-form-btn2').html('Zend');

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
