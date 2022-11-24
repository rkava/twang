/**
 * Generates a new API token. 
 */
require( 'dotenv' ).config() 

const crypto = require( 'crypto' )
const fs = require( 'fs' ) 

let filePath = process.env.TOKEN_PATH,
   tokenName = process.argv.slice( 2, process.argv.length ).join( ' ' ),  
       token = crypto.randomBytes( 24 ).toString( 'hex' ), keyFile

try { keyFile = require( filePath ) } catch( e ) { keyFile = {} }

if( tokenName.length === 0 ) throw new Error( 'No token name provided' )

keyFile[ tokenName ] = token 

fs.writeFileSync( filePath, JSON.stringify( keyFile, null, 2 ) )

console.log( tokenName + ': ' + token )