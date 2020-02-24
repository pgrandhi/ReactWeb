const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateFollowerInput(data) {
  let errors = {};
  
  if (Validator.isEmpty(data.user)) {
    errors.user = 'user field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
