const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Collection model
const Collection = require('../../models/Collection');
// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/collections
// @desc    Get collections
// @access  Public
router.get('/', (req, res) => {
  Collection.find()
    .sort({ date: -1 })
    .then(collections => res.json(collections))
    .catch(err => res.status(404).json({ nocollectionsfound: 'No collections found' }));
});

// @route   GET api/collection/:id
// @desc    Get collection by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(collection => res.json(collection))
    .catch(err =>
      res.status(404).json({ nocollectionfound: 'No collection found with that ID' })
    );
});

// @route   POST api/collection
// @desc    Create collection
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
  
    const newCollection = new Collection({
      name: req.body.name,
      user: req.user.id,
    });

    newCollection.save().then(collection => res.json(collection));
  }
);

// @route   DELETE api/collections/:id
// @desc    Delete collection
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Collection.findById(req.params.id)
        .then(collection => {
          // Check for post owner
          if (collection.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          collection.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ collectionnotfound: 'No collection found' }));
    });
  }
);

// @route   POST api/collections/addpost/:id/:post_id
// @desc    add post to collection
// @access  Private
router.post(
  '/addpost/:id/:post_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Collection.findById(req.params.id)
        .then(collection => {
          if (
            collection.posts.filter(postItem => postItem.post.toString() === req.params.post_id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyAddedToCollection: 'Post already added to collection' });
          }

          // Add user id to likes array
          collection.posts.unshift({ pot: req.params.post_id });

          collection.save().then(collection => res.json(collection));
        })
        .catch(err => res.status(404).json({ collectionnotfound: 'No collection found' }));
    });
  }
);

// @route   POST api/collections/post/:id/:post_id
// @desc    Remove post from collection
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Collections.findById(req.params.id)
        .then(collection => {
          if (
            collection.posts.filter(postItem => postItem.post.toString() === req.params.post_id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notInCollection: 'You have not yet added the post to collection' });
          }

          // Get remove index
          const removeIndex = collection.posts
            .map(item => item.post.toString())
            .indexOf(req.params.post_id);

          // Splice out of array
          collection.posts.splice(removeIndex, 1);

          // Save
          collection.save().then(collection => res.json(collection));
        })
        .catch(err => res.status(404).json({ collectionnotfound: 'No collection found' }));
    });
  }
);

module.exports = router;