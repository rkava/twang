const sqlite = require( 'sqlite3' ) 
const moment = require( 'moment' ) 



module.exports = function update( req, res, logger, clients ) {

	let data, table = req.body.table, action = req.body.action 

	if( action === 'update' ) data = getUpdateQuery( table, req.body.id, req.body.fields ) 
	if( action === 'delete' ) data = getDeleteQuery( table, req.body.id ) 

	if( !data ) return res.send( { message: 'Invalid action' } )

	makeRequest( data.query, data.parameters, res ) 

	logEvent( logger, req.tokenOwner, req.body )

	for( let client of clients ) client.send( 'reload' ) 
} 



function getUpdateQuery( table, id, fields ) {

	return {
		query: `UPDATE ${ table } SET 
				${ Object.keys( fields ).map( e => `${e}=?` ).join( ', ' ) } 
			    WHERE id=?`, 

		parameters: [ ...Object.values( fields ), id ]
	}
}



function getDeleteQuery( table, id ) {

	return {
		query: `DELETE FROM ${ table } WHERE id=?`,
		parameters: [ id ] 
	}
}



function logEvent( logger, user, body ) {

	logger.info( 'update', { 
		date: moment().format( 'YYYY-MM-DD h:mm:ss' ), user, body 
	})
} 



function makeRequest( query, parameters, res ) {

	let db = new sqlite.Database( process.env.DB_PATH )

	db.serialize( () => { db.run( query, parameters ) })	

	db.close() 

	res.send( { message: 'Success' } )
} 