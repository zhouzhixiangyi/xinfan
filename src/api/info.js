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
    const { name, company, startTime, endTime, isEnd,isRepeated } = conditions
    console.log(conditions);
    return request({
        url: '/api/xinfangBasicInformations',
        method: 'GET',
        params: {
            name,
            company,
            startTime,
            endTime,
            isEnd,
            isRepeated
        }
    })
}

// 月查询
export function getInfoByMonth(yearMonth) {
    let year = ''
    let month = ''
    
    if (yearMonth) {
        let data = yearMonth.split('-')
        year = data[0]
        month = data[1]
    }
    console.log(year,month)
    return request({
        url: '/api/xinfangBasicInformations/details/GetByMonth',
        method: 'GET',
        params: {
            year,
            month
        }
    })
}



export function getInfosById(id) {
    return request({
        url: '/api/xinfangBasicInformations/' + id,
        method: 'GET',
    })
}



// export function addInfo(formInfo) {
//     return request({
//         url: '/api/xinfangBasicInformations',
//         method: 'POST',
//         data: formInfo
//     })
// }


export function addInfo(formInfo) {
    Object.keys(formInfo).forEach(key => {
        if (key == 'appealWaysToDisplay') {
            key = 'appealWays'
        }
    })
    console.log(formInfo)
    return request({
        url: '/api/xinfangBasicInformations',
        method: 'POST',
        data: formInfo,
        
    })
}

export function addFilesById(id, files) {
    // Object.keys(formInfo).forEach(key => {
    //     if (key == 'appealWaysToDisplay') {
    //         key = 'appealWays'
    //     }
    // })
    // console.log(formInfo)
    return request({
        url: `/api/xinfangBasicInformations/${id}/xinfangRelatedMaterials`,
        method: 'POST',
        data: files
    })
}

// 获取附件

export function getFilesById(id) {
    // Object.keys(formInfo).forEach(key => {
    //     if (key == 'appealWaysToDisplay') {
    //         key = 'appealWays'
    //     }
    // })
    // console.log(formInfo)
    return request({
        url: `/api/xinfangBasicInformations/${id}/xinfangRelatedMaterials`,
        method: 'GET'
    })
}


export function deleteInfo(id) {
    return request({
        url: '/api/xinfangBasicInformations/' + id,
        method: 'DELETE',
    })
}


export function deleteFileById(basicInfoId, relatedMaterialId) {
    return request({
        url: `api/xinfangBasicInformations/${basicInfoId}/xinfangRelatedMaterials/${relatedMaterialId}`,
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
