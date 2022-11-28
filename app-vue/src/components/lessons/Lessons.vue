<template>
	<div id="lessons">
		<h1>Lessons</h1> 
	</div>
</template>

<script>
//import Day     from './Day.vue'     //Lessons occuring on a specific day
//import Room    from './Room.vue'    //Lessons occuring in a specific room (entire week)
//import Teacher from './Teacher.vue' //Lessons with a specific teacher (entire week) 
//import Today   from './Today.vue'   //Lessons happening on the current day

/**
 * Select which component to render the same way it is selected 
 * when chosing a tab on the sidebar. Give each component a hash 
 * route and use <a> tags to select which route to go to 
 */

export default {
	name: 'Lessons',
}
</script>

<style scoped>
#lessons { 
}
</style>
