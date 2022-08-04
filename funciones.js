function actualizacion(codigo, estado, detalle, fecha) {
    const ss = SpreadsheetApp.openById("1N_vcBQvpyxriJW0KqNfKiiOnV9E3Vzr8jFQz0vZ2Zno");
    const hojaGeneral = ss.getSheetByName("General");
  
    var bd = hojaGeneral.getDataRange().getValues();
    var encabezados = bd[0];
    var codigosBD = bd.map(function (item) { return item[encabezados.indexOf("Código de seguimiento")] });
    var rangoEstado = hojaGeneral.getRange(Number(codigosBD.indexOf(codigo)) + 1, Number(encabezados.indexOf("Estado de agenda")) + 1);
  
    if (rangoEstado.getValue() != "Finalizado" && codigosBD.includes(codigo)) {
      let rangoDetalle = hojaGeneral.getRange(Number(codigosBD.indexOf(codigo)) + 1, Number(encabezados.indexOf("Detalle")) + 1);
      rangoDetalle.setValue(`${rangoDetalle.getValue()}\n------------------------------------------------------------------------------------\n${generarFechaCorta()} - ${detalle}`);
  
      rangoEstado = hojaGeneral.getRange(Number(codigosBD.indexOf(codigo)) + 1, Number(encabezados.indexOf("Estado de agenda")) + 1);
      rangoEstado.setValue(estado);
  
      if (estado == "En proceso" && fecha != "") {
        let rangoFecha = hojaGeneral.getRange(Number(codigosBD.indexOf(codigo)) + 1, Number(encabezados.indexOf("Fecha estimada de resolución")) + 1);
        rangoFecha.setValue(fecha);
      }
      let rangoEtiqueta = hojaGeneral.getRange(Number(codigosBD.indexOf(codigo)) + 1, Number(encabezados.indexOf("Etiqueta actualización")) + 1);
      rangoEtiqueta.setValue("Actualizado");
    }
  }
  
  function generarFecha(){
    var date = new Date();
    var dia = date.getDate();
    var mes = date.getMonth() + 1;
    var anio = date.getFullYear();
    date = dia + "/" + mes + "/" + anio;
    return date;
  }
  
  function generarFechaCorta() {
    var date = new Date();
    var dia = date.getDate();
    var mes = date.getMonth() + 1;
    date = dia + "/" + mes;
    return date;
  }
  
  function generarCodigo(tema) {
    var codigo = parseInt(Math.random() * (10000 - 1000) + 1000);
    var letra
    switch (tema) {
      case "Campamento": letra = "C";
        break;
      case "Escuela de Verano/Invierno": letra = "E";
        break;
      case "CATE": letra = "K";
        break
      case "Jornada Extendida": letra = "J";
        break;
      case "Comunicación": letra = "G";
        break;
      case "Mobiliario": letra = "M";
        break;
      case "Arreglos": letra = "L";
        break;
      case "Infraestructura": letra = "I";
        break;
      default: letra = "A";
        break;
    }
    return letra + codigo;
  }