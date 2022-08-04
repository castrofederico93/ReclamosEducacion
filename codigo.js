const ssTemas = SpreadsheetApp.openById("1DSGDLKUWlFgApnMJkxiP3IfShIiviZVanXPtQ9gNY2A");
const ssTablero = SpreadsheetApp.openById("1N_vcBQvpyxriJW0KqNfKiiOnV9E3Vzr8jFQz0vZ2Zno");

function doGet() {
  var temasPrincipales = ssTemas.getSheetByName("Tema principal").getDataRange().getValues()[0];
  var baseReclamos = ssTablero.getSheetByName("General").getDataRange().getDisplayValues();
  var encabezados = baseReclamos.shift();
  baseReclamos = baseReclamos.filter(item => item[encabezados.indexOf("Estado de agenda")] != "Finalizado");

  var template = HtmlService.createTemplateFromFile("formulario");
  template.temasPrincipales = temasPrincipales;
  template.baseReclamos = baseReclamos;
  template.encabezados = encabezados;
  template.pubUrl = getScriptUrl();
  
  var output = template.evaluate().addMetaTag("viewport", "width:device-width, initial-scale=1").setTitle("Tablero de Gestión").setFaviconUrl("https://img.icons8.com/office/16/000000/school.png");
  return output;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function seleccionTema(seleccion){
  var listaTemas = ssTemas.getSheetByName(seleccion).getDataRange().getValues()[0];
  return listaTemas;
}

function buscarEscuelas(nivel,distrito){
  let hojaBD = ssTemas.getSheetByName("Base de Datos");
  let bD = hojaBD.getRange(2,1,hojaBD.getLastRow()-1,hojaBD.getLastColumn()).getValues();

  lista = bD.filter(fila => fila[0] == nivel && fila[2] == distrito);
  lista = lista.map(esc=>esc[1]);

  return lista;
}

function doPost(e){
  var temaPrincipal = e.parameter.temaPrincipal;
  var tema = e.parameter.tema;
  var subTema1 = e.parameter.subTema1;
  var subTema2 = e.parameter.subTema2;
  var nivelEscolar = e.parameter.nivelEscolar;
  var distritoEscolar = e.parameter.distritoEscolar;
  var escuela = e.parameter.seleccionEscuela;
  var nombrePedido = e.parameter.nombrePedido;
  var fechaEstimada = e.parameter.fechaEstimada;
  var detalle = e.parameter.detalle;
  var codigoSeguimiento = e.parameter.codigoSeguimiento;
  var estado = e.parameter.estado;
  
  if (!codigoSeguimiento){
    Logger.log("Es una entrada nueva");
    var hojaReclamos = ssTablero.getSheetByName("General");
    hojaReclamos.appendRow([generarFecha(),temaPrincipal,tema,subTema1,subTema2,escuela,nivelEscolar,distritoEscolar,`${generarFechaCorta()} - ${detalle}`,generarCodigo(temaPrincipal),"Observación",fechaEstimada,nombrePedido]);
    
  } else {
    Logger.log("Es una actualización");
    codigoSeguimiento = codigoSeguimiento.toUpperCase();
    actualizacion(codigoSeguimiento,estado,detalle,fechaEstimada);
  }

  return HtmlService.createTemplateFromFile("RegistroOK").evaluate().addMetaTag("viewport", "width:device-width, initial-scale=1");
}

function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}