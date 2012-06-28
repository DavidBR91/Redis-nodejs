var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.iniciar;
handle["/becarios"] = requestHandlers.becarios;
handle["/subir"] = requestHandlers.subir;

server.iniciar(router.route,handle);
