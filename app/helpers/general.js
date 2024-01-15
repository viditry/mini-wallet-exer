const bcrypt = require('bcryptjs');

async function hashing(input) {
    const result = await new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(input, salt, (error, hash) => {
                if (error) reject(error);

                resolve(hash);
            });
        });
    });

    return result;
}

module.exports = {
    hashing
}