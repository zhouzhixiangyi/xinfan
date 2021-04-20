import { request } from './request';
export function Login(userinfo) {
    const { mobile, password } = userinfo
    return request({
        url: 'api/Authentication/loginByOA',
        method: 'GET',
        params: {
            mobile,
            password
        }
    })
}
