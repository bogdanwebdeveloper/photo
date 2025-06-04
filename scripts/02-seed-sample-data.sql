-- Insert sample data for testing
-- Run this after creating the tables

-- Insert sample photos
INSERT INTO photos (filename, title, alt_text, category, width, height, file_size, is_featured) VALUES
('natura1.jpg', 'Peisaj de munte', 'Peisaj spectaculos de munte la apus', 'Nature', 1920, 1080, 2048000, TRUE),
('natura2.jpg', 'Pădure de toamnă', 'Pădure colorată în culorile toamnei', 'Nature', 1600, 1200, 1536000, FALSE),
('portret1.jpg', 'Portret studio', 'Portret profesional în studio', 'Portraits', 1200, 1600, 1024000, TRUE),
('portret2.jpg', 'Portret natural', 'Portret în lumină naturală', 'Portraits', 1080, 1350, 896000, FALSE),
('strada1.jpg', 'Viața urbană', 'Scenă de stradă din centrul orașului', 'Street', 1920, 1280, 1792000, FALSE),
('arhitectura1.jpg', 'Clădire modernă', 'Arhitectură contemporană', 'Architecture', 1600, 2400, 2304000, FALSE),
('eveniment1.jpg', 'Nuntă în grădină', 'Ceremonie de nuntă în aer liber', 'Events', 2048, 1365, 2560000, TRUE);

-- Insert sample albums
INSERT INTO albums (slug, title, description, sort_order, is_featured) VALUES
('nunta-maria-si-ion', 'Nunta Maria și Ion', 'O zi magică plină de emoție și bucurie', 1, TRUE),
('portrete-studio-2024', 'Portrete Studio 2024', 'Colecție de portrete realizate în studio', 2, FALSE),
('peisaje-romania', 'Peisaje din România', 'Frumusețea naturii românești', 3, TRUE);

-- Link photos to albums
INSERT INTO album_photos (album_id, photo_id, sort_order) VALUES
(1, 7, 1), -- eveniment1.jpg in nunta album
(2, 3, 1), -- portret1.jpg in portrete studio
(2, 4, 2), -- portret2.jpg in portrete studio
(3, 1, 1), -- natura1.jpg in peisaje
(3, 2, 2); -- natura2.jpg in peisaje

-- Insert sample tags
INSERT INTO photo_tags (name, slug, description) VALUES
('Botoșani', 'botosani', 'Fotografii realizate în Botoșani'),
('Studio', 'studio', 'Fotografii realizate în studio'),
('Exterior', 'exterior', 'Fotografii realizate în exterior'),
('Nuntă', 'nunta', 'Fotografii de nuntă'),
('Familie', 'familie', 'Fotografii de familie'),
('Natură', 'natura', 'Fotografii de natură');

-- Link photos to tags
INSERT INTO photo_tag_relations (photo_id, tag_id) VALUES
(1, 3), (1, 6), -- natura1: exterior, natura
(2, 3), (2, 6), -- natura2: exterior, natura
(3, 2), -- portret1: studio
(4, 3), -- portret2: exterior
(5, 1), (5, 3), -- strada1: botosani, exterior
(6, 1), (6, 3), -- arhitectura1: botosani, exterior
(7, 4), (7, 3); -- eveniment1: nunta, exterior

-- Update album cover photos
UPDATE albums SET cover_photo_id = 7 WHERE slug = 'nunta-maria-si-ion';
UPDATE albums SET cover_photo_id = 3 WHERE slug = 'portrete-studio-2024';
UPDATE albums SET cover_photo_id = 1 WHERE slug = 'peisaje-romania';
