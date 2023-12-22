import express from 'express';
import User from './userModel';

const router = express.Router();

const passwordLayout = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const validatePassword = (password) => {
    return passwordLayout.test(password);
};

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ code: 500, msg: 'Server Error' });
    }
});

// register(Create)/Authenticate User
router.post('/', async (req, res) => {
    try {
        if (req.query.action === 'register') {
            const { password } = req.body;

        if (!validatePassword(password)) {
            return res.status(400).json({
                code: 400,
                msg: 'Password does not meet the criteria.',
            });
        }

            if (!req.body.password) {
                return res.status(400).json({ 
                    code: 400, 
                    msg: 'Password is required' });
            }
            await User(req.body).save();
            res.status(201).json({
                code: 201,
                msg: 'Successfully created a new user.',
            });
        } else {
            const user = await User.findOne(req.body);
            if (!user) {
                return res.status(401).json({ code: 401, msg: 'Authentication failed' });
            } else {
                return res.status(200).json({ code: 200, msg: 'Authentication Successful', token: 'TEMPORARY_TOKEN' });
            }
        }
    } catch (err) {
        res.status(500).json({ code: 500, msg: 'Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (req.body._id) delete req.body._id;
        const result = await User.updateOne({
            _id: req.params.id,
        }, req.body);
        if (result.matchedCount) {
            res.status(200).json({ code: 200, msg: 'User Updated Successfully' });
        } else {
            res.status(404).json({ code: 404, msg: 'Unable to Update User' });
        }
    } catch (err) {
        res.status(500).json({ code: 500, msg: 'Server Error' });
    }
});

export default router;
