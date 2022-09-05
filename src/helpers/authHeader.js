import { authenticationService } from '../services/authservices';

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    const token = authenticationService.tokenValue;
    if (currentUser && token) {
    
        return { 
            Authorization: `Bearer ${token}`
         };
    } 
        return {};
}