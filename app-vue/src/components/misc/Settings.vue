<template>
	<div id="settings">
		<h1>Settings</h1>
		<label> API Token </label>
		<input v-model="apiToken" />
		<label> Server address </label>
		<input v-model="serverAddress" />  
		<button @click="saveSettings">Save</button>
	</div>
</template>

<script>
export default {
	name: 'Settings',
	data() {
		return {
			apiToken: localStorage.getItem( 'apiToken' ) || '',
			serverAddress: localStorage.getItem( 'serverAddress' ) || ''
		}
	},
	methods: {
		saveSettings() {
			localStorage.setItem( 'apiToken', this.apiToken ) 
			localStorage.setItem( 'serverAddress', this.serverAddress ) 
		}
	}
}
</script>

<style scoped>
#settings { 
	display: flex;
	flex-direction: column;
}
#settings > * {
	margin-left: 10px;
}
input {
	width: 200px;
	margin-bottom: 15px;
}
label {
	margin-bottom: 5px;
}
button {
	margin-top: 15px;
	width: 208px;
}
</style>
