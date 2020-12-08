var http = require('http');
var urlPage = require('url');

var port = process.env.PORT || 3000;

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://dbUser:dbUser123@cluster0.4klkt.mongodb.net/?retryWrites=true&w=majority";

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	var qobj = urlPage.parse(req.url, true).query;
	var searchType = qobj.name_or_ticker;
	var input = qobj.input_text;
	//res.end("You searched for " + input + " which is a " + searchType);
	
	MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) 
	{
    	if(err) 
		{ 
			console.log("Connection err: " + err); return; 
		}
  
		var dbo = db.db("companies");
		var coll = dbo.collection('companies');
		
		var searchReturn = ("You searched for " + input);
		
		if(searchType == "company_name"){
			searchReturn += (" which is a company name <br>");
		}
		else if(searchType == "stock_ticker"){
			searchReturn += (" which is a stock ticker <br>");
		}
	
		//coll.find({},{projection: {"title":1, "author":1, "_id":0}});
		//theQuery = {author:"Bob Smith"}
		coll.find().toArray(function(err, items) { 
		if (err) 
		{
			console.log("Error: " + err);
	  	} 
	  	else 
	  	{
			console.log("Items: ");
			for (i=0; i<items.length; i++){
				console.log(i + ": " + items[i].company + " by: " + items[i].ticker);	
				if(searchType == "company_name"){
					if(input == items[i].company){
						searchReturn += ("<br>" + items[i].company + " --> " + items[i].ticker);
					}
				}
				else if(searchType == "stock_ticker"){
					if(input == items[i].ticker){
						searchReturn += ("<br>" + items[i].ticker + " --> " + items[i].company);
					}
				}
			}
	  	}
		res.end(searchReturn);
	  	db.close();
		});  //end find		
	});  //end connect
}).listen(port);