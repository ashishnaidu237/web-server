var express= require('express');
var app= express();
var http=require('http');
var cassandra= require('cassandra-driver');
var PORT=process.env.PORT || 3000;
var client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect(function(err,result)
{
	console.log('app:  cassandra connected');
})
var getAllSubscribers="select * from people.subscribers  ";

var middleware= require('./middleware.js');
http.createServer(function(req,res){

	res.writeHead(200,{'Content-Type':'text/plain'});
	client.execute(getAllSubscribers,[],function(err,result)
{
	
//console.log(result);
	res.end(JSON.stringify({result}));
});

app.use(middleware.logger);
app.get('/about', middleware.requireAuthentication, function(req,res)
{
res.send('About Us!');
});
app.use(express.static(__dirname +'/public'));

app.listen(PORT, function()
	{
		console.log('Express serevr started on port '+PORT+ '!');
	});
