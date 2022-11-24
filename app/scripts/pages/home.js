import getInputs from '../utils/inputs'
import request   from '../utils/request' 
import openPage  from '../utils/page' 


export default function home() {
	socket() 
	bindEvents() 
	loadSavedValues() 
}


function socket() {

	let server = localStorage.getItem( 'server_address' ) 

	let socket = new WebSocket( 'ws://' + server + '/ws' )

	socket.onmessage = window.location.reload
}



function loadSavedValues() {

	let lastTab    = localStorage.getItem( 'lastTab' ) 
	let lastSearch = localStorage.getItem( 'lastSearch' ) 

	if( !lastTab ) lastTab = 'jobs'
	
	if( lastSearch ) {

		lastSearch = JSON.parse( lastSearch ) 

		for( let x in lastSearch ) document.getElementById( x ).value = lastSearch[ x ] 
	}

	if( lastTab === 'jobs' ) searchJobs()
	
	if( lastTab === 'inventory' ) getInventory() 

}


/**
 * Binds onclick events and keydown events
 */
function bindEvents() {

	document.getElementById( 'search_button' ).onclick = searchJobs

	document.getElementById( 'jobs_selector' ).onclick = searchJobs
	
	document.getElementById( 'inventory_selector' ).onclick = getInventory

	document.getElementById( 'settings_button' ).onclick = () => openPage( 'settings' ) 
	
	document.getElementById( 'new_job_button' ).onclick = () => openPage( 'newjob' )  

	window.onkeydown = e => { if( e.keyCode === 13 ) searchJobs() }

}



function showPanel( name ) {

	document.getElementById( 'title' ).innerHTML = 
		name === 'inv' ? 'Inventory' : 'Jobs'

	let jobs      = document.getElementById( 'container_jobs' ) 
	let inventory = document.getElementById( 'container_inventory' )

	inventory.style.display    = name === 'inv' ? 'block' : 'none'
	inventory.style.visibility = name === 'inv' ? 'visible' : 'hidden'

	jobs.style.display    = name === 'jobs' ? 'block' : 'none'
	jobs.style.visibility = name === 'jobs' ? 'visible' : 'hidden'
}




function searchJobs() {

	localStorage.setItem( 'lastTab', 'jobs' )

	showPanel( 'jobs' )

	let fields = getInputs() 

	localStorage.setItem( 'lastSearch', JSON.stringify( fields ) ) 

	request( '/api/search', { 
		 limit: 100, 
		fields: fields, 
		 table: 'jobs' 
	}).then( formatJobs )
}




function formatJobs( jobs ) {

	console.log( jobs ) 

	document.getElementById( 'count' ).innerHTML = `(${ jobs.rows.length} results)`

	let parent = document.getElementById( 'job_display' )
	let dateTabs = [] 

	parent.innerHTML = ''

	for( let x in jobs.rows ) {

		let job     = jobs.rows[ x ]
		let date    = new Date( parseInt( job.start_date ) ) 
		let tabName = date.toLocaleString( 'default', { month: 'long', year: 'numeric' } )


		if( !dateTabs.includes( tabName ) ) {

			dateTabs.push( tabName )
			let tab = document.createElement( 'details' ) 
			tab.open = jobs.rows.length < 100
			tab.id = tabName
			tab.innerHTML = `<summary>${ tabName }</summary>`
			parent.appendChild( tab ) 

		} 

		let tab   = document.getElementById( tabName )
		let child = document.createElement( 'div' ) 
		
		child.classList = 'job_entry' 
		child.innerHTML = 
			`<b>${job.job_id}</b> - 
				${job.client_name}, 
				${job.item_desc}, 
				${job.job_desc}`

		child.onclick = () => openPage( 'viewJob', { id: jobs.rows[ x ].id } )
	
		tab.appendChild( child )
		
	}
}



function getInventory() {

	localStorage.setItem( 'lastTab', 'inventory' )

	showPanel( 'inv' )

	request( '/api/search', { table: 'inventory' }).then( formatInventory )
}


function formatInventory( items ) {

	console.log( items.rows ) 

	/*
		Inventory needs:
			- 'Update inventory' option:
				
	*/


}