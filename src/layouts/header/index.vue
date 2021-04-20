<template>
  <div class="app-avatar">
    <a-dropdown>
      <span class="ant-dropdown-link">
        <a class="ant-dropdown-link" @click.prevent>
          {{ username }}
          <DownOutlined />
        </a>
      </span>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a-button type="primary" @click="onLogout"
              ><LogoutOutlined /> 注销登录</a-button
            >
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    DownOutlined,
    LogoutOutlined,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const onLogout = () => {
      store.dispatch("RemoveToken");
      router.push("/login");
    };

    const username = computed(() => {
      return store.getters.loginUser;
    });

    return {
      onLogout,
      username,
    };
  },
});
</script>

<style lang="less" scoped>
.app-avatar {
  .ant-dropdown-link {
    display: block;
    min-height: 64px;
    cursor: pointer;
  }
}
</style>