CREATE TABLE property_details (
  property_id INT PRIMARY KEY,
  description TEXT,
  nearest_beach_distance DECIMAL(10, 2) DEFAULT NULL,
  nearest_railway_station_distance DECIMAL(10, 2) DEFAULT NULL,
  nearest_airport_distance DECIMAL(10, 2) DEFAULT NULL,
  nearest_bus_stand_distance DECIMAL(10, 2) DEFAULT NULL,
  can_book_married_couples BOOLEAN DEFAULT FALSE,
  can_book_families BOOLEAN DEFAULT FALSE,
  can_book_solo_travelers BOOLEAN DEFAULT FALSE,
  can_book_friends BOOLEAN DEFAULT FALSE,
  instant_booking BOOLEAN DEFAULT FALSE,
  manual_approval BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE
);
 

-- CREATE TABLE room_pricing_availability (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   property_id INT NOT NULL,
--   floor INT NOT NULL,
--   room_type VARCHAR(255) NOT NULL,
--   number_of_rooms INT NOT NULL,
--   total_capacity INT NOT NULL,
--   base_price DECIMAL(10, 2) NOT NULL,
--   occupancy_price_adjustments JSON DEFAULT NULL,
--   instant_payment_enabled BOOLEAN DEFAULT FALSE,
--   free_cancellation_enabled BOOLEAN DEFAULT FALSE,
--   refundable1 BOOLEAN DEFAULT FALSE,
--   days_before1 INT DEFAULT NULL,
--   refund_percent1 DECIMAL(5, 2) DEFAULT NULL,
--   refundable2 BOOLEAN DEFAULT FALSE,
--   days_before2 INT DEFAULT NULL,
--   refund_percent2 DECIMAL(5, 2) DEFAULT NULL,
--   refundable3 BOOLEAN DEFAULT FALSE,
--   days_before3 INT DEFAULT NULL,
--   refund_percent3 DECIMAL(5, 2) DEFAULT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE
-- );
 

-- CREATE TABLE facilities_amenities (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   property_id INT NOT NULL,
--   gym BOOLEAN DEFAULT FALSE,
--   swimming_pool BOOLEAN DEFAULT FALSE,
--   spa BOOLEAN DEFAULT FALSE,
--   restaurant BOOLEAN DEFAULT FALSE,
--   room_service_24hr BOOLEAN DEFAULT FALSE,
--   lounge BOOLEAN DEFAULT FALSE,
--   steam_sauna BOOLEAN DEFAULT FALSE,
--   bar BOOLEAN DEFAULT FALSE,
--   free_parking BOOLEAN DEFAULT FALSE,
--   free_wifi BOOLEAN DEFAULT FALSE,
--   refrigerator BOOLEAN DEFAULT FALSE,
--   laundry_service BOOLEAN DEFAULT FALSE,
--   housekeeping BOOLEAN DEFAULT FALSE,
--   air_conditioning BOOLEAN DEFAULT FALSE,
--   power_backup BOOLEAN DEFAULT FALSE,
--  ev_charging BOOLEAN DEFAULT FALSE,
--   smoke_detector BOOLEAN DEFAULT FALSE,
--   umbrellas BOOLEAN DEFAULT FALSE,
--  elevator BOOLEAN DEFAULT FALSE,
--   paid_lan BOOLEAN DEFAULT FALSE,
--   dining_area BOOLEAN DEFAULT FALSE,
--   cafe_24hr BOOLEAN DEFAULT FALSE,
--   barbeque BOOLEAN DEFAULT FALSE,
--   bakery BOOLEAN DEFAULT FALSE,
--   coffee_shop_24hr BOOLEAN DEFAULT FALSE,
--   fire_extinguishers BOOLEAN DEFAULT FALSE,
--   cctv BOOLEAN DEFAULT FALSE,
--   security_alarms BOOLEAN DEFAULT FALSE,
--   reflexology BOOLEAN DEFAULT FALSE,
--  first_aid BOOLEAN DEFAULT FALSE,
--   tv BOOLEAN DEFAULT FALSE,
--   luggage_storage BOOLEAN DEFAULT FALSE,
--   wake_up_call BOOLEAN DEFAULT FALSE,
--   concierge BOOLEAN DEFAULT FALSE,
--   doctor_on_call BOOLEAN DEFAULT FALSE,
--   wheelchair BOOLEAN DEFAULT FALSE,
--   luggage_assistance BOOLEAN DEFAULT FALSE,
--   bellboy_service BOOLEAN DEFAULT FALSE,
--   pool_beach_towels BOOLEAN DEFAULT FALSE,
--   multilingual_staff BOOLEAN DEFAULT FALSE,
-- accessible_facilities BOOLEAN DEFAULT FALSE,
--   massage BOOLEAN DEFAULT FALSE,
--   printer BOOLEAN DEFAULT FALSE,
--   photocopying BOOLEAN DEFAULT FALSE,
--   conference_room BOOLEAN DEFAULT FALSE,
--   banquet BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE
-- );





CREATE TABLE property_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  user_id INT NOT NULL,
  check_in_time TIME NOT NULL,
  check_out_time TIME NOT NULL,
  min_guest_age INT NOT NULL,
  proof_type VARCHAR(255) DEFAULT NULL,
  unmarried_couples_allowed BOOLEAN DEFAULT FALSE,
  male_only_groups_allowed BOOLEAN DEFAULT FALSE,
  scanty_baggage_allowed BOOLEAN DEFAULT FALSE,
  smoking_allowed BOOLEAN DEFAULT FALSE,
  alcohol_allowed BOOLEAN DEFAULT FALSE,
  non_veg_allowed BOOLEAN DEFAULT FALSE,
  outside_food_allowed BOOLEAN DEFAULT FALSE,
  food_delivery_service BOOLEAN DEFAULT FALSE,
  wheelchair_accessible BOOLEAN DEFAULT FALSE,
  wheelchair_provided BOOLEAN DEFAULT FALSE,
  pets_allowed BOOLEAN DEFAULT FALSE,
  pets_on_property BOOLEAN DEFAULT FALSE,
  mattress_cost_child DECIMAL(10, 2) DEFAULT NULL,
  mattress_cost_adult DECIMAL(10, 2) DEFAULT NULL,
  cot_cost DECIMAL(10, 2) DEFAULT NULL,
  rule_description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);




CREATE TABLE room_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  property_id INT NOT NULL,
  image_paths JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES room_setup(room_id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE
);



CREATE TABLE room_setup (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  floor INT NOT NULL,
  room_type VARCHAR(255) NOT NULL,
  number_of_rooms INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE
);


CREATE TABLE location_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  state_province VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE,
  UNIQUE (address_line1, city, state_province, country, postal_code, address_line2, latitude, longitude)
);


CREATE TABLE basic_info (
  property_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_name VARCHAR(255) NOT NULL,
  property_type ENUM('Hotel', 'Apartment', 'Hut House', 'Resort', 'Beach House', 'Villa') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
 


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  mobile VARCHAR(15),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other') DEFAULT 'other',
  marital_status ENUM('single', 'married', 'divorced', 'widowed') DEFAULT 'single',
  address TEXT,
  pincode VARCHAR(10),
  state VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);







===============================



CREATE TABLE facilities_amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  gym BOOLEAN DEFAULT FALSE,
  swimming_pool BOOLEAN DEFAULT FALSE,
  spa BOOLEAN DEFAULT FALSE,
  restaurant BOOLEAN DEFAULT FALSE,
  room_service_24hr BOOLEAN DEFAULT FALSE,
  lounge BOOLEAN DEFAULT FALSE,
  steam_sauna BOOLEAN DEFAULT FALSE,
  bar BOOLEAN DEFAULT FALSE,
  free_parking BOOLEAN DEFAULT FALSE,
  free_wifi BOOLEAN DEFAULT FALSE,
  refrigerator BOOLEAN DEFAULT FALSE,
  laundry_service BOOLEAN DEFAULT FALSE,
  housekeeping BOOLEAN DEFAULT FALSE,
  air_conditioning BOOLEAN DEFAULT FALSE,
  power_backup BOOLEAN DEFAULT FALSE,
 ev_charging BOOLEAN DEFAULT FALSE,
  smoke_detector BOOLEAN DEFAULT FALSE,
  umbrellas BOOLEAN DEFAULT FALSE,
 elevator BOOLEAN DEFAULT FALSE,
  paid_lan BOOLEAN DEFAULT FALSE,
  dining_area BOOLEAN DEFAULT FALSE,
  cafe_24hr BOOLEAN DEFAULT FALSE,
  barbeque BOOLEAN DEFAULT FALSE,
  bakery BOOLEAN DEFAULT FALSE,
  coffee_shop_24hr BOOLEAN DEFAULT FALSE,
  fire_extinguishers BOOLEAN DEFAULT FALSE,
  cctv BOOLEAN DEFAULT FALSE,
  security_alarms BOOLEAN DEFAULT FALSE,
  reflexology BOOLEAN DEFAULT FALSE,
 first_aid BOOLEAN DEFAULT FALSE,
  tv BOOLEAN DEFAULT FALSE,
  luggage_storage BOOLEAN DEFAULT FALSE,
  wake_up_call BOOLEAN DEFAULT FALSE,
  concierge BOOLEAN DEFAULT FALSE,
  doctor_on_call BOOLEAN DEFAULT FALSE,
  wheelchair BOOLEAN DEFAULT FALSE,
  luggage_assistance BOOLEAN DEFAULT FALSE,
  bellboy_service BOOLEAN DEFAULT FALSE,
  pool_beach_towels BOOLEAN DEFAULT FALSE,
  multilingual_staff BOOLEAN DEFAULT FALSE,
accessible_facilities BOOLEAN DEFAULT FALSE,
  massage BOOLEAN DEFAULT FALSE,
  printer BOOLEAN DEFAULT FALSE,
  photocopying BOOLEAN DEFAULT FALSE,
  conference_room BOOLEAN DEFAULT FALSE,
  banquet BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE
);




CREATE TABLE room_pricing_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  floor INT NOT NULL,
  room_type VARCHAR(255) NOT NULL,
  number_of_rooms INT NOT NULL,
 room_capacity_adults INT NOT NULL,
    room_capacity_children INT NOT NULL,
  total_capacity INT NOT NULL,
  individual_room_capacities longtext ,
  base_price DECIMAL(10, 2) NOT NULL,
  occupancy_price_adjustments JSON DEFAULT NULL,
  child_pricing JSON DEFAULT NULL,
  instant_payment_enabled BOOLEAN DEFAULT FALSE,
  free_cancellation_enabled BOOLEAN DEFAULT FALSE,
  refundable1 BOOLEAN DEFAULT FALSE,
  days_before1 INT DEFAULT NULL,
  refund_percent1 DECIMAL(5, 2) DEFAULT NULL,
  refundable2 BOOLEAN DEFAULT FALSE,
  days_before2 INT DEFAULT NULL,
  refund_percent2 DECIMAL(5, 2) DEFAULT NULL,
  refundable3 BOOLEAN DEFAULT FALSE,
  days_before3 INT DEFAULT NULL,
  refund_percent3 DECIMAL(5, 2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES basic_info(property_id) ON DELETE CASCADE
  
);





