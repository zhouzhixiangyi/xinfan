import { createStore } from 'vuex'
import {Login} from '@/api/user';
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
        LoginResult({commit}, userInfo) {
            return new Promise((resolve,reject) => {
                Login(userInfo).then(response => {
                    // const {code,token} = response.data;
                    const code = response.status;
                    const token = response.data.name;
                    if (code == 200 ){
                        localStorage.setItem('token', token);
                        commit('SET_TOKEN', token);
                    }
                    resolve(response);
                }).catch(error => {
                    reject(error);
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