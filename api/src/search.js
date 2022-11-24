const sqlite = require( 'sqlite3' ) 


module.exports = function search( req, res ) {

	let data, table = req.body.table 

	if( table === 'jobs'      ) data = searchJobs( req.body.fields )  
	if( table === 'inventory' ) data = searchInventory( req.body.fields )
	if( table === 'reports'   ) data = searchReports( req.body.fields ) 

	if( !data ) return res.send( { message: 'No table specified' } )


	if( data.query.endsWith( 'AND ' ) )
		data.query = data.query.substring( data.query.length - 4, 0 )
	 
	data.query += ' ORDER BY start_date DESC LIMIT ' + ( req.body.limit || 250 )

	runQuery( data.query, data.params, res ) 
}



function searchJobs( fields ) {

	let query = 'SELECT * FROM jobs ', params = [] 

	let searchStringFields = [ 'client_name', 'notes', 'item_desc', 'job_desc', 'client_phone' ]

	if( Object.keys( fields ).length ) query += ' WHERE ' 

	for( let field in fields ) {

		if( field === 'search_string' ) {
			
			query = generateSearchString( query, searchStringFields, fields[ field ], params )   
		 
		} else if( field === 'date_from' ) {

			query += '(start_date BETWEEN ? AND ?) AND '

			params.push( fields.date_from, fields.date_to || fields.date_from + 2678400	) 

		} else {

			query += `${field} = ? AND `
			params.push( fields[ field ] )
		}
	
	}

	return { query, params }
}



function searchInventory( fields ) {

	query = 'SELECT * FROM inventory ', params = [] 	

	if( fields && fields.search_string ) {

		query += 'WHERE '

		let searchStringFields = [ 
			'stock_brand', 'stock_model', 'stock_type',
			'stock_style', 'body_type', 'colour', 'new_or_used' 
		]	

		query = generateSearchString( query, searchStringFields, fields.search_string, params )
	}

	return { query, params }
}



function generateSearchString( query, fields, string, params ) {

	let keywords = string.split( ' ' ) 
	query += '('

	for( let y in keywords ) {

		query += '('

		for( let z in fields) {

			if( z === 0 ) query += '(' 
			params.push( `%${keywords[ y ]}%` )
			query += `${fields[ z ]} LIKE ?` + ( z == fields.length - 1  ? ')' : ' OR ' )
		}

		query += ( y == keywords.length - 1 ) ? ') AND ' : ' AND '
	}

	return query 
}



function runQuery( query, params, res ) {

	let db = new sqlite.Database( process.env.DB_PATH )

	db.serialize(() => { db.all( query, params, ( err, rows ) => {
		console.log( err, query ) 
		res.send({
			 status: err ? 400 : 200,
			message: err || 'Success',
			   rows: rows
		})
	})})

	db.close() 
}