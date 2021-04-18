<template>
  <a-form
    :model="formState"
    class="form-area"  
  >
    <a-form-item>
      <a-input v-model:value="formState.user" placeholder="Username">
        <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="formState.password" type="password" placeholder="Password">
        <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        @click="toLogin"
        :disabled="formState.user === '' || formState.password === ''"
      >
        Log in
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive } from 'vue';
import { message } from 'ant-design-vue';
import {useStore} from 'vuex'
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const formState = reactive({
      user: '',
      password: '',
    });

    const toLogin = async () => {
      const {user, password} = formState;
      if (user.trim() == '' || password.trim() == '') return message.warning('用户名和密码不能为空');
      const res = await store.dispatch('LoginResult', formState);
      console.log(res);
      console.log(store.state.token)
      router.push("/list");
      
    }
    

    return {
      formState, 
      toLogin
    };
  },

  components: {
    UserOutlined,
    LockOutlined,
  },
});
</script>