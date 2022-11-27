const fs = require( 'fs' ),
 sqlite3 = require( 'sqlite3' ), 
    xlsx = require( 'node-xlsx' ) 

const queries = require( './queries' ),
  conversions = require( './conversions' ), 
  formatters  = require( './formatters' )  

let db, obj, json = []


createDatabase().then(() => {

	importJobs() 
	importInventory() 
	db.close() 
})



function createDatabase() {

	fs.unlink( 'output/database.db', err => {} )

	db = new sqlite3.Database( 'output/database.db' ) 

	db.serialize( () => {
		db.run( queries.createJobsTable )
		db.run( queries.createInventoryTable ) 
		db.run( queries.createLessonsTable ) 
	})

	return Promise.resolve() 
}



function importJobs() {

	let mightBeDates = [ 7, 10 , 11 ]
	let nameFields = [ 2, 7 ] 

	obj = xlsx.parse( 'input/jobs.xls', { defval: null } )

	for( let x = obj.length - 1; x >= 0; x-- ) {

		let month = obj[ x ] 

		for( let y = month.data.length - 1; y >= 0; y-- ) {

			let job = month.data[ y ] 
	
			if( job[ 0 ] === null || isNaN( parseInt( job[ 0 ] ) ) ) continue
	
			if( !job[ 2 ] && !job[ 4 ] && !job[ 5 ] ) continue 
	
			if( month.name.endsWith( '2019' ) || month.name.endsWith( 'uary 2020' ) ) 
				if( !( job[ 0 ] == '701' && job[ 2 ] == 'Ian' ) ) 
					job.splice( 6, 0, null ) 
			
			if( month.name === 'July 2021' ) job.splice( 6, 0, job.splice( 1, 1 )[ 0 ] )
			
			if( month.name.endsWith( 'ber 2022' ) ) job.splice( 11, 1 ) 
			
			job[ 1 ] = formatters.convertDateFormat( job[ 1 ], true ) 

			job = job.map( formatters.removeExcessWhitespace )

			try {
				for( let field of nameFields ) 
					job[ field ] = formatters.capitalizeAllWords( job[ field ] )
			} catch( e ) { } 

			job[ 3 ] = formatters.removeAllWhitespace( job[ 3 ] )
			
			job = job.slice( 0, 13 ) 
	
			for( let x of mightBeDates ) 
				if( !isNaN( job[ x ] ) && job[ x ] != null ) 
					job[ x ] = formatters.convertDateFormat( job[ x ] )  
	
			for( let x in conversions ) 
				if( conversions[ x ].includes( job[ 6 ] ) ) job[ 6 ] = x 
	
			job = job.map( e => `"${ e }"` ).join( ',' )
	
			if( json.includes( job ) ) continue 
			json.push( job )
	
			db.run( queries.insertJob( job ) )
		}
	}
}


function importInventory() {

	obj = xlsx.parse( 'input/inventory.xls', { defval: null } ) 

	for( let x in obj[ 0 ].data ) {
	
		if( x < 3 ) continue 
	
		let item = obj[ 0 ].data[ x ].slice( 0, 10 ) 
	
		if( !item[ 0 ] ) continue 
	
		if( !item[ 9 ] ) item[ 9 ] = 'no'
	
		item = item.map( formatters.removeExcessWhitespace )
	
		db.run( queries.insertInventory( item ), item )
	}

}