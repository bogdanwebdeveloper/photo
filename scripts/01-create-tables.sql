-- Create database tables for photo portfolio
-- Run this script first to set up the database structure

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    alt_text VARCHAR(500),
    category ENUM('Nature', 'Portraits', 'Street', 'Architecture', 'Travel', 'Events') NOT NULL DEFAULT 'Nature',
    width INT NOT NULL,
    height INT NOT NULL,
    file_size INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_sort_order (sort_order)
);

-- Albums table
CREATE TABLE IF NOT EXISTS albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_photo_id INT,
    sort_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_sort_order (sort_order)
);

-- Album photos junction table
CREATE TABLE IF NOT EXISTS album_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    album_id INT NOT NULL,
    photo_id INT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_album_photo (album_id, photo_id),
    INDEX idx_album_id (album_id),
    INDEX idx_photo_id (photo_id),
    INDEX idx_sort_order (sort_order)
);

-- Photo tags table
CREATE TABLE IF NOT EXISTS photo_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
);

-- Photo tags junction table
CREATE TABLE IF NOT EXISTS photo_tag_relations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    photo_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES photo_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_photo_tag (photo_id, tag_id),
    INDEX idx_photo_id (photo_id),
    INDEX idx_tag_id (tag_id)
);

-- Photo views/analytics table
CREATE TABLE IF NOT EXISTS photo_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    photo_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    INDEX idx_photo_id (photo_id),
    INDEX idx_viewed_at (viewed_at)
);
