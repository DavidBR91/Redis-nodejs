var http = require("http");

function iniciar(route,handle) {
  function onRequest(request, response) {
    console.log("Petición Recibida.");
    
    route(handle, request,response);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Servidor Iniciado.");
}

exports.iniciar = iniciar;
