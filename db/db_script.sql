Create database ar_db;
Use ar_db;

CREATE TABLE admins (
    id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY (id),
    admin_name VARCHAR(255) NOT NULL , 
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    role TINYINT NOT NULL, 
    is_active BOOLEAN DEFAULT 1
);

CREATE TABLE instructors (
    id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY (id),
    name VARCHAR(255) NOT NULL , 
    last_name VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    started_date datetime NOT NULL DEFAULT NOW(), 
    start_time_off datetime NULL, 
    end_time_off datetime NULL, 
    is_active BOOLEAN DEFAULT 1
);
CREATE TABLE memberships (
	id INT AUTO_INCREMENT NOT NULL, primary key(id),
    description  VARCHAR(100) NOT NULL , 
    frequencies_per_week int NOT NULL,
    price decimal NOT NULL
);
CREATE TABLE students(
    id INT AUTO_INCREMENT NOT NULL, primary key(id),
    name VARCHAR(100) NOT NULL , 
    last_name VARCHAR(100) NULL,
    started_date datetime NOT NULL DEFAULT NOW(), 
    membership_type int NOT NULL, foreign key (membership_type) references memberships (id),
    membership_end_date datetime NULL
);

CREATE TABLE schedule(
	id INT AUTO_INCREMENT NOT NULL, primary key(id),
    name VARCHAR(100) NOT NULL , 
    start_time datetime NOT NULL, 
	end_time datetime NOT NULL, 
    instructor_id int NOT NULL, foreign key (instructor_id) references instructors (id),
    status int NULL
);