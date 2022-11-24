const sqlite = require( 'sqlite3' ) 
const moment = require( 'moment' ) 


module.exports = function insert( req, res, logger, clients ) {

	let data = getQueryData( req.body.table, req.body.fields )
 
	makeRequest( data.query, data.parameters, req.body.table, res )
		.then( id => {

			logEvent( logger, req.tokenOwner, req.body, id ) 

			for( let client of clients ) client.send( 'reload' ) 
		})
}



function getQueryData( table, fields ) {

	return { 
		query: `INSERT INTO ${ table } 
				( ${ Object.keys( fields ).join( ', ') } )
			    VALUES 
				( ${ '?, '.repeat( Object.keys( fields ).length ).slice( 0, -2 ) } )`,
		parameters: Object.values( fields ), 
	}
}



function logEvent( logger, user, body, id ) {

	logger.info( 'insert', {
		date: moment().format( 'YYYY-MM-DD h:mm:ss' ), user, body, id
	})
} 



function makeRequest( query, params, table, res ) {

	let db = new sqlite.Database( process.env.DB_PATH ), id

	return new Promise( ( resolve, reject ) => {

		db.serialize( () => {

			db.run( query, params ) 

			db.all( `SELECT id FROM ${ table } ORDER BY id DESC LIMIT 1`, 
				( err, rows ) => {

					id = rows[ 0 ].id

					res.send( { message: 'Success', id } )

					db.close() 

					resolve( id )
				}
			) 
		})
	})
} 