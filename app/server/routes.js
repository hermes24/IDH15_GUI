var CT = require('./modules/country-list');
var IP = require('./modules/partner-list');
var DI = require('./modules/discipline-list');
var UL = require('./modules/unit-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var RM = require('./modules/request-manager');
var DB = require('./modules/database-manager');
var sqlite3 = require('sqlite3').verbose();


module.exports = function(app) {

// main login page //
app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
	if (req.cookies.user == undefined || req.cookies.pass == undefined){
		res.render('login', { title: 'Hello - Please Login To Your Account' });
	}	else{
	// attempt automatic login //
	AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
		if (o != null){
			req.session.user = o;
			res.redirect('/home');
		}	else{
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}
	});
}
});

app.post('/', function(req, res){
	AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
		if (!o){
			res.status(400).send(e);
		}	else{
			req.session.user = o;
			if (req.body['remember-me'] == 'true'){
				res.cookie('user', o.user, { maxAge: 900000 });
				res.cookie('pass', o.pass, { maxAge: 900000 });
			}
			res.status(200).send(o);
		}
	});
});

// User profile page homepage //

app.get('/profile', function(req, res) {
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{
	console.log("succes in route");
	res.render('profile', {
		title : 'Profile',
		countries : CT,
		partners : IP,
		units : UL,
		diciplines : DI,
		udata : req.session.user
	});
}
});


app.post('/profile', function(req, res){
	if (req.session.user == null){
		res.redirect('/');
	}	else{
		AM.updateAccount({
			id		: req.session.user._id,
			name	: req.body['name'],
			email	: req.body['email'],
			pass	: req.body['pass'],
			country	: req.body['country']
		}, function(e, o){
			if (e){
				res.status(400).send('error-updating-account');
			}	else{
				req.session.user = o;
			// update the user's login cookies if they exists //
			if (req.cookies.user != undefined && req.cookies.pass != undefined){
				res.cookie('user', o.user, { maxAge: 900000 });
				res.cookie('pass', o.pass, { maxAge: 900000 });	
			}
			res.status(200).send('ok');
		}
	});
	}
});

// Logged-in User // home range  //
// GET & POST  //

app.get('/home', function(req, res) {
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{
	DB.getCustomersWithoutRange(function(callback){	
		var customers = callback; 
		DB.getFreeRanges(function(callback){
			res.render('home', {
				title : 'Home',
				partners : IP,
				customers : customers,
				ranges : callback,
				units : UL,
				diciplines : DI,
				udata : req.session.user
			});
		});
	});

}
});

app.post('/home', function(req, res){
	console.log("COMPLETE BODY in POST :" + req.body);
	console.log();
	if (req.session.user == null){
		res.redirect('/');
	}	else{
		DB.AddRangeToCustomer({
			customer	: req.body['customer'],
			range	: req.body['range'],
			unit	: req.body['unit']
		}, function(callback){
			console.log("CALLBACK MESSAGE IN ROUTES :" + callback);
			if (callback == 'UPDATE-OK'){
				res.status(200).send(callback);
				DB.getValuesByID({
					customerid : req.body['customer'],
					rangeid : req.body['range']
				},function(callback){
					console.log("CALLBACK :" + callback);
					for (var key in callback) {
  					console.log(callback[key].name + callback[key].range);
					};
				RM.sendNewRequestToMailManager({
					partner	: callback[1].partner,
					customer	: callback[0].name,
					cluster	: callback[0].cluster,
					range	: callback[1].range,
					unit	: req.body['unit'],
					spoed	: req.body['spoed']
				},function(e){
					console.log(e);
				});

				});

			}	else{
				res.status(400).send('UPDATE-ERROR');
			}
		});
	}
});

app.post('/disconnectCustomer',function(req, res){
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{

	console.log(req.body);
	console.log("disconnectCustomer in routes");
		DB.disconnectCustomerFromRange({
		id : req.body['id'] },function(callback){
			console.log("CALLBACK MESSAGE IN ROUTES :" + callback);
			if (callback == 'DISCONNECT-OK'){
				res.status(200).send(callback);
				//res.redirect('/editRange');
			}	else{
				//res.redirect('/editRange');
				res.status(400).send('DISCONNECT-ERROR');
			}
		})
}
});

// Logged-in User // edit range  //
// GET & POST  //

app.get('/editRange', function(req, res) {
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{
	DB.getCoupledRanges(function(callback){
		console.log(callback);
       	 	// All done fetching records, render response
       	 	res.render('editRange', {
       	 		title : 'Edit Range',
       	 		countries : CT,
       	 		partners : IP,
       	 		units : UL,
       	 		diciplines : DI,
       	 		udata : req.session.user,
       	 		posts : callback
       	 	});
       	 });
}
});

app.post('/editRange', function(req, res){
	if (req.session.user == null){
		res.redirect('/');
	}	else{
		console.log("ID in edit request is :" + req.body['id'])
		RM.sendEditRequest({
			id	: req.body['id']
		}, function(e){
			console.log("Response in route :" + res.body)
		});
	}
});


// Logged-in User // customers  //
// GET  //

app.get('/customers', function(req, res) {
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{
	DB.getAllCustomers(function(callback){
		
       	 	// All done fetching records, render response
       	 	res.render('customers', {
       	 		title : 'Customers',
       	 		posts : callback
       	 	});
       	 });
}
});

app.get('/newCustomer', function(req, res) {
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{
	res.render('newCustomer', {
		title : 'newCustomer',
		diciplines : DI,
		udata : req.session.user
	});
}
});

app.post('/newCustomer', function(req, res) {
	console.log("newCustomer POST function in ROUTES ");
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
	}	else	{
		DB.insertNewCustomer({
			number	: req.body['number'],
			nameCustomer	: req.body['nameCustomer'],
			discipline	: req.body['discipline'],
			cluster: req.body['cluster'],
		}, function(callback){
			console.log("CALLBACK MESSAGE IN ROUTES :" + callback);
			if (callback == 'NUMBER-IN-USE'){
				res.status(400).send(callback);
			}	else{
				res.status(200).send(callback);
			}
		});

	};
});

app.post('/removeCustomer',function(req, res){
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{

	console.log(req.body);
	console.log("removeCustomer in routes");
		DB.removeCustomer({
		id : req.body['id'] },function(callback){
			console.log("CALLBACK MESSAGE IN ROUTES :" + callback);
			if (callback == 'REMOVE-OK'){
				res.status(200).send(callback);
				//res.redirect('/editRange');
			}	else{
				//res.redirect('/editRange');
				res.status(400).send('REMOVE-ERROR');
			}
		})
}
});



// Logged-in User // range Management  //
// GET   //

app.get('/rangeManagement', function(req, res) {
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{
	DB.getAllRanges(function(callback){
       	 	// All done fetching records, render response
       	 	res.render('rangeManagement', {
       	 		title : 'rangeManagement',
       	 		posts : callback
       	 	});
       	 });
}
});

app.get('/newRange', function(req, res) {
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{
	res.render('newRange', {
		title : 'newCustomer',
		partners : IP,
		udata : req.session.user
	});
}
});

app.post('/newRange', function(req, res) {
	console.log("newRange POST function in ROUTES ");
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
	}	else	{
		DB.insertNewRange({
			range	: req.body['range'],
			partner : req.body['partner']
		},function(callback){
			console.log("CALLBACK MESSAGE IN ROUTES :" + callback);
			if (callback == 'ERROR-INSERT-RANGE'){
				res.status(400).send(callback);
			}	else{
				res.status(200).send(callback);
			}
		})
		// hier een nieuwe insert bouwen richting de DB om een nieuwe range toe te voegen.
		// Aan deze range een partner koppelen.
		// Partner verwijderen bij het koppelen van een range aan een klant.
		// DB.insertNewCustomer({
		// 	number	: req.body['number'],
		// 	nameCustomer	: req.body['nameCustomer'],
		// 	discipline	: req.body['discipline'],
		// }, function(callback){
		// 	console.log("CALLBACK MESSAGE IN ROUTES :" + callback);
		// 	if (callback == 'NUMBER-IN-USE'){
		// 		res.status(400).send(callback);
		// 	}	else{
		// 		res.status(200).send(callback);
		// 	}
		// });

	};
});

app.post('/removeRange',function(req, res){
	if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
}	else{

	console.log(req.body);
	console.log("removeRange in routes");
		DB.removeRange({
		id : req.body['id'] },function(callback){
			console.log("CALLBACK MESSAGE IN ROUTES :" + callback);
			if (callback == 'REMOVE-OK'){
				res.status(200).send(callback);
				//res.redirect('/editRange');
			}	else{
				//res.redirect('/editRange');
				res.status(400).send('REMOVE-ERROR');
			}
		})
}
});



app.post('/logout', function(req, res){
	res.clearCookie('user');
	res.clearCookie('pass');
	req.session.destroy(function(e){ res.status(200).send('ok'); });
})

// creating new accounts //

app.get('/signup', function(req, res) {
	res.render('signup', {  title: 'Signup', countries : CT });
});

app.post('/signup', function(req, res){
	AM.addNewAccount({
		name 	: req.body['name'],
		email 	: req.body['email'],
		user 	: req.body['user'],
		pass	: req.body['pass'],
		country : req.body['country']
	}, function(e){
		if (e){
			res.status(400).send(e);
		}	else{
			res.status(200).send('ok');
		}
	});
});

// password reset //

app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
	AM.getAccountByEmail(req.body['email'], function(o){
		if (o){
			EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
				if (!e){
					res.status(200).send('ok');
				}	else{
					for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
				}
			});
		}	else{
			res.status(400).send('email-not-found');
		}
	});
});

app.get('/reset-password', function(req, res) {
	var email = req.query["e"];
	var passH = req.query["p"];
	AM.validateResetLink(email, passH, function(e){
		if (e != 'ok'){
			res.redirect('/');
		} else{
	// save the user's email in a session instead of sending to the client //
	req.session.reset = { email:email, passHash:passH };
	res.render('reset', { title : 'Reset Password' });
}
})
});

app.post('/reset-password', function(req, res) {
	var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
	var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
	req.session.destroy();
	AM.updatePassword(email, nPass, function(e, o){
		if (o){
			res.status(200).send('ok');
		}	else{
			res.status(400).send('unable to update password');
		}
	})
});

// view & delete accounts //

app.get('/print', function(req, res) {
	AM.getAllRecords( function(e, accounts){
		res.render('print', { title : 'Account List', accts : accounts });
	})
});

app.post('/delete', function(req, res){
	AM.deleteAccount(req.body.id, function(e, obj){
		if (!e){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.status(200).send('ok'); });
		}	else{
			res.status(400).send('record not found');
		}
	});
});

app.get('/reset', function(req, res) {
	AM.delAllRecords(function(){
		res.redirect('/print');	
	});
});

app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
