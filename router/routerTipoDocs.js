const execute = require('./connection');
const express = require('express');
const router = express.Router();



router.get("/empresas", async(req,res)=>{
        
    let qry ='';

    qry = `SELECT EMPNIT, EMPNOMBRE FROM EMPRESAS ORDER BY EMPNOMBRE`;  
  
    execute.Query(res,qry);

});

// VENTAS BUSCAR PRODUCTO POR DESCRIPCION
router.get("/tipo", async(req,res)=>{
    const {app,empnit,tipo} = req.query;
        
    let qry ='';

    qry = `SELECT CODDOC,CORRELATIVO 
                FROM TIPODOCUMENTOS 
                WHERE TIPODOC='ENV' AND EMPNIT='${empnit}'`;  
  
    execute.Query(res,qry);

});

// VENTAS BUSCAR PRODUCTO POR DESCRIPCION
router.get("/correlativodoc", async(req,res)=>{
    const {app,empnit,tipo,coddoc} = req.query;
        
    let qry ='';
    qry = `SELECT CODDOC,CORRELATIVO 
                FROM TIPODOCUMENTOS 
                WHERE EMPNIT='${empnit}' AND TIPODOC='ENV' AND CODDOC='${coddoc}'`;  
    
    execute.Query(res,qry);

});

module.exports = router;
