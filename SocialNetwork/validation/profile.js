const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  if (!isEmpty(data.profilePicUrl)) {
    if (!Validator.isURL(data.profilePicUrl)) {
      errors.profilePicUrl = 'Profile Pic Url is not valid';
    }
  }
  
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Website Url is not valid';
    }
  }
  
  var phoneno = /^\d{10}$/;
  if (!isEmpty(data.phone)) {
    if (!data.phone.match(phoneno)) {
      errors.phone = 'Phone number is not valid';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
