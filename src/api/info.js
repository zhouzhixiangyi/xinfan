import { request } from './request';

// export function  getHomeMultiData() {
//     return request({
//         url: '/home/multidata',
//     })
// }

// export function getHomeGoods(type,page) {
//     return request({
//         url: '/home/data',
//         params: {
//             type: type,
//             page: page
//         }
//     })
// }

export function getInfos() {
    return request({
        url: '/api/xinfangBasicInformations',
    })
}

// 条件查询
export function getInfoByConditions(conditions) {
    const { name, company, startTime, endTime } = conditions
    return request({
        url: '/api/xinfangBasicInformations',
        method: 'GET',
        params: {
            name,
            company,
            startTime,
            endTime
        }
    })
}

export function getInfosById(id) {
    return request({
        url: '/api/xinfangBasicInformations/' + id,
        method: 'GET',
    })
}



export function addInfo(formInfo) {
    return request({
        url: '/api/xinfangBasicInformations',
        method: 'POST',
        data: formInfo
    })
}

export function deleteInfo(id) {
    return request({
        url: '/api/xinfangBasicInformations/' + id,
        method: 'DELETE',
    })
}


export function editInfo(id, jsonInfo) {
    return request({
        url: '/api/xinfangBasicInformations/' + id,
        method: 'PATCH',
        data: jsonInfo
    })
}
