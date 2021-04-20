import axios from 'axios'

export function request(config){
	const instance = axios.create({
		// baseURL: 'http://191.168.168.165:5000',
        // baseURL: 'http://192.168.0.104:5000',
        // baseURL: 'http://191.168.204.60:5000',
        // baseURL: 'http://192.168.43.16:5000', // yfzx
        baseURL: 'http://192.168.0.130:5000', // 199
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