const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require("express-validator");

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// GET api/profile/me
// @desc Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user"})
        }

        res.json(profile)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST api/profile
// @desc Create or update user profile
// @access Private
router.post('/', [ auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        company, website, location, bio,status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin
    } = req.body;

    //Build Profile object

    const profileFields = {};
    profileFields.user = req.body.id;

    if (company) {
        profileFields.company = company;
    };
    if (website) {
        profileFields.website = website;
    };
    if (location) {
        profileFields.location = location;
    };
    if (bio) {
        profileFields.bio = bio;
    };
    if (status) {
        profileFields.status = status;
    };
    if (githubusername) {
        profileFields.githubusername = githubusername;
    };
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //build social fields 
    profileFields.social = {}
    if (youtube) {
        profileFields.social.youtube = youtube;
    };
    if (twitter) {
        profileFields.social.twitter = twitter;
    };
    if (facebook) {
        profileFields.social.facebook = facebook;
    };
    if (linkedin) {
        profileFields.social.linkedin = linkedin;
    };
    if (instagram) {
        profileFields.social.instagram = instagram;
    };


    try {
        let profile = await Profile.findOne({ user: req.user.id})

        if (profile) {
            // Update profile
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
            return res.json(profile)
        }

        else {
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        }
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

    console.log(profileFields.skills);
})

// GET api/profile
// @desc Get all users profile
// @access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

// GET api/profile/user/:user_id
// @desc Get all users profile by user id
// @access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "Profile Not Found!!"})
        };
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: "Profile Not Found!!"})
        }
        res.status(500).send('Server Error')
    }
})

// DELETE api/profile
// @desc Delete users profile, user, posts
// @access Private

router.delete('/', auth, async (req, res) => {
    try {
        // todo- remove users posts
        // remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "User deleted" });
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

// PUT api/profile/experience
// @desc Add profile experience
// @access Private

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty()
]
], 
async (req, res) => {
    const errors = validationResult(req);
   
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title, 
        company, 
        location, 
        from, 
        to, 
        current, 
        description
    } = req.body;

    const newExp = {
        title, 
        company, 
        location, 
        from, 
        to, 
        current, 
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {return res.status(400).send('No profile found.');}

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;