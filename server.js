var http = require("http");
var url= require("url");

function iniciar(route,handle) {
  function onRequest(request, response) {
    console.log("Petición Recibida.");
    var req_url=url.parse(request.url);
    var method=request.method;
    
    route(handle, req_url, method,response);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Servidor Iniciado.");
}

exports.iniciar = iniciar;
