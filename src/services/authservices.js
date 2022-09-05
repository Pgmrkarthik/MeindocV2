
import { BehaviorSubject } from 'rxjs';
import {config} from '../config';
import { handleResponse } from '../helpers/handle_response';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const Token = new BehaviorSubject(JSON.parse(localStorage.getItem('token')));

export const authenticationService = {
    login,
    logout,
    token: Token.asObservable(),
    get tokenValue() { return Token.value },
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(UserCredentials) {

    const _requestdata ={
        appid:process.env.REACT_APP_ID,
        userid:UserCredentials.email,
        password:UserCredentials.password
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(_requestdata)
    };

    return fetch(`${config.DP_ROOT_URL}/login.php`, requestOptions)
        .then(handleResponse)
        .then(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            localStorage.setItem('token', JSON.stringify(data.token));
            currentUserSubject.next(data.user);
            Token.next(data.token);
            return data.user;
        });
}

function logout() {
    
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    currentUserSubject.next(null);
    Token.next(null);
    
}