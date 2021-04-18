<template>
  <a-config-provider :getPopupContainer="getPopupContainer" :locale=locale>
    <router-view></router-view>
  </a-config-provider>
</template>
<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";
// import moment from 'moment';
// import 'moment/dist/locale/zh-cn';
// moment.locale('zh-cn');
export default {
    data() {
      return {
        locale: zhCN,
      };
    },
  };
</script>