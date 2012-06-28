
client = require("redis").createClient();

function addUser(id, email, nombre_com){
	client.hset(id, "email", email);
	client.hset(id, "nombre_com", nombre_com);
	client.incr("num_users");
}

function getUser(response,id){
	client.hgetall(id,function (err, replies) {
		console.log(replies);
        	response.writeHead(200, {"Content-Type": "text/plain"});
        	response.write(replies["email"]);
        	response.write(replies["nombre_com"]);
    		response.end();
        	
    	});
}

function becarios(method,req_url,response) {
  
    if(method=='GET'){
	console.log("se hizo peticion get con" + req_url.query);
	addUser("fgodino","fgodino@conwet.com","Fernando Godino");
	getUser(response,"fgodino");
    }
}

function subir(method) {
  console.log("Manipulador de petición 'subir' ha sido llamado.");
}

exports.becarios = becarios;
exports.subir = subir;
