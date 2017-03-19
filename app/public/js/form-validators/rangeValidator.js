
function RangeValidator()
{
// build array maps of the form inputs & control groups //

	this.formFields = [$('#new-customer-customer-number-tf'), $('#new-customer-customer-name-tf'), $('#discipline-list')];
	this.controlGroups = [$('#new-customer-customer-number-cg'), $('#new-customer-customer-name-cg'), $('#discipline-cg')	];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});

	this.success = $('.modal-form-success');
	this.success.modal({ show : false, keyboard : true, backdrop : true});
	
	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

	this.showSuccess = function(a)
	{
		$('.modal-form-success .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-success .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.success.modal('show');
	}

}

RangeValidator.prototype.successMessage = function(newdata)
{
	this.controlGroups[1].addClass('error');
	this.showSuccess([newdata]);
}

RangeValidator.prototype.errorMessage = function(newdata)
{
	this.controlGroups[1].addClass('error');
	this.showErrors([newdata]);
}


	