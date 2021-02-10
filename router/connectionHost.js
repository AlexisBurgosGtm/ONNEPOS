//const config = {user: 'DB_A45479_EXPRESS_admin',password: 'razors1805',server: 'sql7002.site4now.net',database: 'DB_A45479_EXPRESS',pool: {	max: 100,	min: 0,	idleTimeoutMillis: 30000}};
const config = {user: 'iEx', password: 'iEx', server: 'ONNE\\SQLDEVELOPMENT', database: 'DB_A45479_EXPRESS', pool: {max: 100,min: 0,idleTimeoutMillis: 30000}};

const sql = require('mssql');

let execute = {
	Query : (res,sqlqry)=>{	
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {
				if(err){
					res.send(err.message)
				}else{
					res.send(result);
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	},
	QueryNoSend : (res,sqlqry)=>{
		try {
		  const pool1 = new sql.ConnectionPool(config, err => {
			new sql.Request(pool1)
			.query(sqlqry, (err, result) => {				
				if(err){
					res.send(err.message)
				}else{
					res.send('Ejecución exitosa');
				}					
			})
			sql.close();  
		  })
		  pool1.on('error', err => {
			  console.log('error sql = ' + err);
			  sql.close();
		  })
		} catch (error) {
		  res.send('Error al ejecutar la consulta: ' + error)   
		  sql.close();
		}
	}
}

module.exports = execute;

