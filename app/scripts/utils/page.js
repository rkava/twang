/**
 * Uses a HTTP endpoint to open a new window 
 */
export default function openPage( page, params = '' ) {

	let query = '?' 

	if( params )
		for( let x in params ) query += `${ x }=${ params[ x ] }`

	return new Promise( ( resolve ) => {
		fetch( 'http://localhost:3000/' + page + query )
			.then( resolve ) 
	})
}