<template>
<div class="form">
    <a-form :layout="horizontal" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" class="form-container">
      <a-form-item>
        <a-input v-model:value="formState.user" placeholder="Username">
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="formState.password"
          type="password"
          placeholder="Password"
        >
          <template #prefix
            ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          @click="toLogin"
          :disabled="formState.user === '' || formState.password === ''"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
</div>
</template>
<script>
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive } from "vue";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const formState = reactive({
      user: "",
      password: "",
    });

    const toLogin = async () => {
      const { user, password } = formState;
      if (user.trim() == "" || password.trim() == "")
        return message.warning("用户名和密码不能为空");
      const res = await store.dispatch("LoginResult", formState);
      console.log(res);
      console.log(store.state.token);
      router.push("/list");
    };

    return {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      formState,
      toLogin,
    };
  },

  components: {
    UserOutlined,
    LockOutlined,
  },
});
</script>

<style lang='less' scoped>
.form{
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .form-container{
    width: 500px;
  }
}


</style>