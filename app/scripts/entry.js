import home      from './pages/home' 
import viewJob   from './pages/viewjob'
import newJob    from './pages/newjob'
import settings  from './pages/settings'


window.onload = function() {
	
	//Figure out which page we're on and load accordingly 	 
	let file = window.location.href

	if( file.endsWith( 'settings.html' ) ) settings() 

	//The main window used to search for jobs 
	if( file.endsWith( 'home.html' ) ) home() 

	//A popup window used to create new jobs 
	if( file.endsWith( 'newJob.html' ) ) newJob() 

	//A popup windows used to view job details 
	if( file.endsWith( 'viewJob.html' ) ) viewJob()
	
	//A popup window used to create an inventory entry 
	if( file.endsWith( 'newInv.html' ) ) newInv() 
}
