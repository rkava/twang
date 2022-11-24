import getInputs  from '../utils/inputs'
import request    from '../utils/request'
import openDialog from '../utils/dialog'


export default function viewJob() {

	document.getElementById( 'save_button' ).onclick = saveJob
	document.getElementById( 'delete_button').onclick = deleteJob

	window.onkeydown = e => { if( e.keyCode === 13 ) saveJob() }  
	
	let record_id 

	for( let x in window.process.argv ) {

		let arg = window.process.argv[ x ]

		if( arg.startsWith( '--id' ) ) {

			record_id = arg.split( '=' )[ 1 ]
		}
	}

	getJobInfo( record_id ) 
}



function getJobInfo( record_id ) {
	request( '/api/search', { 
		 table: 'jobs', 
		fields: { id: record_id } 
	}) 
	.then( formatInfo ) 
}



function formatInfo( info ) {

	let job = info.rows[ 0 ] 

	for( let x in job ) {

		let value = job[ x ] 

		if( value == 'null' ) value = '' 

		if( x == 'job_id' ) {
			document.getElementById( x ).innerHTML = '🏷️ ' + value
			continue 
		}
		
		if( x == 'start_date' ) {
			document.getElementById( x ).valueAsDate = new Date( parseInt( value ) ) 
			continue 
		}

		document.getElementById( x ).value = value
	}
}


function saveJob() {

	let fields = getInputs() 

	request( '/api/update', { 
		 table: 'jobs', 
		action: 'update',
		    id: document.getElementById( 'id' ).value, 
		fields: fields 
	}).then( () => {
		fetch( 'http://localhost:3000/reload' ).then( () => {
			openDialog( 'Data saved' ).then( window.close )
		})  
	})
}


function deleteJob() {

	openDialog( 'Are you sure?', true ).then( data => {

		if( data.response === 1 ) return 

		request( '/api/update', { 
			 table: 'jobs', 
			action: 'delete', 
			    id: document.getElementById( 'id' ).value 
		}).then( () => {
			fetch( 'http://localhost:3000/reload' ).then( () => {
				openDialog( 'Record deleted' ).then( window.close )
			})  
		})
	})
}