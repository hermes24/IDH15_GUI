var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../../Data/ranges.db');
db.run('PRAGMA foreign_keys = ON') 

// Functie maken om connectie te maken met juiste DB file.

// Daarna verschillende functies maken en deze aanroepen vanuit ROUTES zodat de code daar weg is.

exports.getCoupledRanges = function(callback){	
	var posts = [];
	db.serialize(function() 
		{
			db.each("SELECT range.id, range.customer, range.range, range.partner, customer.customerNumber, customer.name FROM range JOIN customer ON range.customer=customer.id;", function(err, row) {
				posts.push({
				id: row.id,
				customerNumber: row.customerNumber,
				range: row.range, 
				customer: row.name, 
				customerid : row.customer,
				partner: row.partner})
			}, function() {
				callback(posts);
			});

       	})
	};

exports.getAllRanges = function(callback){	
	var posts = [];
	db.serialize(function() 
		{
			db.each("SELECT * FROM range;", function(err, row) {
				posts.push({
				id: row.id,
				range: row.range,
				partner: row.partner})
			}, function() {
				callback(posts);
			});

       	})
	};

exports.getFreeRanges = function(callback){	
	var ranges = [];
	db.serialize(function() 
		{
			db.each("SELECT range.id, range.range, range.partner FROM range WHERE customer IS NULL;", function(err, row) {
				ranges.push({
				id: row.id,
				range: row.range,
				partnerAndRange: row.range + " - " +  row.partner})
			}, function() {

				callback(ranges);
			});

       	})
	};

exports.getAllCustomers = function(callback){	
	var posts = [];
	db.serialize(function() 
		{
			db.each("SELECT * FROM customer;", function(err, row) {
				posts.push({
				id: row.id,
				customerNumber: row.customerNumber,
				name: row.name,
				discipline: row.discipline,
				cluster: row.cluster})
			}, function() {
				callback(posts);
			});

       	})
	};

	exports.getCustomerByNumber = function(newData,callback){
		console.log("getCustomerByNumber function in DATABASE manager");
		var query = 'SELECT id FROM customer WHERE customerNumber = ' + "'" + newData + "'" + ';';
		console.log("getCustomerByNumber query :" + query);
		db.serialize(function() 
		{	
			db.get(query ,function(err,row){
				if(row == undefined) {
					callback('GO');
				} else {
					callback('ID-FOUND');
				}
			});
		})
	};

	exports.insertNewCustomer = function(newData, callback){
		console.log("insertNewCustomer function in DATABASE manager");
		this.getCustomerByNumber(newData.number,function(o){
			console.log("callback from getCustomerByNumber : " + o);
			if(o == 'ID-FOUND'){
				callback('NUMBER-IN-USE');
			} else {
				var query = 'INSERT INTO customer (name, customerNumber, discipline,cluster) VALUES (' + "'" + newData.nameCustomer + "'" + ',' + "'" + newData.number + "'" + ',' + "'" + newData.discipline + "'" + ',' + "'" + newData.cluster + "'" + ');';
				db.serialize(function() 
				{	
					db.run(query ,function(err){
						if(err !== null) {
							callback(err);
						}
						else {
							callback('INSERT-DONE');
						}
					});
				})
			}
		});

	};

	exports.insertNewRange = function(newData, callback){
		console.log("insertNewRange function in DATABASE manager");
		// check inbouwen of range al bestaat.
		// Voor nu gewoon toevoegen
		var query = 'INSERT INTO range (range, partner ) VALUES (' + "'" + newData.range + "'" + ',' + "'" + newData.partner + "'" + ');';
		db.serialize(function() 
		{	
			db.run(query ,function(err){
				if(err !== null) {
					callback('ERROR-INSERT-RANGE');
				}
				else {
					callback('INSERT-DONE');
				}
			});
		})

	};

	exports.getCustomersWithoutRange = function(callback){
		console.log("getCustomersWithoutRange function in DATABASE manager");
		var query = 'SELECT customer.id, customer.name FROM customer LEFT JOIN range ON customer.id=range.customer WHERE range.customer IS NULL;';
		var customers = [];
		db.serialize(function() 
		{
			db.each(query, function(err, row) {
				customers.push({
					id: row.id,
					name: row.name})
			}, function() {
				callback(customers);
			});




		})
	};

	exports.getValuesByID = function(newData,callback){
		console.log("getValuesByID function in DATABASE manager");
		var query = "SELECT customer.name,customer.cluster FROM customer WHERE customer.id = '" + newData.customerid + "';";
		var query2 = "SELECT range.range, range.partner FROM range WHERE range.id = '" +  newData.rangeid + "';";
		var result = [];
		db.serialize(function() 
		{	
			db.each(query ,function(err,row){
				if(err !== null) {
					callback(err);
				}
				else {
					result.push({
						name : row.name,
						cluster: row.cluster
					})
				}
			});
		})
		db.serialize(function() 
		{	
			db.each(query2 ,function(err,row){
				if(err !== null) {
					callback(err);
				}
				else {

					result.push({
						range : row.range,
						partner: row.partner})
				}
			},function() {
				callback(result);
			});
		})
	};

	exports.AddRangeToCustomer = function(newData,callback){
		console.log("AddRangeToCustomer function in DATABASE manager");
		var query = "UPDATE range SET customer = '" + newData.customer + "' WHERE  id = '" + newData.range + "'";
		console.log("Update Query : " + query);
			db.serialize(function() 
			{	
				db.run(query ,function(err){
					if(err !== null) {
						callback(err);
					}
					else {
						callback('UPDATE-OK');
					}
				});
			})

	}

	exports.disconnectCustomerFromRange = function(newData,callback){

		console.log("disconnectCustomerFromRange function in DATABASE manager");
		var query = "UPDATE range SET customer = NULL WHERE customer = '" + newData.id + "'";
		console.log("Update Query : " + query);
			db.serialize(function() 
			{	
				db.run(query ,function(err){
					if(err !== null) {
						callback(err);
					}
					else {
						callback('DISCONNECT-OK');
					}
				});
			})


	}

	exports.removeCustomer = function(newData,callback){

		console.log("removeCustomer function in DATABASE manager");
		var query = "DELETE FROM customer WHERE id = '" + newData.id + "'";
		console.log("Update Query : " + query);
			db.serialize(function() 
			{	
				db.run(query ,function(err){
					if(err !== null) {
						callback(err);
					}
					else {
						callback('REMOVE-OK');
					}
				});
			})


	}

	exports.removeRange = function(newData,callback){
		console.log("removeRange function in DATABASE manager");
		// Eerst range ophalen om te checken of er geen klant aanhangt.
		var query = "SELECT * FROM range WHERE id = '" + newData.id + "'";
		console.log("Select Query : " + query);
		db.serialize(function() 
		{	
			db.each(query ,function(err,row){
				console.log(row);
				if(row.customer == null ) {
					
					var query2 = "DELETE FROM range WHERE id = '" + newData.id + "'";
					console.log("Update Query : " + query2);
					db.serialize(function() 
					{	
						db.run(query2 ,function(err){
							if(err !== null) {
								callback(err);
							}
							else {
								callback('REMOVE-OK');
							}
						});
					})
				}
				else {
					callback('REMOVE-ERROR');
				}
			});
		})







	}

