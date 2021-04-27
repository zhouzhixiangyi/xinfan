<template>
  <div class="report-wrapper">
    <a-month-picker
      v-model:value="month"
      placeholder="Select month"
    />
    <a-button type="primary" @click="searchInfo" :disabled="month==null"> 查询 </a-button>
    <a-button type="primary" @click="exportExcel" :disabled="month==null">导出excel</a-button>

    <a-table :columns="columns" :data-source="data" bordered rowKey="id" :scroll="{ x: 1500, y: 'calc(100vh - 400px)' }">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #title class="header">Header</template>
    </a-table>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
// import moment from "moment";
import { message } from "ant-design-vue";
import { getInfoByMonth } from "@/api/info";
let columns = [
  {
    title: "序号",
    width: 80,
    customRender: ({ index }) => `${index + 1}`,
    align: "center",
  },
  {
    title: "收到时间",
    width: 180,
    dataIndex: "receivedTime",
    key: "receivedTime",
    sorter: (a, b) => {
      let aTime = new Date(a.receivedTime).getTime();
      let bTime = new Date(b.receivedTime).getTime();
      return aTime - bTime;
    },
    sortDirections: ["ascend", "descend"],
    //fixed: "left",
    align: "center",
    defaultSortOrder: "descend",
  },
  {
    title: "来信来访人",
    width: 120,
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "人数",
    width: 80,
    dataIndex: "personCount",
    key: "personCount",
    align: "center",
  },
  {
    title: "单位",
    dataIndex: "company",
    key: "company",
    width: 180,
    align: "center",
  },

  {
    title: "主要诉求",
    dataIndex: "mainAppeal",
    key: "mainAppeal",
    width: 200,
    align: "center",
  },
  {
    title: "处理意见",
    dataIndex: "opinions",
    key: "opinions",
    width: 200,
    align: "center",
  },
];

export default defineComponent({
  setup() {
    let month = ref();
    let data = ref([]);

    // 查询月数据
        console.log(month);
    const searchInfo = async () => {
      message.loading("正在执行...", 1.5).then(async () => {
          if(typeof month.value != 'string'){

              month.value = (month.value).format('YYYY-MM')
          }
        const res = await getInfoByMonth(month.value);
        console.log(res)
        data.value = res.data;
      });
    };

    return {
      month,
      columns,
      searchInfo,
      data,
    };
  },
});
</script>

<style lang="less" scoped>
.report-wrapper {
}
</style>