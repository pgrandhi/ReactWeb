const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLinkedAccountInput(data) {
  let errors = {};

  data.account = !isEmpty(data.account) ? data.account : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  
  if (Validator.isEmpty(data.account)) {
    errors.account = 'Account field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'account email field is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Account password is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
