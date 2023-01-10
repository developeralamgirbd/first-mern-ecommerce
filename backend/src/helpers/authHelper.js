const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.makeHash = (password)=>{
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt)=>{
            if (err){
                reject(err.message)
            }
            bcrypt.hash(password, salt, (err, hash)=>{
                if (err){
                    reject(err.message)
                }
                resolve(hash)
            });
        })
    })
}

exports.createToken = (user)=>{

    const payload = {
        _id: user._id,
    }

   return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

}

exports.comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed);
};