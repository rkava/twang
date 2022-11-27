<template>
	<div id="sidebar">
		<h1>Sidebar</h1>
		<a href="#/jobs">Jobs</a>
		<a href="#/inventory">Inventory</a>
		<a href="#/lessons">Lessons</a>
		<a href="#/settings">Settings</a>
	</div>
</template>

<script>
export default { name: 'Sidebar' }
</script>

<style scoped>
#sidebar { 
	display: flex;
	flex-direction: column;
	position: fixed; 
	top: 0; 
	left: 0; 
	height: 100vh;
	width: 300px;
	background-color: gray;
}
#sidebar > * {
	margin-left: 10px;
	margin-bottom: 15px;
}
</style>
