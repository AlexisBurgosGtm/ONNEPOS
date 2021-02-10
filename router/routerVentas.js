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

    
            qry = `SELECT PRODUCTOS.CODPROD, PRODUCTOS.DESPROD, PRECIOS.CODMEDIDA, PRECIOS.EQUIVALE, PRECIOS.COSTO, PRECIOS.PRECIO, MARCAS.DESMARCA, PRODUCTOS.EXENTO
            FROM PRODUCTOS LEFT OUTER JOIN
                PRECIOS ON PRODUCTOS.CODPROD = PRECIOS.CODPROD AND 
                PRODUCTOS.EMPNIT = PRECIOS.EMPNIT LEFT OUTER JOIN
                MARCAS ON PRODUCTOS.CODMARCA = MARCAS.CODMARCA AND 
                PRODUCTOS.EMPNIT = MARCAS.EMPNIT
            WHERE (PRODUCTOS.EMPNIT = '${empnit}') AND (PRODUCTOS.DESPROD LIKE '%${filtro}%') OR (PRODUCTOS.EMPNIT = '${empnit}') AND (PRODUCTOS.CODPROD = '${filtro}')` 
            
    
    execute.Query(res,qry);

})

// obtiene el total de temp ventas según sea el usuario
router.get("/tempVentastotal", async(req,res)=>{
    let empnit = req.query.empnit;
    let usuario = req.query.usuario;
    let token = req.query.token;
    let app = req.query.app;

    let qry = '';

    
            qry = `SELECT COUNT(CODPROD) AS TOTALITEMS, SUM(TOTALCOSTO) AS TOTALCOSTO, SUM(TOTALPRECIO) AS TOTALPRECIO, SUM(EXENTO) AS TOTALEXENTO
            FROM TEMP_VENTAS
            WHERE (EMPNIT = '${empnit}') AND (USUARIO = '${usuario}')`
    
    execute.Query(res,qry);
    
});

// obtiene el grid de temp ventas
router.get("/tempVentas", async(req,res)=>{
    let empnit = req.query.empnit;
    let coddoc = req.query.coddoc;
    let usuario = req.query.usuario;
    let token = req.query.token;
    let app = req.query.app;

    let qry = '';
    
             qry = `SELECT TEMP_VENTAS.ID, TEMP_VENTAS.CODPROD, TEMP_VENTAS.DESPROD, TEMP_VENTAS.CODMEDIDA, TEMP_VENTAS.CANTIDAD, TEMP_VENTAS.EQUIVALE, TEMP_VENTAS.PRECIO, TEMP_VENTAS.TOTALPRECIO
                    FROM TEMP_VENTAS LEFT OUTER JOIN
                    TIPODOCUMENTOS ON TEMP_VENTAS.EMPNIT = TIPODOCUMENTOS.EMPNIT AND TEMP_VENTAS.CODDOC = TIPODOCUMENTOS.CODDOC
                    WHERE (TEMP_VENTAS.EMPNIT = '${empnit}') AND (TEMP_VENTAS.CODDOC='${coddoc}') AND (TEMP_VENTAS.USUARIO = '${usuario}') AND (TIPODOCUMENTOS.TIPODOC = 'ENV') `
    
       
    execute.Query(res,qry);
    
});

// obtiene row de temp ventas
router.post("/tempVentasRow", async(req,res)=>{
    
    const {id,app} = req.body;

    let qry = '';
    qry = `SELECT ID,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,COSTO,PRECIO,EXENTO FROM TEMP_VENTAS WHERE ID=${id}`
      
    execute.Query(res,qry);
    
});

// ACTUALIZA el grid de temp ventas
router.put("/tempVentasRow", async(req,res)=>{
    
    const {app,id,totalcosto,totalprecio,cantidad,totalunidades,exento} = req.body;
    
    let qry = '';
    
            qry = `UPDATE TEMP_VENTAS SET CANTIDAD=${cantidad},TOTALCOSTO=${totalcosto},TOTALPRECIO=${totalprecio},TOTALUNIDADES=${totalunidades},EXENTO=${exento} WHERE ID=${id}`
    

    
    
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

    let coddoc = req.body.coddoc;


    let app = req.body.app;
    let qry = '';

    
            qry = `INSERT INTO TEMP_VENTAS 
            (EMPNIT,CODDOC,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,EXENTO,USUARIO) 
    VALUES ('${empnit}','${coddoc}','${codprod}','${desprod}','${codmedida}',${cantidad},${equivale},${totalunidades},${costo},${precio},${totalcosto},${totalprecio},${exento},'${usuario}')`
       
    
    
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
    
    const {empnit,usuario,coddoc,app} = req.body;

    let qry = "";

    qry = `DELETE FROM TEMP_VENTAS WHERE EMPNIT='${empnit}' AND USUARIO='${usuario}' AND CODDOC='${coddoc}'`
    
        
    execute.Query(res,qry);

});

// VENTAS BUSCAR CLIENTE POR NIT O CODIGO
router.get("/buscarcliente", async(req,res)=>{
    
    const {empnit,nit, app} = req.query;
    
    let qry = '';
        
    qry = `SELECT CODCLIENTE,NIT,NOMBRECLIENTE AS NOMCLIENTE, DIRCLIENTE,CATEGORIA 
            FROM CLIENTES 
            WHERE EMPNIT='${empnit}' 
            AND HABILITADO='SI' 
            AND NIT='${nit}'` 

    execute.Query(res,qry);

});

// INSERTA EL ENCABEZADO DEL PEDIDO
router.post("/documentos", async (req,res)=>{
    
    const {app,empnit,anio,mes,dia,coddoc,fecha,fechaentrega,formaentrega,codcliente,nomclie,codbodega,totalcosto,totalprecio,nitclie,dirclie,obs,direntrega,usuario,codven} = req.body;
    let correlativo = req.body.correlativo;
    let ncorrelativo = correlativo;

    //variables sin asignar
    let concre = 'CON';
    let abono = totalprecio; let saldo = 0;
    let pagotarjeta = 0; let recargotarjeta = 0;
    let codrep = 0;
    let totalexento=0;

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
            
        qry = `INSERT INTO DOCUMENTOS 
        (EMPNIT,ANIO,MES,DIA,FECHA,HORA,MINUTO,	CODDOC,CORRELATIVO,CODCLIENTE,DOC_NIT,DOC_NOMCLIE,DOC_DIRCLIE,TOTALCOSTO,TOTALPRECIO,CODEMBARQUE,STATUS,CONCRE,USUARIO,CORTE,SERIEFAC,NOFAC,CODVEN,PAGO,VUELTO,MARCA,OBS, DOC_ABONO, DOC_SALDO,TOTALTARJETA, RECARGOTARJETA,TOTALEXENTO,DIRENTREGA) 
            VALUES
        ('${empnit}',${anio},${mes},${dia},'${fecha}',0,0,'${coddoc}',${ncorrelativo},${codcliente},'${nitclie}','${nomclie}','${dirclie}',${totalcosto},${totalprecio},'GENERAL','O','${concre}','${usuario}','NO','${coddoc}',${ncorrelativo},${codven},${totalprecio},0,'NO','${obs}',${abono},${saldo},${pagotarjeta},${recargotarjeta},${totalexento},'${direntrega}');`;
        
        qrydoc = `INSERT INTO DOCPRODUCTOS 
        (EMPNIT,ANIO,MES,DIA,CODDOC,CORRELATIVO,CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,ENTREGADOS_TOTALUNIDADES,
            ENTREGADOS_TOTALCOSTO,ENTREGADOS_TOTALPRECIO,COSTOANTERIOR,COSTOPROMEDIO,CANTIDADBONIF,TOTALBONIF,NOSERIE,EXENTO) 
        SELECT EMPNIT,${anio} AS ANIO, ${mes} AS MES,${dia} AS DIA, CODDOC,${ncorrelativo} AS CORRELATIVO, CODPROD,DESPROD,CODMEDIDA,CANTIDAD,EQUIVALE,
            TOTALUNIDADES,COSTO,PRECIO,TOTALCOSTO,TOTALPRECIO,TOTALUNIDADES,TOTALCOSTO,TOTALPRECIO,COSTO,COSTO,BONIF,TOTALBONIF,NOSERIE,EXENTO 
        FROM TEMP_VENTAS WHERE EMPNIT='${empnit}' AND USUARIO='${usuario}' AND CODDOC='${coddoc}';`;

        qrycorrelativo =`UPDATE TIPODOCUMENTOS SET CORRELATIVO=${nuevocorrelativo} WHERE EMPNIT='${empnit}' AND CODDOC='${coddoc}'`

    
 console.log(qrydoc);
    execute.Query(res,qry + qrydoc + qrycorrelativo);
    
});

// DESPACHO - BODEGA
/////////////////////////////////////////////////////

// DESPACHO PEDIDOS PENDIENTES
router.get("/pedidospendientes", async(req,res)=>{
    
    const {empnit, app} = req.query;
    
    let qry = '';
            
            qry = `SELECT DOCUMENTOS.CODDOC, DOCUMENTOS.CORRELATIVO, 
                    DOCUMENTOS.FECHA, DOCUMENTOS.DOC_NOMCLIE AS NOMCLIE, 
                    DOCUMENTOS.OBS, DOCUMENTOS.DIRENTREGA, 
                    DOCUMENTOS.TOTALPRECIO AS IMPORTE
                FROM  DOCUMENTOS LEFT OUTER JOIN
                    TIPODOCUMENTOS ON DOCUMENTOS.EMPNIT = TIPODOCUMENTOS.EMPNIT AND DOCUMENTOS.CODDOC = TIPODOCUMENTOS.CODDOC
                WHERE (DOCUMENTOS.EMPNIT = '${empnit}') 
                    AND (DOCUMENTOS.STATUS = 'O') 
                    AND (TIPODOCUMENTOS.TIPODOC = 'ENV')` 
        

    execute.Query(res,qry);

});

// DESPACHO PEDIDO DESPACHADO EN BODEGA
router.post("/pedidodespachado", async(req,res)=>{
    
    const {empnit, coddoc,correlativo, app} = req.body;
    
    let qry = '';

    qry = `UPDATE DOCUMENTOS SET STATUS='E' WHERE EMPNIT='${empnit}' AND STATUS='O' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo}` 
    

    execute.Query(res,qry);
});

// DETALLE DEL PEDIDO SELECCIONADO
router.post("/pedidodetalle", async(req,res)=>{
    
    const {empnit, coddoc,correlativo, app} = req.body;
    
    let qry = '';
    qry = `SELECT CODPROD,DESPROD,CODMEDIDA,CANTIDAD,
            TOTALUNIDADES,TOTALPRECIO 
            FROM DOCPRODUCTOS 
            WHERE EMPNIT='${empnit}' 
            AND CODDOC='${coddoc}' 
            AND CORRELATIVO=${correlativo};` 
    
    execute.Query(res,qry);
    
});

    
module.exports = router;