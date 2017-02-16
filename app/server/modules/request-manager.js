var request = require('request');

exports.sendRequest = function(newData, callback){
	var myJSONObject = {
			partner	: newData.partner,
			number	: newData.number,
			nameCustomer	: newData.nameCustomer,
			discipline	: newData.discipline,
			unit	: newData.unit
	};
	request({
	    url: "http://localhost:3001/mongoInsert",
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: myJSONObject
	}, function (error, response, body){
	    console.log("Response in request-manager :" + response.body);
	});

}




