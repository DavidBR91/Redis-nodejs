
var client = require("redis").createClient();
var async = require('async');
var qs = require('querystring');
var url= require("url");
var req_url=null;

function addUser(id, email, nombre_com,response){
	if(client.hlen(id)==0){
		client.hset(id, "email", email);
		client.hset(id, "nombre_com", nombre_com);
		client.incr("num_users");
		client.rpush("users",id);
		response.writeHead(201, {"Content-Type": "text/plain", "Content-Location": req_url + id });
   		response.write("201 CREATED");
    		response.end();
	}else{
		response.writeHead(403, {"Content-Type": "text/plain"});
   		response.write("403 Forbidden");
    		response.end();
	}
}

function getUser(response,id){
	client.hgetall(id,function (err, replies) {
		if(replies==null){
			response.writeHead(404, {"Content-Type": "text/plain"});
   			response.write("404 Not found");
    			response.end();
		}else{
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write(replies["email"]);
			response.write(replies["nombre_com"]);
	    		response.end();
        	}
    	});
}

function getUsers(from, to, response){
	var id;
	
	if (from==null) from=0;
	async.waterfall([
	
	function(callback){
		if (to==null) client.llen("users", function(err, reply){
			to=reply;
			callback(null,to);
		});
	},
	function(to, callback){
		client.lrange("users",from,to,function(err,reply){
			usuarios=reply;
			callback(null,usuarios);
		});
	},
	function(usuarios,callback){
		var respuestas=new Array();
		var cont=usuarios.length;
		for (id in usuarios){
			client.hgetall(usuarios[id],function (err, replies) {
				respuestas=respuestas.concat(replies);
				console.log(replies);
				cont--;
		    	});
		}
		while(cont>0){}
		callback(null,respuestas);
	}],function(err, replies) {
  		if(replies==null){
			response.writeHead(404, {"Content-Type": "text/plain"});
		   	response.write("404 Not found");
			response.end();
			}else{
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write(replies[0]["email"]);
			response.end();
			}
    });
	
}

function becarios(request,response) {
    
    req_url = url.parse(request.url,true);
    
    var method=request.method;
  
    if(method=='GET'){
	var usuario = req_url.query['id'];
	var from = req_url.query['from'];
	var to = req_url.query['to'];
	if (usuario!=null) getUser(response,usuario);
	else getUsers(from,to,response);
	
    }
    if(method=='POST'){
	var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var posted = qs.parse(body);
            addUser(posted["id"],posted["email"],posted["nombre_com"],response);
        });
    }
}

exports.becarios = becarios;
