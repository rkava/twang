module.exports = {

	createJobsTable: `create table jobs (
		id integer primary key autoincrement,
		job_id          text, 
		start_date      text, 
		client_name     text, 
		client_phone    text, 
		item_desc       text, 
		job_desc        text, 
		job_status      text, 
		repairer        text,
		repair_cost     text, 
		total_cost      text, 
		contact_history text, 
		payment_info    text, 
		notes           text 
	);`,

	createInventoryTable: `create table inventory (
		id integer primary key autoincrement,
		stock_brand text,    
		stock_model text,
		stock_type  text,    
		stock_style text, 
		body_type   text,    
		price       text, 
		colour      text,    
		new_or_used text,  
		sold        text,
		quantity    integer
	);`,

	createLessonsTable: `create table lessons (
		teacher_name text, 
		student_name text, 
		lesson_day text,  
		lesson_time text,
		lesson_duration text,
		lesson_cost text,
		lesson_room text,
		lesson_frequency,
		last_lesson_date
	);`,

	insertJob: job => 
		`insert into jobs (
			job_id,       start_date,      client_name, 
			client_phone, item_desc,       job_desc,
			job_status,   repairer,        repair_cost,
			total_cost,   contact_history, payment_info, 
			notes	
		)
		values ( ${ job } )`,
	
	insertInventory: item => `insert into inventory (
			stock_brand, stock_model,
			stock_type,  stock_style, 
			body_type,   price, 
			colour,      new_or_used, 
			quantity,    sold 
		)
		values ( ${ '?, '.repeat( item.length ).slice( 0, -2 ) } )`

}