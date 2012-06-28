
var url= require("url");

function route(handle, request, response) {
      var req_url=url.parse(request.url,true);
  console.log("A punto de rutear una peticion para " + req_url.pathname);
  if (typeof handle[req_url.pathname] === 'function') {
    handle[req_url.pathname](request,response);
  } else {
    console.log("No se encontro manipulador para " + req_url.pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;
