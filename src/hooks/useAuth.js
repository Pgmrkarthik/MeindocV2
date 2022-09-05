import {createContext} from 'react'

const useAuth = createContext(JSON.parse(localStorage.getItem('data')));

export default useAuth