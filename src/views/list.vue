<template>
  <div class="data-table">
    <a-form
      layout="inline"
      :model="formState"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
    >
      <a-form-item>
        <a-input v-model:value="searchForm.name" placeholder="来信来访人">
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model:value="searchForm.company" placeholder="单位">
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-date-picker
          v-model:value="searchForm.startTime"
          show-time
          placeholder="接收时间-起始"
        />
        -
        <a-date-picker
          v-model:value="searchForm.endTime"
          show-time
          placeholder="接收时间-结束"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="searchInfo"> 查询 </a-button>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 1500, y: 420 }"
    >
      <template #action="{ record }">
        <!-- <a :href="'/edit/'+record.id">修改</a> -->
        <router-link :to="'/edit/' + record.id" tag="a">修改</router-link>
        <a-divider type="vertical" />
        <a-popconfirm
          v-if="data.length"
          title="是否删除该数据?"
          @confirm="onDelete(record.id)"
        >
          <a>删除</a>
        </a-popconfirm>
      </template>
      <template #expandedRowRender="{ record }">
        <a-list
          size="small"
          bordered
          :data-source="record.relatedMaterials"
          class="list"
        >
          <template #renderItem="{ item }">
            <a :href="item"
              ><a-list-item>{{ item }}</a-list-item></a
            >
          </template>
        </a-list>
      </template>
    </a-table>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { getInfos, getInfoByConditions, deleteInfo } from "@/api/info";
// import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
const columns = [
  {
    title: "序号",
    width: 60,
    customRender: ({ index }) => `${index + 1}`,
    fixed: "left",
    align: "center",
  },
  {
    title: "收到时间",
    width: 180,
    dataIndex: "receivedTime",
    key: "receivedTime",
    sorter: (a, b) => {
      let aTime = new Date(a.ReceivedTime).getTime();
      let bTime = new Date(b.ReceivedTime).getTime();
      return aTime - bTime;
    },
    sortDirections: ["ascend", "descend"],
    //fixed: "left",
    align: "center",
  },
  {
    title: "来信来访人",
    width: 120,
    dataIndex: "name",
    key: "name",
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
    title: "身份证号",
    dataIndex: "identityNumber",
    key: "identityNumber",
    width: 180,
    sorter: (a, b) => {
      return parseInt(a.identityNumber) - parseInt(b.identityNumber);
    },
    //sortOrder: 'ascend',
    sortDirections: ["ascend", "descend"],
    align: "center",
  },
  {
    title: "联系方式",
    dataIndex: "tel",
    key: "tel",
    width: 120,
    align: "center",
  },
  {
    title: "家庭住址",
    dataIndex: "address",
    key: "address",
    width: 180,
    align: "center",
  },
  {
    title: "社会关系",
    dataIndex: "socialRelationship",
    key: "socialRelationship",
    width: 120,
    align: "center",
  },
  {
    title: "主要诉求",
    dataIndex: "mainAppeal",
    key: "mainAppeal",
    width: 150,
    ellipsis: true,
    align: "center",
  },
  {
    title: "接访人",
    dataIndex: "receptionist",
    key: "receptionist",
    width: 120,
    align: "center",
  },
  {
    title: "处理时间",
    dataIndex: "handledTime",
    key: "handledTime",
    width: 180,
    sorter: (a, b) => {
      let aTime = new Date(a.handledTime).getTime();
      let bTime = new Date(b.handledTime).getTime();
      return aTime - bTime;
    },
    sortDirections: ["ascend", "descend"],
    align: "center",
  },
  // {
  //   title: "相关材料",
  //   dataIndex: "address",
  //   key: "7",
  //   width: 150,
  // },
  {
    title: "处理意见",
    dataIndex: "opinions",
    key: "opinions",
    width: 120,
    align: "center",
  },
  {
    title: "是否终结",
    dataIndex: "isEnd",
    key: "isEnd",
    width: 120,
    align: "center",
  },
  {
    title: "反映渠道",
    dataIndex: "appealWaysToDisplay",
    key: "appealWaysToDisplay",
    width: 150,
    align: "center",
  },
  {
    title: "包案领导",
    dataIndex: "leader",
    key: "leader",
    width: 120,
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
    width: 180,
    ellipsis: true,
    align: "center",
  },
  {
    title: "操作",
    key: "operation",
    //fixed: "right",
    width: 120,
    slots: {
      customRender: "action",
    },
    align: "center",
  },
];
//let data = [];

// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i,
//     Id: i,
//     Name: `美猴王${i}`,
//     ReceivedTime: `2021-02-24 09:50:23`,
//     Company: `互联网公司${i}`,
//     IdentityNumber: `100${i}`,
//     Tel: i,
//     Address: `中国`,
//     SocialRelationship: `无`,
//     MainAppeal: `看看`,
//     Receptionist: `someone`,
//     HandledTime: `2021-03-24 10:50:23`,
//     Opinions: `通过`,
//     IsEnd: `未终结`,
//     AppealWays: `走访`,
//     Leader: `someone`,
//     Remark: `无`,
//     RelatedMaterials: [
//       "www.baidu.com",
//       "www.zhihu.com",
//       "www.github.com",
//       "www.bing.com",
//       "www.antdv.com",
//     ],
//   });
// }

export default defineComponent({
  setup() {
    // const router = useRouter();
    let data = ref([]);
    let searchForm = ref({
      name: null,
      company: null,
      startTime: null,
      endTime: null,
    });

    const get = async () => {
      let res = await getInfos();
      res = res.data;
      let _res = [];
      res.map((item, index) => {
        item.isEnd ? (item.isEnd = "已终结") : (item.isEnd = "未终结");
        item.receivedTime = item.receivedTime.replace("T", " ");
        item.handledTime = item.handledTime.replace("T", " ");
        _res.push(Object.assign({}, item, { key: index, index: index }));
      });
      data.value = _res;
      console.log(_res);
    };
    get();

    const searchInfo = async () => {
      let startTime = searchForm.value.startTime;
      let endTime = searchForm.value.endTime;
      if (
        startTime != null &&
        startTime != "" &&
        endTime != null &&
        endTime != "" &&
        startTime > endTime
      ) {
        return message.error("起始时间不能大于结束时间");
      }

      if (startTime != null && startTime != "") {
        searchForm.value.startTime = startTime.format("YYYY-MM-DD hh:mm:ss");
      }
      if (endTime != null && endTime != "") {
        searchForm.value.endTime = endTime.format("YYYY-MM-DD hh:mm:ss");
      }

      //console.log(searchForm.value);
      let res = await getInfoByConditions(searchForm.value);
      res = res.data;
      let _res = [];
      res.map((item, index) => {
        item.isEnd ? (item.isEnd = "已终结") : (item.isEnd = "未终结");
        item.receivedTime = item.receivedTime.replace("T", " ");
        item.handledTime = item.handledTime.replace("T", " ");
        _res.push(Object.assign({}, item, { key: index, index: index }));
      });
      data.value = _res;
      console.log(_res);
    };

    const onDelete = async (id) => {
      const res = await deleteInfo(id);
      console.log(res);
      if (res.status == 204) {
        message.success("删除成功！");
        location.reload()
      } else {
        message.error("删除失败！");
      }
    };

    return {
      data,
      columns,
      searchForm,
      searchInfo,
      onDelete,
    };
  },
});
</script>
<style lang="less">
.data-table {
  margin-top: 5px;
  .list {
    margin-left: 145px;
    width: 500px;
  }
}
</style>