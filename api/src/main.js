const parser  = require( 'body-parser' )
const express = require( 'express' )
const winston = require( 'winston' ) 
const moment  = require( 'moment' ) 
const path    = require( 'path' ) 
const fs      = require( 'fs' ) 
const app  	  = express() 

const CronJob = require( 'cron' ).CronJob 


require( 'express-ws' )( app ) 
require( 'dotenv' ).config() 
require( 'winston-daily-rotate-file' ) 


let clients = [] 

let endpoints = {
	'api/insert': 'insert',
	'api/search': 'search',
	'api/update': 'update',
}

let transport = new winston.transports.DailyRotateFile({
	filename: process.env.LOG_PATH + '%DATE%.log',
	datePattern: 'YYYY-MMM',
	zippedArchive: true 
})

let logger = winston.createLogger({ transports: [ transport ]  })

transport.on( 'logged', require( './report' ) ) 



app.ws( '/ws', ( ws, req ) => { 
	
	clients.push( ws ) 

	ws.on( 'close', () => {
		clients.splice( clients.indexOf( ws, 1 ))
	}) 
})

app.use( parser.json() ) 


app.use( ( req, res, next ) => { 

	let tokens = fs.readFileSync( process.env.TOKEN_PATH, 'utf-8' )

	tokens = JSON.parse( tokens ) 

	if( Object.values( tokens ).includes( req.headers.authorization ) ) { 
		
		for( let x in tokens ) 
			if( tokens[ x ] === req.headers.authorization ) 
				req.tokenOwner = x 
		
		return next()
	}
	
	return res.status( 401 ).send( { message: 'Forbidden' } )
})



for( let x in endpoints ) {
	app.post( '/' + x, ( req, res ) => {
		require( './' + endpoints[ x ] )( req, res, logger, clients )
	})
}


app.listen( process.env.PORT, () => { console.log( 'Server listening' ) })



new CronJob( '0 0 * * 0', () => {

	let fileName = `database-${ moment().format( 'YYYY-MM-DD' ) }.db`

	fs.copyFileSync( 
		process.env.DB_PATH, 
		process.env.BACKUP_PATH + fileName 
	)	

	logger.info( 'Database backup: ' + fileName )

}).start() 