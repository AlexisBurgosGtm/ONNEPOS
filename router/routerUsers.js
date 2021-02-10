const express = require('express');
const router = express.Router();
const execute = require('./connection');

// LOGIN
router.post("/login", async(req,res)=>{
	
	const {app,pass} = req.body;

	let qry = '';

	switch (app) {
		case 'ISC':
				qry = `SELECT NOMBRE AS USUARIO, NIVEL FROM USUARIOS WHERE CLAVE='${pass}'`		
			break;
		case 'COMMUNITY':
				qry = `SELECT USUARIO, NIVEL FROM USUARIOS WHERE USUARIO='${pass}'`
			break;
		default:
			break;
	}
	
	execute.Query(res,qry);

});

module.exports = router;