const db = require("../../../config/db");

class UploadImagesModel {
    static async saveImages(roomId, imagePaths) {
        try {
            // First, get the property_id from room_setup
            const [room] = await db.query(
                'SELECT property_id FROM room_setup WHERE room_id = ?',
                [roomId]
            );

            if (!room || room.length === 0) {
                throw new Error('Room not found');
            }

            const property_id = room[0].property_id;

            // Check if there's already an entry for this room
            const checkQuery = `
                SELECT id, image_paths 
                FROM room_images 
                WHERE room_id = ?
            `;
            const [existing] = await db.query(checkQuery, [roomId]);

            if (existing && existing.length > 0) {
                // Update existing record
                const existingPaths = JSON.parse(existing[0].image_paths || '[]');
                const updatedPaths = [...existingPaths, ...imagePaths];
                
                const updateQuery = `
                    UPDATE room_images 
                    SET image_paths = ? 
                    WHERE room_id = ?
                `;
                await db.query(updateQuery, [JSON.stringify(updatedPaths), roomId]);
                return { id: existing[0].id, updated: true };
            } else {
                // Create new record
                const insertQuery = `
                    INSERT INTO room_images (room_id, property_id, image_paths)
                    VALUES (?, ?, ?)
                `;
                const [result] = await db.query(insertQuery, [roomId, property_id, JSON.stringify(imagePaths)]);
                return { id: result.insertId, updated: false };
            }
        } catch (error) {
            throw error;
        }
    }

    static async getAllImages() {
        try {
            const query = `
                SELECT id, room_id, image_paths, created_at 
                FROM room_images
                ORDER BY created_at DESC
            `;
            
            const [images] = await db.query(query);
            // Parse the JSON strings back to arrays
            return images.map(img => ({
                ...img,
                image_paths: JSON.parse(img.image_paths || '[]')
            }));
        } catch (error) {
            throw error;
        }
    }

    static async getImagesByRoomId(property_id) {
        try {
            const query = `
                SELECT id, room_id, image_paths, created_at 
                FROM room_images 
                WHERE property_id = ?
                ORDER BY created_at DESC
            `;
            
            const [images] = await db.query(query, [property_id]);
            // Parse the JSON strings back to arrays
            return images.map(img => ({
                ...img,
                image_paths: JSON.parse(img.image_paths || '[]')
            }));
        } catch (error) {
            throw error;
        }
    }

    static async getImageById(imageId) {
        try {
            const query = `
                SELECT id, room_id, image_paths, created_at 
                FROM room_images 
                WHERE id = ?
            `;
            
            const [image] = await db.query(query, [imageId]);
            if (image && image.length > 0) {
                return {
                    ...image[0],
                    image_paths: JSON.parse(image[0].image_paths || '[]')
                };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async deleteImage(imageId) {
        try {
            const query = `
                DELETE FROM room_images 
                WHERE id = ?
            `;
            
            const [result] = await db.query(query, [imageId]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UploadImagesModel; 