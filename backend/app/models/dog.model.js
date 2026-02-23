const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên bé chó (VD: LuLu)
    
    // LIÊN KẾT 1: Chó của trại nào?
    farmId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Farm",
        required: true 
    },

    // LIÊN KẾT 2: Chó thuộc giống gì?
    breedId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Breed",
        required: true 
    },

    gender: { type: String, enum: ["Đực", "Cái"] },
    price: { type: Number, required: true }, 
    description: String, 

    // Trạng thái (Quan trọng nhất cho luồng Admin duyệt)
    status: { 
        type: String, 
        enum: ["pending", "selling", "reserved", "sold", "stopped"], 
        default: "pending" // Mặc định vừa đăng lên là chờ duyệt
    }
}, { timestamps: true });

dogSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = mongoose.model("Dog", dogSchema);