/**
 * Replacing openDialog() calls with electron's native 
 * dialog module through a GET endpoint 
 */
export default function openDialog( message, confirm = false ) {

	return new Promise( ( resolve ) => {
		fetch( 'http://localhost:3000/dialog', {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json' 
			},
			body: JSON.stringify( { message, confirm } ) 
		})
		.then( data => data.json() )
		.then( resolve )
	})
	
}