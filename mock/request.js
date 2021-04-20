import axios from 'axios'

const instance = axios.create({
    baseURL: '/mock/'
})

export default instance;