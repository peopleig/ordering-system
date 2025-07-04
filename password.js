const bcrypt = require('bcrypt');
const rounds = parseInt(process.env.SALT_ROUNDS);
async function hash_pwd (entered_pwd) {
    try{
        const hashed_pwd = await bcrypt.hash(entered_pwd, rounds);
        return hashed_pwd;
    }
    catch(err) {
        console.log("Hashing Error:", err);
        throw err;
    }
}

module.exports = hash_pwd;
