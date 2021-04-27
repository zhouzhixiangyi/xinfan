<template>
  <a-layout class="app-wrapper">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="app-sider"
    >
      <div class="logo">{{ collapsed ? "信访" : "信访系统" }}</div>
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <a-sub-menu key="1">
          <template #title>
            <span>
              <RadarChartOutlined />
              <span>数据管理</span>
            </span>
          </template>
          <a-menu-item key="/list"
            ><router-link to="/list">数据列表</router-link></a-menu-item
          >
          <a-menu-item key="/add" v-if="isLeader"
            ><router-link to="/add">添加数据</router-link></a-menu-item
          >
        </a-sub-menu>
        <a-sub-menu key="2">
          <template #title>
            <span>
              <RadarChartOutlined />
              <span>报表管理</span>
            </span>
          </template>
          <a-menu-item key="/monthReport"
            ><router-link to="/monthReport">月报</router-link></a-menu-item
          >
          <a-menu-item key="/otherReport"
            ><router-link to="/otherReport">季报/年报</router-link></a-menu-item
          >
        </a-sub-menu>
        
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="app-header">
        <a-row>
          <a-col>
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <menu-fold-outlined
              v-else
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
          </a-col>
          <a-col>
            <!-- header 右侧 -->
            <app-header />
          </a-col>
        </a-row>
      </a-layout-header>

      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item><a href="">数据管理</a></a-breadcrumb-item>
          <a-breadcrumb-item
            ><a href="">{{ route.meta.title }}</a></a-breadcrumb-item
          >
        </a-breadcrumb>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import AppHeader from "./header/index.vue";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  RadarChartOutlined,
} from "@ant-design/icons-vue";
// import { createFromIconfontCN } from "@ant-design/icons-vue";
// const IconFont = createFromIconfontCN({
//   scriptUrl: "//at.alicdn.com/t/font_2482616_d5kl03f18ju.js",
// });
import { defineComponent, ref, computed } from "vue";
import { useRoute /*useRouter*/ } from "vue-router";
import leaders from "@/constant/leader.js";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    //IconFont,
    RadarChartOutlined,
    AppHeader,
  },

  setup() {
    // eslint-disable-next-line no-unused-vars
    // onBeforeRouteLeave((to, from) => {
    //   document.title = to.meta.title;
    // });
    const route = useRoute();
    const store = useStore();
    // const router = useRouter();

    // // router -> this.$router
    // // route > this.$route
    // router.push("/");
    //const title = ref(route.meta.title)
    const username = computed(() => {
      return store.getters.loginUser;
    });

    const isLeader = leaders.includes(username.value);

    return {
      collapsed: ref(false),
      selectedKeys: ref(["1"]),
      route,
      isLeader,
    };
  },
});
</script>
<style lang="less" scoped>
.app-wrapper {
  .app-sider {
    left: 0;
    height: 100vh;
    overflow: auto;
    .logo {
      height: 32px;
      background: rgba(255, 255, 255, 0.3);
      margin: 16px;
      text-align: center;
      line-height: 32px;
      font-size: 16px;
      color: aliceblue;
    }
  }
  .app-header {
    padding: 0%;
    background: #fff;
    .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }
    .ant-row {
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
    }
  }
}
</style>
