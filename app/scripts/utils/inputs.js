/**
 * Creates an object with the values of all filled input fields 
 * on the current page. Uses each input's ID as a key. 
 */
export default function getInputs() {

	let params = {} 

	let inputs = document.querySelectorAll( 'input, textarea, select' ) 

	for( let i of inputs ) {

		if( !i.value || i.value == '' ) continue 

		if( i.type === 'date' ) { 
	
			params[ i.id ] = i.valueAsNumber
	
		} else {
	
			params[ i.id ] = i.value.trim()	
		}
	}
	
	return params 
}