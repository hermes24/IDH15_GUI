var request = require('request');

exports.sendNewRequest = function(newData, callback){
	var myJSONObject = {
			partner	: newData.partner,
			number	: newData.number,
			nameCustomer	: newData.nameCustomer,
			discipline	: newData.discipline,
			unit	: newData.unit
	};
	request({
	    url: "http://localhost:3001/sqlInsert",
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: myJSONObject
	}, function (error, response, body){
	    console.log("Response in request-manager :" + response.body);
	});

}

exports.sendEditRequest = function(newData, callback){
	var myJSONObject = {
			id	: newData.id
	};
	request({
	    url: "http://localhost:3001/sqlEdit",
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: myJSONObject
	}, function (error, response, body){
	    console.log("Response in request-manager :" + response.body);
	});

}

exports.sendNewRequestToMailManager = function(newData, callback){
	console.log("sendNewRequestToMailManager in request-manager function");
	var myJSONObject = {
			partner	: newData.partner,
			customer	: newData.customer,
			cluster	: newData.cluster,
			range	: newData.range,
			unit	: newData.unit,
			spoed 	: newData.spoed			
		};
	request({
	    url: "http://localhost:3001/mailmanagersql",
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: myJSONObject

	}, function (error, response, body){
	    console.log("Response in request-manager :" + response.body);
	});

}

exports.sendNewRequestToMailManagerMongo = function(newData, callback){
	console.log("sendNewRequestToMailManager in request-manager function");
	var myJSONObject = {
			partner	: newData.partner,
			customer	: newData.customer,
			range	: newData.range,
			unit	: newData.unit
	};
	request({
	    url: "http://localhost:3001/mailManagerMongo",
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: myJSONObject
	}, function (error, response, body){
	    console.log("Response in request-manager :" + response.body);
	});

}





