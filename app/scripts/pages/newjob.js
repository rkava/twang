import request    from "../utils/request"
import getInputs  from "../utils/inputs"
import openPage   from "../utils/page"
import openDialog from "../utils/dialog"


export default function createJob() {

	document.getElementById( 'submit' ).onclick = () => {
		if( checkFields() ) submitJob() 
	}

	window.onkeydown = e => { 
		if( e.keyCode === 13 && checkFields() ) submitJob() 
	}  

	document.getElementById( 'start_date' ).valueAsDate = new Date()
}



function checkFields() {

	let mandatoryFields = [ 
		'client_name', 
		'client_phone', 
		'item_desc', 
		'job_desc' 
	]

	let fields = getInputs() 

	for( let x of mandatoryFields ) {

		if( !fields[ x ] ) { 
			openDialog( 'Please fill in all mandatory fields' ) 
			return false 
		}
	}

	return true 
}



function submitJob() {

	let fields = getInputs() 

	request( '/api/insert', { table: 'jobs', fields: fields } )
	.then( data => {
		fetch( 'http://localhost:3000/reload' ).then( () => {
			openDialog( 'Job created' ) 
			openPage( 'viewJob', { id: data.id } ).then( window.close )
		})  
	})
	.catch( e => {
		openDialog( e )
		window.close() 
	})
}