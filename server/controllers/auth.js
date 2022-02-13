const {connect} = require ('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
    try {
        const {fullName, username, password, phoneNumber } = req.body;
        const userId = crypto.randomBytes(16).toString('hex');
        const serverClient = connect(api_key, api_secret, app_id);
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = serverClient.createUserToken(userId);
        res.status(200).json({token, fullName, username, userId, hashedPassword, phoneNumber});
    } catch (error) {
        console.log(error);

        res.status(500).json({message: error});
    }
};

const login = async (req, res) => {
    try {
        if(req.body.DemoUser) {
            const serverClient = connect(api_key, api_secret, app_id);
            const client = StreamChat.getInstance(api_key, api_secret);

            const {users} = await client.queryUsers({demo_user: true});
            const AvailableDemos = users.filter((user)=> new Date(user.last_login) < new Date(Date.now() - 30000));
            if(!AvailableDemos.length) return res.status(401).json({message: "No Available Demos"});
            await client.partialUpdateUser({
                id: AvailableDemos[0].id,
                set: {
                    fullName: AvailableDemos[0].fullName,
                    phoneNumber: AvailableDemos[0].phoneNumber,
                    hashedPassword: AvailableDemos[0].hashedPassword,
                    name: AvailableDemos[0].name,
                    image: AvailableDemos[0].image,
                    last_login: new Date(Date.now()),
                    demo_user: true
                }
            });
            const token = serverClient.createUserToken(AvailableDemos[0].id);
            res.status(200).json({token, fullName: AvailableDemos[0].fullName, username: AvailableDemos[0].name, hashedPassword: AvailableDemos[0].hashedPassword, phoneNumber: AvailableDemos[0].phoneNumber, avatarURL: AvailableDemos[0].image, userId: AvailableDemos[0].id});
        } else {
            const { username, password} = req.body;
            const serverClient = connect(api_key, api_secret, app_id);
            const client = StreamChat.getInstance(api_key, api_secret);
    
            const {users} = await client.queryUsers({name: username});
    
            if(!users.length) return res.status(400).json({message: "User Not Found"});
    
            const success = await bcrypt.compare(password, users[0].hashedPassword);
    
            const token = serverClient.createUserToken(users[0].id);
            await client.partialUpdateUser({
                id: users[0].id,
                set: {
                    fullName: users[0].fullName,
                    phoneNumber: users[0].phoneNumber,
                    hashedPassword: users[0].hashedPassword,
                    name: users[0].name,
                    image: users[0].image,
                    last_login: new Date(Date.now())
                }
            });
    
            if(success) {
                res.status(200).json({token, fullName: users[0].fullName, username, userId: users[0].id});
            } else {
                res.status(500).json({ message: 'Incorrect password'});
            }
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({message: error});
    }
}

module.exports = { signup, login}