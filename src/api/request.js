import axios from 'axios'

export function request(config){
	const instance = axios.create({
		// baseURL: 'http://191.168.168.165:5000',
        // baseURL: 'http://192.168.0.104:5000',
        baseURL: 'http://192.168.204.60:10030',
        // baseURL: 'http://192.168.43.16:5000', // yfzx
        // baseURL: 'http://192.168.0.130:5000', // 199
        // baseURL: 'http://172.16.4.242:10030',
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
        return err
    })
	return instance(config)
}