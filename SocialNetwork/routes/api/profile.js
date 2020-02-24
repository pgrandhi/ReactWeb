const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');
// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateFollowerInput = require('../../validation/followers');
const validateLinkedAccountInput = require('../../validation/linkedAccount');


// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({user: req.user.id})
      .populate('user', ['name', 'username'])
      .then(profile => {
        if (!profile){
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
)

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'username'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   GET api/profile/username/:username
// @desc    Get profile by username
// @access  Public

router.get('/username/:username', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'username'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'username'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});


// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.profilePicUrl) profileFields.profilePicUrl = req.body.profilePicUrl;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.phone) profileFields.phone = req.body.phone;
    if (req.body.gender) profileFields.gender = req.body.gender;  
    
    Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ username: profileFields.username })
        .then(profile => {
          if (profile) {
            errors.handle = 'That username already exists';
            res.status(400).json(errors);
          }
         // Save Profile
         new Profile(profileFields)
         .save()
         .then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   POST api/profile/linkedAccounts
// @desc    Add experience to profile
// @access  Private
router.post(
  '/linkedAccounts',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateLinkedAccountInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newLinkedAccount = {
        account: req.body.account,
        email: req.body.email,
        password: req.body.password
      };

      // Add to exp array
      profile.linkedAccounts.unshift(newLinkedAccount);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   POST api/profile/followers/
// @desc    Add follower to profile
// @access  Private
router.post(
'/followers',
passport.authenticate('jwt', { session: false }),
(req, res) => {
    const { errors, isValid } = validateFollowerInput(req.body);

    // Check Validation
    if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (
        profile.followers.filter(follower => follower.user.toString() === req.user.id)
          .length > 0
      ) {
        return res
          .status(400)
          .json({ alreadyinFollowers: 'User already in followers' });
      }

      // Add user id to likes array
      post.likes.unshift({ user: req.user.id });
      const newFollower = {
            user: req.user.id,
            following: req.body.following
        };

        // Add to followers array
        profile.followers.unshift(newFollower);

        // Save
        profile.save().then(profile => res.json(post));
    })
    .catch(err => res.status(404).json({ followernotfound: 'No follower found' }));
}
);

// @route   POST api/profile/following
// @desc    Add following user to profile
// @access  Private  
router.post(
'/following',
passport.authenticate('jwt', { session: false }),
(req, res) => {
    const { errors, isValid } = validateFollowerInput(req.body);

    // Check Validation
    if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }) 
    .then(profile => {
        if (
          profile.following.filter(following => following.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyfollowing: 'User already in following' });
        }

        const newFollowing = {
          user: req.user.id,
          following: req.body.following
        };

        // Add to following array
        profile.following.unshift(newFollowing);

        // Save
        profile.save().then(profile => res.json(post));
    })
    .catch(err => res.status(404).json({ followingnotfound: 'No Following User found' }));
}
);

// @route   DELETE api/profile/follower/:id
// @desc    Delete follower from profile
// @access  Private
router.delete(
  '/follower/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.followers
          .map(item => item.id)
          .indexOf(req.params.id);

        if (removeIndex === -1) {
          errors.followernotfound = 'Follower not found';
          // Return any errors with 404 status
          return res.status(404).json(errors);         
        }
        // Splice out of array
        profile.followers.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/following/:id
// @desc    Delete following user from profile
// @access  Private
router.delete(
  '/following/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.following
          .map(item => item.id)
          .indexOf(req.params.id);

          if (removeIndex === -1) {
            errors.followingusernotfound = 'Followng user not found';
            // Return any errors with 404 status
            return res.status(404).json(errors);         
          }
        // Splice out of array
        profile.following.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/linkedAccount/:account
// @desc    Delete linked Account from profile
// @access  Private
router.delete(
    '/linkedAccount/:account',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          // Get remove index
          const removeIndex = profile.linkedAccounts
            .map(item => item.id)
            .indexOf(req.params.account);
  
            if (removeIndex === -1) {
              errors.linkedacountnotfound = 'Linked account not found';
              // Return any errors with 404 status
              return res.status(404).json(errors);         
            }
          // Splice out of array
          profile.linkedAccounts.splice(removeIndex, 1);
  
          // Save
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
  );
  
// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);
module.exports = router;