const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // optionnel pour OAuth
    phone: { type: String, required: false },
    photoUrl: { type: String, required: false },
    role: { type: String, enum: ['buyer', 'owner', 'admin'], default: 'buyer' },
    isEmailVerified: { type: Boolean, default: false }
}, {
    timestamps: true
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

});

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
