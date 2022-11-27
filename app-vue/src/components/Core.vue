<template>
	<Sidebar /> 
	<div id="content">
		<component :is="currentView" /> 
	</div>
</template>

<script>
import Sidebar   from './misc/Sidebar.vue'
import Settings  from './misc/Settings.vue'
import Jobs      from './jobs/Jobs.vue' 
import Inventory from './inventory/Inventory.vue' 
import Lessons   from './lessons/Lessons.vue'

const routes = {
	     '/jobs': Jobs,
	'/inventory': Inventory,
	 '/settings': Settings,
	  '/lessons': Lessons 
}

export default {
	name: 'App',
	components: { Sidebar },
	data() {
		return {
			path: window.location.hash
		}
	},
	computed: {
		currentView() {
			return routes[ this.path.slice( 1 ) || '/' ]
		}
	},
	mounted() {
		window.addEventListener( 'hashchange', () => {
			this.path = window.location.hash 
		})
	}
}
</script>

<style>
#content {
	position: absolute;
	top: 0;
	height: 100vh;
	width: calc( 100vw - 300px );
	left: 300px; 
}
</style>
