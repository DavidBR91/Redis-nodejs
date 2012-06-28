
client = require("redis").createClient();
var qs = require('querystring');
var url= require("url");

function addUser(id, email, nombre_com){
	client.hset(id, "email", email);
	client.hset(id, "nombre_com", nombre_com);
	client.incr("num_users");
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

function becarios(request,response) {
    
    var req_url=url.parse(request.url,true);
    
    var method=request.method;
  
    if(method=='GET'){
	var usuario = req_url.query['id'];
	console.log(usuario);
	getUser(response,usuario);
    }
    if(method=='POST'){
	var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var posted = qs.parse(body);
            addUser(posted["id"],posted["email"],posted["nombre_com"]);
        });
    }
}

function subir(method) {
  console.log("Manipulador de petición 'subir' ha sido llamado.");
}

exports.becarios = becarios;
exports.subir = subir;
