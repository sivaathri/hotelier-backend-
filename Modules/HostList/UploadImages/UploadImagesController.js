const UploadImagesModel = require("./UploadImagesModel");
const path = require("path");
const fs = require("fs");

class UploadImagesController {
    static async uploadImages(req, res) {
        try {
            const { roomId } = req.params;
            const files = req.files;
            
            if (!files || files.length === 0) {
                return res.status(400).json({ 
                    success: false,
                    message: "No files uploaded" 
                });
            }

            const imagePaths = files.map(file => `hostroomimages/${file.filename}`);
            
            // Save to database
            const result = await UploadImagesModel.saveImages(roomId, imagePaths);

            res.status(200).json({
                success: true,
                message: result.updated ? "Images added successfully" : "Images uploaded successfully",
                data: {
                    id: result.id,
                    imagePaths,
                    roomId
                }
            });
        } catch (error) {
            console.error("Error uploading images:", error);
            res.status(500).json({ 
                success: false,
                message: error.message || "Failed to upload images"
            });
        }
    }

    static async getAllImages(req, res) {
        try {
            const images = await UploadImagesModel.getAllImages();
            
            if (!images || images.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: "No images found" 
                });
            }

            res.status(200).json({
                success: true,
                data: images
            });
        } catch (error) {
            console.error("Error fetching images:", error);
            res.status(500).json({ 
                success: false,
                message: "Failed to fetch images" 
            });
        }
    }

    static async getImagesByRoomId(req, res) {
        try {
            const { property_id } = req.params;
            const images = await UploadImagesModel.getImagesByRoomId(property_id);
            
            if (!images || images.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: "No images found for this room" 
                });
            }

            res.status(200).json({
                success: true,
                data: images
            });
        } catch (error) {
            console.error("Error fetching room images:", error);
            res.status(500).json({ 
                success: false,
                message: "Failed to fetch room images" 
            });
        }
    }

    static async deleteImage(req, res) {
        try {
            const { imageId } = req.params;
            
            // Get image details before deletion
            const image = await UploadImagesModel.getImageById(imageId);
            
            if (!image) {
                return res.status(404).json({ 
                    success: false,
                    message: "Image not found" 
                });
            }

            // Delete all files from server
            image.image_paths.forEach(imagePath => {
                const filePath = path.join(__dirname, "../../../assets", imagePath);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });

            // Delete from database
            await UploadImagesModel.deleteImage(imageId);

            res.status(200).json({
                success: true,
                message: "Images deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting images:", error);
            res.status(500).json({ 
                success: false,
                message: "Failed to delete images" 
            });
        }
    }
}

module.exports = UploadImagesController; 