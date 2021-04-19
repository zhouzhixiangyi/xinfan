import axios from 'axios'

export function request(config){
	const instance = axios.create({
		baseURL: 'http://191.168.168.165:5000',
        // baseURL: 'http://192.168.0.104:5000',
		timeout: 5000
	})

    instance.interceptors.request.use(config => {
        return config
    }, err => {
        console.log(err)
    })

    instance.interceptors.response.use(res => {
        return res
    }, err => {
        console.log(err)
    })
	return instance(config)
}