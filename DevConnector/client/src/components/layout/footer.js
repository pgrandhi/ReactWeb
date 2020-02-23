import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// #region constants

// #endregion

// #region styled-components

// #endregion

// #region functions

// #endregion

// #region component
const propTypes = {};

const defaultProps = {};

/**
 * 
 */
const footer = () => {
    return (
        <footer className="bg-dark text-white mt-5 p-4 text-center">
        Copyright &copy; {new Date().getFullYear()} Dev Connector
        </footer>
    );
}

footer.propTypes = propTypes;
footer.defaultProps = defaultProps;
// #endregion

export default footer;