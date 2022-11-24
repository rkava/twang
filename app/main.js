const {
	BrowserWindow, 
	dialog, 
	app
} 		= require( 'electron' ), 
express = require( 'express' ),
parser  = require( 'body-parser' ) 
server  = express() 


let window


app.whenReady().then( () => {
	
	prepareWindow() 
	prepareServer() 
})



function prepareWindow() {

	window = new BrowserWindow({
		width: 1000,
		minWidth: 1000, 
		height: 600, 
		minHeight: 600,
		autoHideMenuBar: true 
	})

	window.loadFile( './pages/home.html' )
	window.webContents.openDevTools()
}



function prepareServer() {

	server.use( parser.json() ) 

	server.get( '/reload', ( req, res ) => { 
		window.reload() 
		res.end()
	})

	server.get( '/*', createChildWindow ) 

	server.post( '/dialog', ( req, res ) => { 

		let options = { message: req.body.message } 

		if( req.body.confirm ) options.buttons = [ 'Yes', 'No' ]			
		
		let response = dialog.showMessageBoxSync( options ) 

		res.send( { response } )
	})

	server.listen( 3000 ) 
}



function createChildWindow( req, res ) {

	let page = req.path.split( '/' )[ 1 ], pageSettings = {

		viewJob: {
			webPreferences: {
				additionalArguments: [ '--id=' + req.query.id ],
					nodeIntegration: true, 
				   contextIsolation: false 
			},
			height: 600, width: 550, resizable: false },
	
		  newJob: { height: 700, width: 400 }, 
		settings: { resizable: false, height: 225, width: 350 },
		  newInv: {}
	
	}

	if( !Object.keys( pageSettings ).includes( page ) ) res.status( 404 ).end()  

	let child = new BrowserWindow({
		parent: window, 
		show: false, 
		autoHideMenuBar: true,
		...pageSettings[ page ]
	})

	child.loadFile( `./pages/${ page }.html` ) 

	child.once( 'ready-to-show', child.show )

	//child.webContents.openDevTools() //Open devtools

	res.status( 200 ).end() 
}