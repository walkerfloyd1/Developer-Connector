import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, auth: {isAuthenticated, loading}, ...rest}) => (
    //If user is not authenticated, redirect to login.
    //If they are authenticated then component will load
    <Route {...rest} render={props => !isAuthenticated && !loading ? (<Redirect to="/login" />) : (<Component {...props} />)} />
)

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
