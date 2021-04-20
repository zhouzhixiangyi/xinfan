import Mock from 'mockjs'

Mock.mock(
    '/mock/login',
    'post',
    (req) => {
        const { password, user } = JSON.parse(req.body)
        console.log(password, user);
        if (user === 'admin' && password === '123456') {
            return {
                code: 200,
                token: 'admin-token'
            }
        } else {
            return {
                success: false
            }
        }
    }
)