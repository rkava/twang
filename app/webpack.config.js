const path = require( 'path' )

module.exports = {
    entry: './scripts/entry.js',
	mode: 'production',
    output: {
        path: path.resolve( __dirname, './dist' ),
        filename: 'bundle.js',
    }
}