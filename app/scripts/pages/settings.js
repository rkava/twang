import openDialog from "../utils/dialog"


export default function settings() {

	bindEvents() 

	let key = localStorage.getItem( 'api_key' ) 

	let address = localStorage.getItem( 'server_address' ) 

	if( key ) 
		document.getElementById( 'api_key' ).value = key 
	
	if( address )
		document.getElementById( 'server_address' ).value = address 
}

function bindEvents() {

	document.getElementById( 'submit' ).onclick = saveSettings
	window.onkeydown = e => { if( e.keyCode === 13 ) saveSettings() }  

}


function saveSettings() {

	let token   = document.getElementById( 'api_key' ).value 
	let address = document.getElementById( 'server_address' ).value  

	localStorage.setItem( 'api_key', token ) 
	localStorage.setItem( 'server_address', address ) 

	fetch( 'http://localhost:3000/reload' ).then(() => {

		openDialog( 'Settings saved' ).then( window.close )
	})

}
