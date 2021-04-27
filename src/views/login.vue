<template>
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100">
        <div
          class="login100-form-title"
          :style="{ 'background': 'url(' + require('../assets/images/bg-01.jpg') + ')'}"
        >
          <span class="login100-form-title-1">登 录</span>
        </div>

        <div class="login100-form ">
          <div
            class="wrap-input100  m-b-26"
          >
            <span class="label-input100">手机号</span>
            <input
              class="input100"
              type="text"
              name="username"
              placeholder="请输入手机号"
              v-model="formState.mobile"
            />
            <span class="focus-input100"></span>
          </div>

          <div
            class="wrap-input100 m-b-18"
          >
            <span class="label-input100">密码</span>
            <input
              class="input100"
              type="password"
              name="pass"
              placeholder="请输入密码"
              v-model="formState.password"
            />
            <span class="focus-input100"></span>
          </div>
          <div class="container-login100-form-btn" style="text-align: right">
            <a-button style="width: 400px" type="primary" @click="toLogin">登录</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive } from "vue";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import md5 from 'js-md5';
export default defineComponent({
  setup() {
    document.title = "登录";
    const router = useRouter();
    const store = useStore();
    const formState = reactive({
      mobile: "",
      password: "",
    });

    const toLogin = async () => {
      message.loading("正在执行...", 1.5).then(async () => {
        
        console.log(formState);
        let { mobile, password } = formState;
        password = md5(password);
        if (mobile.trim() == "" || password.trim() == "")
          return message.warning("用户名和密码不能为空");
        const res = await store.dispatch("LoginResult", {mobile,password});
        // console.log(res);
        if (res.status == 200) {
          // console.log(store.state.token);
          router.push("/list");
          message.success("登录成功！");
        } else {
          message.error("登录失败");
        }
      });
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

  // components: {
  //   UserOutlined,
  //   LockOutlined,
  // },
});
</script>

<style scoped>
@import url("../assets/css/main.css");
@import url("../assets/css/util.css");
</style>