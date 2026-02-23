const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên giống (Poodle, Husky...)
    description: String,                    // Mô tả đặc điểm
    origin: String,                         // Nguồn gốc (Pháp, VN...)
    images: [String],                       // Hình ảnh đại diện giống
    
    // Trạng thái giống chó
    status: { 
        type: String, 
        enum: ["active", "paused", "stopped"], 
        default: "active" 
    }
}, { timestamps: true });

breedSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model("Breed", breedSchema);