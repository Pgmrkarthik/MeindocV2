import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import { authenticationService } from './authservices';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.role) === -1) {
            // role not authorised so redirect to home page
            return <Navigate to={{ pathname: '/'}} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
)