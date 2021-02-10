const execute = require('./connection');
const express = require('express');
const router = express.Router();

// VENTANA DE VENTAS
///////////////////////////////////////

// VENTAS BUSCAR PRODUCTO POR DESCRIPCION
router.get("/buscarproducto", async(req,res)=>{
    let empnit = req.query.empnit;
    let filtro = req.query.filtro;
    let app = req.query.app;

    let qry ='';

    switch (app) {
        case 'ISC':
            qry = `SELECT PRODUCTOS.CODPROD, PRODUCTOS.DESPROD, PRECIOS.CODMEDIDA, PRECIOS.EQUIVALE, PRECIOS.COSTO, PRECIOS.PRECIO, MARCAS.DESMARCA, 0 as EXENTO
            FROM PRODUCTOS LEFT OUTER JOIN
                PRECIOS ON PRODUCTOS.CODPROD = PRECIOS.CODPROD AND 
                PRODUCTOS.EMP_NIT = PRECIOS.EMP_NIT LEFT OUTER JOIN
                MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA AND 
                PRODUCTOS.EMP_NIT = MARCAS.EMP_NIT
            WHERE (PRODUCTOS.EMP_NIT = '${empnit}') AND (PRODUCTOS.DESPROD LIKE '%${filtro}%') OR (PRODUCTOS.EMP_NIT = '${empnit}') AND (PRODUCTOS.CODPROD='${filtro}')` 
            break;
        case 'COMMUNITY':
            qry = `SELECT PRODUCTOS.CODPROD, PRODUCTOS.DESPROD, PRECIOS.CODMEDIDA, PRECIOS.EQUIVALE, PRECIOS.COSTO, PRECIOS.PRECIO, MARCAS.DESMARCA, PRODUCTOS.EXENTO
            FROM PRODUCTOS LEFT OUTER JOIN
                PRECIOS ON PRODUCTOS.CODPROD = PRECIOS.CODPROD AND 
                PRODUCTOS.EMPNIT = PRECIOS.EMPNIT LEFT OUTER JOIN
                MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA AND 
                PRODUCTOS.EMPNIT = MARCAS.EMPNIT
            WHERE (PRODUCTOS.EMPNIT = '${empnit}') AND (PRODUCTOS.DESPROD LIKE '%${filtro}%') OR (PRODUCTOS.EMPNIT = '${empnit}') AND (PRODUCTOS.CODPROD = '${filtro}')` 
            break;
    
        default:
            break;
    }
    
    execute.Query(res,qry);

})
// obtiene el total de temp ventas según sea el usuario
router.get("/tempVentastotal", async(req,res)=>{
    let empnit = req.query.empnit;
    let usuario = req.query.usuario;
    let token = req.query.token;
    let app = req.query.app;

    let qry = '';

    switch (app) {
        case 'ISC':
            qry = `SELECT COUNT(CODPROD) AS TOTALITEMS, SUM(TOTALCOSTO) AS TOTALCOSTO, SUM(TOTALPRECIO) AS TOTALPRECIO, SUM(EXENTO) AS TOTALEXENTO
            FROM TEMP_VENTAS
            WHERE (EMPNIT = '${empnit}') AND (USUARIO = '${usuario}')`        
            break;
        case 'COMMUNITY':
            qry = `SELECT COUNT(CODPROD) AS TOTALITEMS, SUM(TOTALCOSTO) AS TOTALCOSTO, SUM(TOTALPRECIO) AS TOTALPRECIO, SUM(EXENTO) AS TOTALEXENTO
            FROM TEMP_VENTAS
            WHERE (EMPNIT = '${empnit}') AND (USUARIO = '${usuario}')`
            break;
    
        default:
            break;
    }

    execute.Query(res,qry);
    
});

// obtiene el grid de temp ventas
router.get("/tempVentas", async(req,res)=>{
    let empnit = req.query.empnit;
    let usuario = req.query.usuario;
    let token = req.query.token;
    let app = req.query.app;

    let qry = '';
    switch (app) {
        case 'ISC':
            qry = `SELECT TEMP_VENTAS.ID,TEMP_VENTAS.CODPROD, TEMP_VENTAS.DESPROD, TEMP_VENTAS.CODMEDIDA, TEMP_VENTAS.CANTIDAD, TEMP_VENTAS.EQUIVALE,TEMP_VENTAS.PRECIO, TEMP_VENTAS.TOTALPRECIO
            FROM TEMP_VENTAS WHERE (TEMP_VENTAS.EMPNIT = '${empnit}') AND (TEMP_VENTAS.USUARIO = '${usuario}') `

            break;
    
        case 'COMMUNITY':
             qry = `SELECT TEMP_VENTAS.ID,TEMP_VENTAS.CODPROD, TEMP_VENTAS.DESPROD, TEMP_VENTAS.CODMEDIDA, TEMP_VENTAS.CANTIDAD, TEMP_VENTAS.EQUIVALE,TEMP_VENTAS.PRECIO, TEMP_VENTAS.TOTALPRECIO
                FROM TEMP_VENTAS WHERE (TEMP_VENTAS.EMPNIT = '${empnit}') AND (TEMP_VENTAS.USUARIO = '${usuario}') `
            break;
    
        default:
            break;
    }

    
    
    execute.Query(res,qry);
    
});

// obtiene row de temp ventas
router.post("/tempVentasRow", async(req,res)=>{
    
    const {id,app} = req.body;

    let qry = '';
    switch (app) {
        case 'ISC':
            qry = `SELECT ID,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,COSTO,PRECIO,EXENTO FROM TEMP_VENTAS WHERE ID=${id}`

            break;
    
        case 'COMMUNITY':
            qry = `SELECT ID,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,COSTO,PRECIO,EXENTO FROM TEMP_VENTAS WHERE ID=${id}`
            break;
    
        default:
            break;
    }
  
    execute.Query(res,qry);
    
});

// ACTUALIZA el grid de temp ventas
router.put("/tempVentasRow", async(req,res)=>{
    
    const {app,id,totalcosto,totalprecio,cantidad,totalunidades,exento} = req.body;
    
    let qry = '';
    switch (app) {
        case 'ISC':
            qry = `UPDATE TEMP_VENTAS SET CANTIDAD=${cantidad},TOTALCOSTO=${totalcosto},TOTALPRECIO=${totalprecio},TOTALUNIDADES=${totalunidades},EXENTO=${exento} WHERE ID=${id}`

            break;
    
        case 'COMMUNITY':
            qry = `UPDATE TEMP_VENTAS SET CANTIDAD=${cantidad},TOTALCOSTO=${totalcosto},TOTALPRECIO=${totalprecio},TOTALUNIDADES=${totalunidades},EXENTO=${exento} WHERE ID=${id}`
            break;
    
        default:
            break;
    }

    
    
    execute.Query(res,qry);
    
});

// inserta un nuevo registro en temp ventas   
router.post("/tempVentas", async(req,res)=>{
    let empnit = req.body.empnit;
    let usuario = req.body.usuario;
    let token = req.body.token;

    let codprod = req.body.codprod;
    let desprod = req.body.desprod;
    let codmedida= req.body.codmedida;
    let cantidad=Number(req.body.cantidad);
    let equivale = Number(req.body.equivale);
    let totalunidades = Number(req.body.totalunidades);
    let costo = Number(req.body.costo);
    let precio=Number(req.body.precio);
    let totalcosto =Number(req.body.totalcosto);
    let totalprecio=Number(req.body.totalprecio);
    let exento=Number(req.body.exento);

    let app = req.body.app;
    let qry = '';

    switch (app) {
        case 'ISC':
            qry = `INSERT INTO TEMP_VENTAS 
            (EMPNIT,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,EXENTO,USUARIO) 
    VALUES ('${empnit}','${codprod}','${desprod}','${codmedida}',${cantidad},${equivale},${totalunidades},${costo},${precio},${totalcosto},${totalprecio},${exento},'${usuario}')`        
            break;
        case 'COMMUNITY':
            qry = `INSERT INTO TEMP_VENTAS 
            (EMPNIT,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,EXENTO,USUARIO) 
    VALUES ('${empnit}','${codprod}','${desprod}','${codmedida}',${cantidad},${equivale},${totalunidades},${costo},${precio},${totalcosto},${totalprecio},${exento},'${usuario}')`
             break;
    
        default:
            break;
    }
    
    
    
   execute.Query(res,qry);

});
// elimina un item de la venta
router.delete("/tempVentas", async(req,res)=>{
    let id=Number(req.body.id);
    

      let qry = `DELETE FROM TEMP_VENTAS WHERE ID=${id}`
    
   execute.Query(res,qry);

});
// elimina un item de la venta todos 
router.post("/tempVentastodos", async(req,res)=>{
       
    const {empnit,usuario} = req.body;
    
    let qry = `DELETE FROM TEMP_VENTAS WHERE EMPNIT='${empnit}' AND USUARIO='${usuario}'`
    
    execute.Query(res,qry);

});
// VENTAS BUSCAR CLIENTE POR NIT O CODIGO
router.get("/buscarcliente", async(req,res)=>{
    
    const {empnit,nit, app} = req.query;
    
    let qry = '';

    switch (app) {
        case 'ISC':
            qry = `SELECT NITCLIE AS CODCLIENTE,NITFACTURA AS NIT,NOMCLIE AS NOMCLIENTE,DIRCLIE AS DIRCLIENTE,TIPOCLIE AS CATEGORIA FROM CLIENTES WHERE EMP_NIT='${empnit}' AND NITCLIE='${nit}'`         
            break;
        case 'COMMUNITY':
            
            qry = `SELECT CODCLIENTE,NIT,NOMBRECLIENTE AS NOMCLIENTE, DIRCLIENTE,CATEGORIA FROM CLIENTES WHERE EMPNIT='${empnit}' AND HABILITADO='SI' AND NIT='${nit}'` 
            break;
    
        default:
            break;
    }

    
    //let qry = `SELECT CODCLIENTE,NIT,NOMBRECLIENTE AS NOMCLIENTE, DIRCLIENTE,CATEGORIA FROM CLIENTES WHERE EMPNIT='${empnit}' AND HABILITADO='SI' AND NIT='${nit}'` 

    execute.Query(res,qry);

});

// INSERTA EL ENCABEZADO DEL PEDIDO
router.post("/documentos", async (req,res)=>{
    const {app,empnit,anio,mes,coddoc,fecha,fechaentrega,formaentrega,nomclie,codbodega,totalcosto,totalprecio,nitclie,dirclie,obs,direntrega,usuario,codven} = req.body;
    let correlativo = req.body.correlativo;
    
    let ncorrelativo = correlativo;

    switch (correlativo.toString().length) {
        case 1:
            correlativo = '         ' + correlativo;
        break;
        case 2:
            correlativo = '        ' + correlativo;
        break;
        case 3:
            correlativo = '       ' + correlativo;
            
        break;
        case 4:
            correlativo = '      ' + correlativo;
            break;
        case 5:
            correlativo = '     ' + correlativo;
            break;
        case 6:
            correlativo = '    ' + correlativo;
            break;
        case 7:
            correlativo = '   ' + correlativo;
            break;
        case 8:
            correlativo = '  ' + correlativo;
        break;
        case 9:
            correlativo = ' ' + correlativo;
        break;
        case 10:
            correlativo = correlativo;
        break;
        default:
            break;
    };
    
    let nuevocorrelativo = Number(ncorrelativo) + 1;


    let qry = ''; // inserta los datos en la tabla documentos
    let qrydoc = ''; // inserta los datos de la tabla docproductos
    let qrycorrelativo = ''; //actualiza el correlativo del documento

    switch (app) {
        case 'ISC':
            qry = `INSERT INTO DOCUMENTOS (
                EMP_NIT, DOC_ANO, DOC_MES, CODDOC, DOC_NUMERO, 
                CODCAJA, DOC_FECHA, DOC_NUMREF, DOC_NOMREF, BODEGAENTRADA,
                BODEGASALIDA, USUARIO, DOC_ESTATUS, DOC_TOTALCOSTO, DOC_TOTALVENTA,
                DOC_HORA, DOC_FVENCE, DOC_DIASCREDITO, DOC_CONTADOCREDITO, DOC_DESCUENTOTOTAL,
                DOC_DESCUENTOPROD, DOC_PORDESCUTOTAL, DOC_IVA, DOC_SUBTOTALIVA, DOC_SUBTOTAL,
                NITCLIE, DOC_PORDESCUFAC, CODVEN, DOC_ABONOS, DOC_SALDO,
                DOC_VUELTO, DOC_NIT, DOC_PAGO, DOC_CODREF, DOC_TIPOCAMBIO,
                DOC_PARCIAL, DOC_ANTICIPO, ANT_CODDOC, ANT_DOCNUMERO, DOC_OBS,
                DOC_PORCENTAJEIVA, DOC_ENVIO, DOC_CUOTAS, DOC_TIPOCUOTA, 
                DIVA_NUMINT, FRT_CODIGO, TRANSPORTE, DOC_REFPEDIDO, DOC_REFFACTURA,
                CODPROV, DOC_TOTALOTROS, DOC_RECIBO, DOC_MATSOLI, DOC_REFERENCIA, 
                DOC_LUGAR, DOC_ANOMBREDE, DOC_IVAEXO, DOC_VALOREXO, DOC_SECTOR,
                DOC_DIRENTREGA, DOC_CANTENV, DOC_EXP, DOC_FECHAENT, TIPOPRODUCCION,
                DOC_TOTCOSINV, DOC_TOTALFIN, USUARIOENUSO, DOC_IMPUESTO1, DOC_TOTALIMPU1,
                DOC_PORCOMI, DOC_DOLARES, CODMESA, DOC_TIPOOPE, USUARIOAUTORIZA, 
                NUMAUTORIZA, FECHAAUTORIZA, HORAAUTORIZA, DOC_TEMPORADA, DOC_INGUAT,
                FECHAINGBOD, HORAINGBOD, FECHASALBOD, HORASALBOD, CODVENBOD,
                CODHABI, DOC_SERIE,
                HORARECBOD, CTABAN, NUMINTBAN, 
                CODVENEMP,
                DOC_TOTCOSDOL, DOC_TOTCOSINVDOL, CODUNIDAD,
                TOTCOMBUSTIBLE, DOC_CODCONTRA, DOC_NUMCONTRA, INTERES, ABONOINTERES,
                SALDOINTERES, NUMEROCORTE, DOC_PORLOCAL, DOC_NUMORDEN, DOC_FENTREGA,
                DOC_INTERESADO, DOC_RECIBE, NUMEROROLLO, COD_CENTRO, GENCUOTA,
                DOC_PORINGUAT, DOC_INGUATEXENTO, DOC_TIPOTRANIVA, DOC_PORTIMBREPRE, DOC_TIMBREPRENSA,
                ABONOSANTICIPO, SALDOANTICIPO, DOC_PRODEXENTO, PUNTOSGANADOS, PUNTOSUSADOS,
                APL_ANTICIPO, COD_DEPARTA, FIRMAELECTRONICA, DOC_CODDOCRETENCION, DOC_SERIERETENCION,
                DOC_NUMRETENCION, FIRMAISC, ISCENVIADO
                ) 
                VALUES (
                '${empnit}', ${anio}, ${mes}, '${coddoc}', '${correlativo}',
                '', '${fecha}', '', '${nomclie}', '',
                '${codbodega}', '${usuario}', 'I', ${totalcosto}, ${totalprecio},
                0, '${fecha}', 0, 'CON', 0,
                0, 0, 0, ${totalprecio}, ${totalprecio},
                '${nitclie}', 0, '${codven}', 0, 0, 
                0, '${nitclie}', 0, '', 1, 
                0, 0, '', '', '${obs}',
                0, 0, 0, 0, 
                0, '', '${formaentrega}', '', '',
                '', 0, 0, '${direntrega}', '', 
                '', '', '', 0, '', 
                '${dirclie}', '', '', '${fechaentrega}', '',
                ${totalcosto}, 0, '', 0, 0,
                0, 0, '', 0,'',
                0, '${fecha}', 0, 0, 0,
                '${fecha}', 0, GETANSINULL(), 0, 0,
                '', '', 
                0, 0, 0, 
                0,
                0, 0, '',
                0, '', '', 0, 0, 
                0, 0, 0, '','NO',
                '', '', 0, '', '',
                10, 'N', 'C', 0.5, 0,
                0, 0, 0, 0, 0,
                '', '', '', '', '',
                '', '', 0
                );`
                  //GETANSINULL()
            qrydoc = `INSERT INTO DOCPRODUCTOS 
                  (EMP_NIT,DOC_ANO,DOC_MES,CODDOC,DOC_NUMERO,DOC_ITEM,CODPROD,CODMEDIDA,CANTIDAD,
                  EQUIVALE,CANTIDADINV,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,BODEGAENTRADA,BODEGASALIDA,
                  SUBTOTAL,DESCUENTOPROD,PORDESCUPROD,DESCUENTOFAC,PORDESCUFAC,TOTALDESCUENTO,DESCRIPCION,
                  SUBTOTALPROD,TIPOCAMBIO,PRODPRECIO,CANTIDADENVIADA,CODFAC,NUMFAC,ITEMFAC,NOAFECTAINV,PRODFVENCE,
                  DOCPESO,COSTOINV,FLETE,TOTALPRECIOFIN,PRECIOFIN,TOTALCOSTOINV,CANTIDADBONI,CODOPR,NUMOPR,
                  ITEMOPR,CODINV,NUMINV,ITEMINV,TIPOCLIE,LISTA,PORIVA,VALORIVA,NOLOTE,VALORIMPU1,DESEMPAQUE,
                  SALDOINVANTCOM,NCUENTAMESA,CUENTACERRADA,COSTODOL,COSTOINVDOL,TOTALCOSTODOL,TOTALCOSTOINVDOL,
                  IMPCOMBUSTIBLE,CODVENPROD,COMIVEN,SOBREPRECIO,CODREG,NUMREG,ITEMREG,CANTIDADORIGINAL,CANTIDADMODIFICADA,NSERIETARJETA,
                  CODOC,NUMOC,PORTIMBREPRENSA,VALORTIMBREPRENSA,CODTIPODESCU,TOTALPUNTOS,ITEMOC,CODPRODORIGEN,CODMEDIDAORIGEN,
                  CANTIDADDEVUELTA,CODARANCEL,CANTIDADPIEZAS,CODPRODLEECODIGO) 
                  SELECT 
                  EMPNIT,${anio} as DOC_ANO,${mes} AS DOC_MES,'${coddoc}' AS CODDOC,'${correlativo}' AS DOC_NUMERO,ID AS DOC_ITEM,CODPROD,CODMEDIDA,CANTIDAD,
                  EQUIVALE,TOTALUNIDADES AS CANTIDADINV,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,
                  '','${codbodega}',
                  TOTALPRECIO,0,0,0,0,0,DESPROD,TOTALPRECIO,1,PRECIO,TOTALUNIDADES AS CANTIDADENVIADA,'','',0,0,GETANSINULL(),0,COSTO,0,TOTALPRECIO,
                  PRECIO,TOTALCOSTO,0,'','',0,'','',0,
                  'P',
                  '',
                  0,0,'SN',0,'',0,'',0,0,0,0,0,0,0,0,0,'','',0,0,0,'','','',0,0,'',0,0,'','',0,'',1,CODPROD
                  FROM TEMP_VENTAS   
                  WHERE EMPNIT='${empnit}' AND USUARIO='${usuario}';`
            qrycorrelativo =`UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevocorrelativo} WHERE EMP_NIT='${empnit}' AND CODDOC='${coddoc}'`
            break;
        case 'COMMUNITY':

            break;
    
        default:
            break;
    };

    execute.Query(res,qry + qrydoc + qrycorrelativo);
    
    /*
                           qry = `INSERT INTO DOCUMENTOS (
                EMP_NIT, DOC_ANO, DOC_MES, CODDOC, DOC_NUMERO, 
                CODCAJA, DOC_FECHA, DOC_NUMREF, DOC_NOMREF, BODEGAENTRADA,
                BODEGASALIDA, USUARIO, DOC_ESTATUS, DOC_TOTALCOSTO, DOC_TOTALVENTA,
                DOC_HORA, DOC_FVENCE, DOC_DIASCREDITO, DOC_CONTADOCREDITO, DOC_DESCUENTOTOTAL,
                DOC_DESCUENTOPROD, DOC_PORDESCUTOTAL, DOC_IVA, DOC_SUBTOTALIVA, DOC_SUBTOTAL,
                NITCLIE, DOC_PORDESCUFAC, CODVEN, DOC_ABONOS, DOC_SALDO,
                DOC_VUELTO, DOC_NIT, DOC_PAGO, DOC_CODREF, DOC_TIPOCAMBIO,
                DOC_PARCIAL, DOC_ANTICIPO, ANT_CODDOC, ANT_DOCNUMERO, DOC_OBS,
                DOC_PORCENTAJEIVA, DOC_ENVIO, DOC_CUOTAS, DOC_TIPOCUOTA, DOC_FMODIFICA,
                DIVA_NUMINT, FRT_CODIGO, TRANSPORTE, DOC_REFPEDIDO, DOC_REFFACTURA,
                CODPROV, DOC_TOTALOTROS, DOC_RECIBO, DOC_MATSOLI, DOC_REFERENCIA, 
                DOC_LUGAR, DOC_ANOMBREDE, DOC_IVAEXO, DOC_VALOREXO, DOC_SECTOR,
                DOC_DIRENTREGA, DOC_CANTENV, DOC_EXP, DOC_FECHAENT, TIPOPRODUCCION,
                DOC_TOTCOSINV, DOC_TOTALFIN, USUARIOENUSO, DOC_IMPUESTO1, DOC_TOTALIMPU1,
                DOC_PORCOMI, DOC_DOLARES, CODMESA, DOC_TIPOOPE, USUARIOAUTORIZA, 
                NUMAUTORIZA, FECHAAUTORIZA, HORAAUTORIZA, DOC_TEMPORADA, DOC_INGUAT,
                FECHAINGBOD, HORAINGBOD, FECHASALBOD, HORASALBOD, CODVENBOD,
                CODHABI, DOC_SERIE, DOC_FECHAFAC, DOC_IVARETENIDO, FECHARECBOD,
                HORARECBOD, CTABAN, NUMINTBAN, FECHARECEMP, HORARECEMP,
                FECHAINGEMP, HORAINGEMP, FECHASALEMP, HORASALEMP, CODVENEMP,
                FECHARECFAC, HORARECFAC, FECHAINGFAC, HORAINGFAC, FECHASALFAC,
                HORASALFAC, FECHARECENT, HORARECENT, FECHAINGENT, HORAINGENT,
                FECHASALENT, HORASALENT, DOC_TOTCOSDOL, DOC_TOTCOSINVDOL, CODUNIDAD,
                TOTCOMBUSTIBLE, DOC_CODCONTRA, DOC_NUMCONTRA, INTERES, ABONOINTERES,
                SALDOINTERES, NUMEROCORTE, DOC_PORLOCAL, DOC_NUMORDEN, DOC_FENTREGA,
                DOC_INTERESADO, DOC_RECIBE, NUMEROROLLO, COD_CENTRO, GENCUOTA,
                DOC_PORINGUAT, DOC_INGUATEXENTO, DOC_TIPOTRANIVA, DOC_PORTIMBREPRE, DOC_TIMBREPRENSA,
                ABONOSANTICIPO, SALDOANTICIPO, DOC_PRODEXENTO, PUNTOSGANADOS, PUNTOSUSADOS,
                APL_ANTICIPO, COD_DEPARTA, FIRMAELECTRONICA, DOC_CODDOCRETENCION, DOC_SERIERETENCION,
                DOC_NUMRETENCION, FIRMAISC, ISCENVIADO
                ) 
                VALUES (
                '${empnit}', ${anio}, ${mes}, '${coddoc}', '${correlativo}',
                '', '${fecha}', '', '${nomclie}', '',
                '${codbodega}', '${usuario}', 'I', ${totalcosto}, ${totalprecio},
                0, '${fecha}', 0, 'CON', 0,
                0, 0, 0, ${totalprecio}, ${totalprecio},
                '${nitclie}', 0, '${codven}', 0, 0, 
                0, '${nitclie}', 0, '', 1, 
                0, 0, '', '', '${obs}',
                0, 0, 0, 0, GETANSINULL(),
                0, '', '', '', '',
                '', 0, 0, '', '${direntrega}',
                '', '', '', 0, '', 
                '${dirclie}', '', '', '', '',
                ${totalcosto}, 0, '', 0, 0,
                0, 0, '', 0,'',
                0, '${fecha}', 0, 0, 0,
                '${fecha}', 0, GETANSINULL(), 0, 0,
                '', '', GETANSINULL(), 0, GETANSINULL(),
                0, 0, 0, GETANSINULL(), 0,
                GETANSINULL(), 0, GETANSINULL(), 0, 0,
                GETANSINULL(), 0, GETANSINULL(), 0, GETANSINULL(),
                0, GETANSINULL(), 0, GETANSINULL(), 0,
                GETANSINULL(), 0, 0, 0, '',
                0, '', '', 0, 0, 
                0, 0, 0, '','NO',
                '', '', 0, '', '',
                10, 'N', 'C', 0.5, 0,
                0, 0, 0, 0, 0,
                '', '', '', '', '',
                '', '', 0
                );`
     */
    
});

// DESPACHO - BODEGA
/////////////////////////////////////////////////////

// DESPACHO PEDIDOS PENDIENTES
router.get("/pedidospendientes", async(req,res)=>{
    
    const {empnit, app} = req.query;
    
    let qry = '';

    switch (app) {
        case 'ISC':
            qry = `SELECT CODDOC, DOC_NUMERO AS CORRELATIVO, DOC_FECHA AS FECHA, DOC_NOMREF AS NOMCLIE, DOC_OBS AS OBS, DOC_DIRENTREGA AS DIRENTREGA, DOC_TOTALVENTA AS IMPORTE FROM DOCUMENTOS WHERE EMP_NIT='${empnit}' AND DOC_FENTREGA='NO' ORDER BY DOC_FECHA, DOC_NUMERO`         
            break;
        case 'COMMUNITY':
            
            qry = `SELECT CODDOC, CORRELATIVO, FECHA, DOC_NOMCLIE AS NOMCLIE, OBS, DIRENTREGA, TOTALPRECIO AS IMPORTE WHERE EMPNIT='${empnit}' AND ST='P'` 
            break;
    
        default:
            break;
    }

    execute.Query(res,qry);

});

// DESPACHO PEDIDO DESPACHADO EN BODEGA
router.post("/pedidodespachado", async(req,res)=>{
    
    const {empnit, coddoc,correlativo, app} = req.body;
    
    let qry = '';

    switch (app) {
        case 'ISC':
            qry = `UPDATE DOCUMENTOS SET DOC_FENTREGA='SI' WHERE EMP_NIT='${empnit}' AND DOC_FENTREGA='NO' AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}'`         
            break;
        case 'COMMUNITY':
            
            qry = `UPDATE DOCUMENTOS SET ST='E' WHERE EMPNIT='${empnit}' AND ST='P' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo}` 
            break;
    
        default:
            break;
    }


    execute.Query(res,qry);
});

// DETALLE DEL PEDIDO SELECCIONADO
router.post("/pedidodetalle", async(req,res)=>{
    
    const {empnit, coddoc,correlativo, app} = req.body;
    
    let qry = '';

    switch (app) {
        case 'ISC':
            qry = `SELECT CODPROD,DESCRIPCION AS DESPROD, CODMEDIDA, CANTIDAD, CANTIDADINV AS TOTALUNIDADES, TOTALPRECIO FROM DOCPRODUCTOS WHERE EMP_NIT='${empnit}' AND CODDOC='${coddoc}' AND DOC_NUMERO='${correlativo}'`         
            break;
        case 'COMMUNITY':
            
            qry = `SELECT CODPROD,DESPROD,CODMEDIDA,CANTIDAD,TOTALUNIDADES,TOTALPRECIO FROM DOCPRODUCTOS WHERE EMPNIT='${empnit}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo}` 
            break;
    
        default:
            break;
    }


    execute.Query(res,qry);
});

    
module.exports = router;