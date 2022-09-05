
import {config} from '../config';
import { authHeader} from '../helpers/authHeader';
import { handleResponse } from '../helpers/handle_response';




export const userService = {
    addNewRequest,
    getAllRequest,
    getRequestById,
    removeRequestById
};

function getAllRequest() {
    const requestData = {
        appid:process.env.REACT_APP_ID
    }
    const requestOptions = { 
        method: 'post',
        headers:authHeader(),
        body:JSON.stringify(requestData)
    }
    console.log(requestOptions);
     return fetch(`${config.DP_ROOT_URL}/get_patients.php`, requestOptions).then(handleResponse);

   // axios
    // return axios.post(`${config.DP_ROOT_URL}/get_patients.php`,requestData,{
    //     headers:authHeader()
    // }).then(handleResponse);
}

//
function getRequestById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.DP_ROOT_URL}/get_PatientData.php`, requestOptions).then(handleResponse);
}


function removeRequestById(id) {
    const bodydata ={
        appid:process.env.REACT_APP_ID,
        requestid:id
    }
    const requestOptions = { 
        method: 'post',
        headers:authHeader(),
        body:JSON.stringify(bodydata)
    }
    return fetch(`${config.DP_ROOT_URL}/remove_request.php`, requestOptions).then(handleResponse);

}

function addNewRequest(values) {
   
    const requestOptions = { 
        method: 'post',
        headers:authHeader(),
        body:JSON.stringify(values)
    }
    console.log(requestOptions);
    return fetch(`${config.DP_ROOT_URL}/addNewRequest.php`, requestOptions).then(handleResponse);
}
