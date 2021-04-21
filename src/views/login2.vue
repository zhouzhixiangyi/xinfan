<template>
  <div></div>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    // console.log(router);
    // console.log(route.query);
    message.loading("正在处理...", 1.5).then(async () => {
      const toLogin = async (mobile, password) => {
        if (mobile.trim() == "" || password.trim() == "")
          return message.warning("用户名和密码不能为空");
        const res = await store.dispatch("LoginResult", { mobile, password });
        // console.log('0000000000000000')
        // console.log(res);
        if (res.status == 200) {
          // console.log(store.state.token);
          router.push("/list");
          message.success("登录成功！");
        } else {
          router.push("/login");
          return message.error("登录失败！");
        }
      };
      if (route.query && route.query.mobile && route.query.password) {
        const mobile = route.query.mobile;
        const password = route.query.password;

        toLogin(mobile, password);
      } else {
        router.push("/login");
        return message.error("登录失败！");
      }
    });
  },
});
</script>