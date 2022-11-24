/**
 * A series of functions used to format the data coming in 
 * from the spreadsheets. 
 */
module.exports = {

	capitalizeAllWords: function( value ) {
		return value 
			.toLowerCase()
			.split( ' ' ) 
			.map( w => w[ 0 ].toUpperCase() + w.substr( 1 ) )
			.join( ' ' ) 	
	},

	removeAllWhitespace: function( value ) {
		return value.replace( /\s+/g, '' )
	},

	removeExcessWhitespace: function( value ) {
		value = `${ value }`
		return `${ 
			value.replace( /^\s{2,}/g, ' ' )
				.replace( /^\s+|^\s+$/gm, '' )
				.trim() 
		}`	
	},

	convertDateFormat: function( value, epoch ) {

		epoch = epoch || false 

		let date = new Date( ( parseInt( value ) - 25569 ) * 86400 * 1000 )
	
		if( epoch ) return date < 0 ? null : ( date.getTime() || null ) 
	
		let day   = date.getDate()
		let month = date.getMonth() + 1 //Months start at 0
		let year  = date.getFullYear() 
	
		if( day < 10   ) day   = '0' + day 
		if( month < 10 ) month = '0' + month
	
		let string =  `${day}/${month}/${year}`
	
		return string === 'NaN/NaN/NaN' ? null : string  
	}

}