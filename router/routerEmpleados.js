const execute = require('./connection');
const express = require('express');
const router = express.Router();

// VENTAS BUSCAR PRODUCTO POR DESCRIPCION
router.get("/vendedores", async(req,res)=>{
    
    const {app,empnit} = req.query;
        
    let qry ='';

    switch (app) {
        case 'ISC':
            qry = `SELECT CODVEN,NOMVEN,CLAVE FROM VENDEDORES WHERE EMP_NIT='${empnit}' AND ACTIVO='SI'`     
            break;
        case 'COMMUNITY':
            qry = `SELECT CODEMPLEADO AS CODVEN, NOMEMPLEADO AS NOMVEN, CLAVE FROM EMPLEADOS WHERE EMPNIT='${empnit}' AND CODTIPOEMPLEADO=3 AND ACTIVO='SI'`  
            break;
    
        default:
            break;
    }
    
    execute.Query(res,qry);

})

module.exports = router;
