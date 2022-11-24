import openDialog from './dialog'

/**
 * Performs api requests, deals with any issues with the request body
 * or application configuration 
 */
export default function request( path, body ) {
	return new Promise( ( resolve, reject ) => {

		let token   = localStorage.getItem( 'api_key' ) 
		let address = localStorage.getItem( 'server_address' )  

		if( !address ) return openDialog( 'Please set the server address' ) 
		if( !token )   return openDialog( 'Please set your API token' ) 

		fetch( 'http://' + address + path, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token 
			},
			body: JSON.stringify( body ) 
		})
		.then( data => data.json() )
		.then( resolve ) 
		.catch( reject ) 

	})
}