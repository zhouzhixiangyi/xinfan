import { createStore } from 'vuex'
import { Login } from '@/api/user';
// import { useRouter } from "vue-router";
// import { message } from "ant-design-vue";

// const router = useRouter();

export default createStore({
    state: {
        token: ''
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        REMOVE_TOKEN: (state) => {
            localStorage.removeItem('token');
            state.token = '';
        }


    },
    actions: {
        LoginResult({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                Login(userInfo).then(response => {
                    // const {code,token} = response.data;
                    // console.log(response);
                    const code = response.status;
                    if (code == 200) {
                        const token = response.data.name;
                        localStorage.setItem('token', token);
                        commit('SET_TOKEN', token);
                    } 
                    resolve(response);
                }).catch(error => {
                    console.log(error)
                    // router.push('/login')
                    reject(error);
                    // return message.error("登录失败！");
                })
            })
        },
        RemoveToken({ commit }) {
            commit('REMOVE_TOKEN');
        }
    },
    getters: {
        loginUser(state) {
            return state.token || localStorage.getItem('token');
        }
    }
})