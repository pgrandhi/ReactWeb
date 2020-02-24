const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Story = require('../../models/Story');
// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/stories
// @desc    Get stories
// @access  Public
router.get('/', (req, res) => {
  Story.find()
    .sort({ date: -1 })
    .then(stories => res.json(stories))
    .catch(err => res.status(404).json({ nopstoriesfound: 'No stories found' }));
});

// @route   GET api/stories/:id
// @desc    Get story by id
// @access  Public
router.get('/:id', (req, res) => {
    Story.findById(req.params.id)
    .then(story => res.json(story))
    .catch(err =>
      res.status(404).json({ nostoryfound: 'No story found with that ID' })
    );
});

// @route   POST api/stories
// @desc    Create story
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
  
    const newStory = new Story({
      mediaLinks: req.body.medialinks.split(','),
      texr: req.body.text,
      tags: req.body.tags,
      location: req.body.location,
      user: req.user.id
    });

    newStory.save().then(story => res.json(story));
  }
);

// @route   DELETE api/stories/:id
// @desc    Delete story
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Story.findById(req.params.id)
        .then(post => {
          // Check for story owner
          if (story.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          story.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ storynotfound: 'No story found' }));
    });
  }
);

// @route   POST api/stories/message/:id
// @desc    Add message to story
// @access  Private
router.post(
  '/message/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Story.findById(req.params.id)
      .then(story => {
        const newMessage = {
          text: req.body.text,
          name: req.body.name,
          mediaUrl: req.body.mediaUrl,
          user: req.user.id
        };

        // Add to messages array
        story.messages.unshift(newMessage);

        // Save
        story.save().then(story => res.json(story));
      })
      .catch(err => res.status(404).json({ storynotfound: 'No story found' }));
  }
);

// @route   DELETE api/stories/message/:id/:message_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/message/:id/:message_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Story.findById(req.params.id)
      .then(post => {
        // Check to see if message exists
        if (
          story.messages.filter(
            message => message._id.toString() === req.params.message_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ messagenotexists: 'Messae does not exist' });
        }

        // Get remove index
        const removeIndex = story.messages
          .map(item => item._id.toString())
          .indexOf(req.params.message_id);

        // Splice message out of array
        story.messages.splice(removeIndex, 1);

        story.save().then(story => res.json(story));
      })
      .catch(err => res.status(404).json({ storynotfound: 'No story found' }));
  }
);


module.exports = router;