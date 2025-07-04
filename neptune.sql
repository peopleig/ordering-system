    CREATE DATABASE IF NOT EXISTS food_sys;
    USE food_sys;

    CREATE TABLE User (
        user_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email_id VARCHAR(255),
        mobile_number VARCHAR(10),
        password VARCHAR(255),
        role ENUM('admin', 'chef', 'customer'),
        reward_points INT DEFAULT 0,
        last_visited DATE DEFAULT '2000-01-01',
        approved BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE Categories (
        category_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        category_name VARCHAR(255)
    );

    CREATE TABLE Items (
        item_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        item_name VARCHAR(255),
        category_id BIGINT,
        price FLOAT,
        description TEXT,
        item_image_url VARCHAR(255),
        is_veg BOOLEAN,
        spice_level TINYINT,
        FOREIGN KEY (category_id) REFERENCES Categories(category_id)
    );

    CREATE TABLE Orders (
        order_id BIGINT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        user_id BIGINT,
        instructions TEXT,
        order_type ENUM('dine_in', 'takeaway'),
        table_number INT DEFAULT 0,
        status ENUM('preparing', 'payment_pending', 'completed'),
        total_cost FLOAT,
        FOREIGN KEY (user_id) REFERENCES User(user_id)
    );

    CREATE TABLE Ordered_Items (
        order_id BIGINT,
        item_id BIGINT,
        quantity INT,
        dish_complete BOOLEAN DEFAULT FALSE,
        chef_id BIGINT DEFAULT 1,
        PRIMARY KEY (order_id, item_id),
        FOREIGN KEY (order_id) REFERENCES Orders (order_id),
        FOREIGN KEY (item_id) REFERENCES Items(item_id),
        FOREIGN KEY (chef_id) REFERENCES User(user_id)
    );

    CREATE TABLE Payment (
        transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        order_id BIGINT,
        tip_amount FLOAT DEFAULT 0,
        discount_reward_points BIGINT,
        amount_paid FLOAT,
        payment_status ENUM('pending', 'paid', 'failed'),
        FOREIGN KEY (order_id) REFERENCES Orders (order_id)
    );

    CREATE TABLE Reviews (
        review_id BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        order_id BIGINT,
        comments LONGTEXT,
        ambience_stars TINYINT DEFAULT 0,
        food_quality_stars TINYINT DEFAULT 0,
        service_stars TINYINT DEFAULT 0,
        value_for_money_stars TINYINT DEFAULT 0,
        star_rating FLOAT,
        FOREIGN KEY (order_id) REFERENCES Orders(order_id)
    );

    USE food_sys;
    INSERT INTO User (user_id, first_name, last_name, email_id, mobile_number, password, role)
    VALUES 
        (1, 'admin', 'admin', 'admin.neptune@restaurant.com', '0000000000', '$2b$10$/0isRmivZP4cBIVzKoFc.uKmJhrkI3gq17I/aVyEGIywdqlXCtGe2', 'admin'),
        (2, 'John', 'Doe', 'johndoe@restaurant.com','0000000001', '$2b$10$m5QJ1LOwspDjB/WxvFiZaeAdHqpmWP39h7LSoiiJtpcGIVD5PUUbe', 'chef'),
        (3, 'Jane', 'Doe', 'janedoe@restaurant.com','0000000002', '$2b$10$vAIjSzUD8p0i16JUD8GncOBBh8WHfuQ2bzzcXEmvZQMkv6BLXTuwy', 'chef');

    INSERT INTO Categories (category_id, category_name)
    VALUES 
        (1, 'North Indian'),
        (2, 'South Indian'),
        (3, 'Italian'),
        (4, 'Mexican'),
        (5, 'Desserts'),
        (6, 'Beverages');
    
    INSERT INTO Items (item_id, item_name, category_id, price, description, item_image_url, is_veg, spice_level)
    VALUES
        (1, 'Paneer Tikka', 1, 180.00, 'Grilled paneer cubes with rich Indian spices', '/images/paneer_tikkaa.webp', TRUE, 3),  
        (2, 'Chicken Biryani', 1, 300.00, 'Classic Hyderabadi biryani', '/images/chicken_biryani.webp', FALSE, 2),
        (3, 'Malai Kofta', 1, 250.00, 'Soft paneer koftas in a rich, creamy spiced gravy', '/images/malai_kofta.webp', TRUE, 2),
        (4, 'Garlic Naan', 1, 100.00, 'Indian flatbread topped with fresh garlic and baked in a tandoor (4 pcs)', '/images/garlic_naan.webp', TRUE, 2),
        (5, 'Plain Dosa', 2, 150.00, 'Crispy South Indian crepe made from fermented rice and lentil batter', '/images/plain_dosa.webp', TRUE, 2),
        (6, 'Masala Uttapam', 2, 200.00,'Thick savory pancake topped with spiced onions, tomatoes, and chilies', '/images/masala_uttapam.webp', TRUE, 3),
        (7, 'Idli', 2, 110.00, 'Steamed rice cakes, light and fluffy, served with chutneys and sambar', '/images/idlie.webp', TRUE, 1),
        (8, 'Spaghetti Aglio Olio', 3, 300.00, 'Classic Italian pasta tossed with garlic, olive oil, and chili flakes', '/images/spaghetti_aglio_olio.webp', TRUE, 3),
        (9, 'Chicken Cacciatore', 3, 300.00, 'Rustic Italian stew of chicken braised with tomatoes, herbs, and bell peppers', '/images/chicken_cacciatore.webp', FALSE, 3),
        (10, 'Pizza Margherita', 3, 280.00, 'Typical Neapolitan pizza topped with tomato, mozzarella, and fresh basil', '/images/pizza_margherita.webp', TRUE, 2),
        (11, 'Tacos al Pastor', 4, 350.00,'Corn tortillas filled with marinated pork, pineapple, and fresh toppings','/images/tacos_al_pastor.webp', FALSE, 3),
        (12, 'Chiles Rellenos', 4, 300.00,'Roasted poblano peppers stuffed with cheese or meat, battered and fried','/images/chiles_rellenos.webp', TRUE, 2),
        (13, 'Nopales Salad', 4, 250.00,'Refreshing cactus salad with onions, tomatoes, and Mexican spices','/images/nopales_salad.webp', TRUE, 2),
        (14, 'Gulab Jamun', 5, 120.00, 'Soft milk dumplings soaked in fragrant rose-cardamom syrup', '/images/gulab_jamun.webp', TRUE, -5),
        (15, 'Churros', 5, 200.00, 'Golden fried dough sticks dusted with cinnamon sugar, served with chocolate', '/images/churros.webp', TRUE, -4),
        (16, 'New York Cheescake', 5, 250.00, 'Rich and creamy baked cheesecake with a classic graham cracker crust', '/images/cheesecake.webp', TRUE, -3),
        (17, 'Tiramisu', 5, 240.00, 'Layered Italian dessert with espresso-soaked ladyfingers and mascarpone cream', '/images/tiramisu.webp', TRUE, -2),
        (18, 'Chai', 6, 40.00, 'Spiced Indian tea brewed with milk, cardamom, ginger, and cloves', '/images/chai.webp', TRUE, -1),
        (19, 'Mocha Latte', 6, 120.00, 'Espresso blended with steamed milk and rich chocolate syrup', '/images/mocha_latte.webp', TRUE, -3),
        (20, 'Mint Mojito', 6, 100.00, 'Refreshing blend of mint, lime, and soda with a splash of sweetness', '/images/mint_mojito.webp', TRUE, -2),
        (21, 'Soft Drinks (Canned)', 6, 80.00, 'On Availability', '/images/soft_drinks.webp', TRUE, -4);   




