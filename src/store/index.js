import { createStore } from 'vuex'
import {Login} from '../../mock/index';
export default createStore({
    state: {
        token: ''
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        }


    },
    actions: {
        LoginResult({commit}, userInfo) {
            return new Promise((resolve,reject) => {
                Login(userInfo).then(response => {
                    const {code,token} = response.data;
                    if (code == 200 ){
                        localStorage.setItem('token', token);
                        commit('SET_TOKEN', token);
                    }
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                })
            })
        }
    },
    getters: {

    }
})