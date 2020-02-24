const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.mediaLinks = !isEmpty(data.mediaLinks) ? data.mediaLinks : '';
  data.caption = !isEmpty(data.caption) ? data.caption : '';

  if (Validator.isEmpty(data.caption)) {
    errors.text = 'Text field is required';
  }

  if (!Validator.isLength(data.caption, { min: 10, max: 300 })) {
    errors.text = 'Post caption must be between 10 and 300 characters';
  }

  if (Validator.isEmpty(data.mediaLinks) ||  (data.mediaLink == undefined)) {
    errors.text = 'Media Link (photo/video URL) field is required';
  }
  
  var mediaUrls = data.mediaLinks.split(',');
  array.forEach(function (item, index) {
    if (!isEmpty(item)) {
      if (!Validator.isURL(item)) {
        errors.website = 'Media link is not valid';
      }
    }
  });

  return {
    errors,
    isValid: isEmpty(errors)
  };
};