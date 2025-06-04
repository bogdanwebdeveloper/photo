-- Add sample photos to the database
-- Make sure to replace these with your actual photo filenames and details

INSERT INTO photos (filename, title, alt_text, category, width, height, is_featured, status, sort_order) VALUES
-- Nature photos
('nature-1.jpg', 'Peisaj de munte', 'Peisaj frumos de munte în Botoșani', 'Nature', 1920, 1080, 1, 'active', 1),
('nature-2.jpg', 'Apus de soare', 'Apus de soare spectaculos', 'Nature', 1920, 1080, 0, 'active', 2),

-- Portrait photos  
('portrait-1.jpg', 'Portret profesional', 'Portret profesional în studio', 'Portraits', 1080, 1350, 1, 'active', 1),
('portrait-2.jpg', 'Portret exterior', 'Ședință foto în natură', 'Portraits', 1080, 1350, 0, 'active', 2),

-- Street photos
('street-1.jpg', 'Viața urbană', 'Fotografie de stradă în Botoșani', 'Street', 1920, 1080, 0, 'active', 1),

-- Architecture photos
('architecture-1.jpg', 'Arhitectură locală', 'Clădire istorică din Botoșani', 'Architecture', 1920, 1080, 0, 'active', 1),

-- Travel photos
('travel-1.jpg', 'Călătorie', 'Fotografie de călătorie', 'Travel', 1920, 1080, 0, 'active', 1),

-- Event photos
('event-1.jpg', 'Eveniment special', 'Fotografie de eveniment', 'Events', 1920, 1080, 0, 'active', 1);

-- Add some photo tags
INSERT INTO photo_tags (name, slug) VALUES
('peisaj', 'peisaj'),
('portret', 'portret'),
('natura', 'natura'),
('urban', 'urban'),
('arhitectura', 'arhitectura'),
('eveniment', 'eveniment');

-- Link photos to tags (example)
INSERT INTO photo_tag_relations (photo_id, tag_id) VALUES
(1, 1), -- nature-1.jpg -> peisaj
(1, 3), -- nature-1.jpg -> natura
(3, 2), -- portrait-1.jpg -> portret
(5, 4), -- street-1.jpg -> urban
(6, 5), -- architecture-1.jpg -> arhitectura
(8, 6); -- event-1.jpg -> eveniment
