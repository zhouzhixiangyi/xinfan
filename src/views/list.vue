<template>
  <div class="data-table">
    <a-form layout="inline" :model="formState">
      <a-form-item>
        <a-input
          v-model:value="searchForm.name"
          placeholder="来信来访人"
          :allowClear="true"
        >
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="searchForm.company"
          placeholder="单位"
          :allowClear="true"
        >
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-date-picker
          v-model:value="searchForm.startTime"
          show-time
          placeholder="收到时间-起始"
        />
        -
        <a-date-picker
          v-model:value="searchForm.endTime"
          show-time
          placeholder="收到时间-结束"
        />
      </a-form-item>
      <a-form-item>
        <a-select
          v-model:value="searchForm.isEnd"
          placeholder="是否终结"
          :allowClear="true"
        >
          <!-- <a-select-option ></a-select-option> -->
          <a-select-option :value="true">已终结</a-select-option>
          <a-select-option :value="false">未终结</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select
          v-model:value="searchForm.isRepeated"
          placeholder="是否重复上访"
          :allowClear="true"
        >
          <!-- <a-select-option ></a-select-option> -->
          <a-select-option :value="true"> 重复上访 </a-select-option>
          <a-select-option :value="false"> 非重复上访</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="searchInfo"> 查询 </a-button>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 1500, y: 'calc(100vh - 400px)' }"
      :customRow="rowClick"
    >
      <template #action="{ record }">
        <a
          :href="'/edit/' + record.id"
          :class="{ dis: record.isEnd.toString() == '已终结' }"
          >修改</a
        >
        <!-- <router-link :to="'/edit/' + record.id" tag="a" :disabled="record.isEnd==='已终结'">修改{{record.isEnd}}</router-link> -->
        <a-divider type="vertical" />
        <a-popconfirm
          v-if="data.length"
          title="是否删除该数据?"
          @confirm="onDelete(record.id)"
        >
          <a>删除</a>
        </a-popconfirm>
      </template>
      <!-- <template #expandedRowRender>
        <a-list
          size="small"
          bordered
          :data-source="data1"
          class="list"
        >
          <template #renderItem="{ item }">
            <a :href="item"
              ><a-list-item>{{ item }}</a-list-item></a
            >
          </template>
        </a-list>
      </template> -->
      <template #expandedRowRender="{ record }">
        <div class="list">
          <a-row>
            <a-col :span="16">
              <a-list
                size="small"
                bordered
                :data-source="record.relatedMaterials"
              >
                <template #renderItem="{ item }">
                  <a-list-item
                    ><a
                      :href="
                        item.materialURL +
                        '?fileName=' +
                        item.fileName +
                        '&basicInfoId=' +
                        item.xinfangBasicInformationId
                      "
                      alt="单击文件下载文件"
                      >{{ item.fileName }}</a
                    >
                    <a
                      v-if="isLeader"
                      @click="
                        deletefile(item.xinfangBasicInformationId, item.id)
                      "
                      class="delete-icon"
                      ><DeleteOutlined /></a
                  ></a-list-item>
                </template>
              </a-list>
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="7" v-if="isLeader">
              <a-upload
                :file-list="fileList"
                :remove="handleRemove"
                :before-upload="beforeUpload"
                :multiple="true"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  选择文件
                </a-button>
              </a-upload>
              <a-button
                type="primary"
                :disabled="fileList.length === 0"
                :load="uploading"
                style="margin-top: 16px"
                @click="handleUpload(record)"
              >
                {{ uploading ? "正在上传" : "文件上传" }}
              </a-button>
            </a-col>
          </a-row>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import leaders from "@/constant/leader.js";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  getInfos,
  getInfoByConditions,
  deleteInfo,
  getFilesById,
  deleteFileById,
  addFilesById,
} from "@/api/info";
// import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import Moment from "moment";
let columns = [
  {
    title: "序号",
    width: 80,
    customRender: ({ index }) => `${index + 1}`,
    // fixed: "left",
    align: "center",
    // dataIndex: "index",
    // key: "index",
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
    title: "是否重复访",
    width: 80,
    dataIndex: "isRepeated",
    key: "isRepeated",
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
    // ellipsis: true,
    // align: "center",
    // customCell: () => {
    //   return {
    //     style: {
    //       maxWidth: 260,
    //       overflow: "hidden",
    //       whiteSpace: "nowrap",
    //       textOverflow: "ellipsis",
    //       cursor: "pointer",
    //     },
    //   };
    // },
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
    width: 200,
    align: "center",
  },
  {
    title: "联系方式",
    dataIndex: "tel",
    key: "tel",
    width: 140,
    align: "center",
  },
  {
    title: "身份证号",
    dataIndex: "identityNumber",
    key: "identityNumber",
    width: 190,
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
    title: "接访人",
    dataIndex: "receptionist",
    key: "receptionist",
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
    dataIndex: "operation",
    //fixed: "right",
    width: 120,
    slots: {
      customRender: "action",
    },
    align: "center",
  },
];

export default defineComponent({
  components: {
    DeleteOutlined,
  },
  setup() {
    document.title = "信息列表";
    const router = useRouter();
    console.log(leaders);
    const store = useStore();

    const username = computed(() => {
      return store.getters.loginUser;
    });

    const isLeader = leaders.includes(username.value);

    console.log(isLeader);

    if (!isLeader) {
      console.log("c-------");
      columns = columns.filter((item) => item.dataIndex !== "operation");
      console.log(columns);
    }

    // const router = useRouter();
    let data = ref([]);
    let searchForm = ref({
      name: null,
      company: null,
      startTime: null,
      endTime: null,
      isEnd: null,
      isRepeated: null,
    });

    const get = async () => {
      let res = await getInfos();
      res = res.data;
      // console.log("------------------");
      // console.log(res);
      let _res = [];

      res = res.sort((a, b) => {
        let aTime = Moment(a.receivedTime);
        let bTime = Moment(b.receivedTime);
        return bTime - aTime;
      });

      let results = await Promise.all(
        res.map(async (item, index) => {
          // 等待异步操作完成，返回执行结果

          const result = await getFilesById(item.id);
          item.relatedMaterials = result.data;
          if (item.receivedTime != null && item.receivedTime != "") {
            item.receivedTime = Moment(item.receivedTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          if (item.handledTime != null && item.handledTime != "") {
            item.handledTime = Moment(item.handledTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          item.isEnd ? (item.isEnd = "已终结") : (item.isEnd = "未终结");
          item.isRepeated ? (item.isRepeated = "重复上访") : (item.isRepeated = "非重复上访");
          _res.push(Object.assign({}, item, { key: index }));
          return _res;
        })
      );
      console.log(results);

      // console.log(_res);
      data.value = _res;
      console.log(data.value);
    };
    get();

    const searchInfo = async () => {
      message.loading("正在执行...", 1.5).then(async () => {
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
          item.isRepeated ? (item.isRepeated = "重复上访") : (item.isRepeated = "非重复上访");
          if (item.receivedTime != null && item.receivedTime != "") {
            item.receivedTime = Moment(item.receivedTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          if (item.handledTime != null && item.handledTime != "") {
            item.handledTime = Moment(item.handledTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          // item.receivedTime = item.receivedTime.replace("T", " ");
          // item.handledTime = item.handledTime.replace("T", " ");
          _res.push(Object.assign({}, item, { key: index, index: index }));
        });
        data.value = _res;
        message.success("查询成功");
        // console.log(_res);
      });
    };

    const onDelete = async (id) => {
      message.loading("正在执行...", 1.5).then(async () => {
        const res = await deleteInfo(id);
        // console.log(res);
        if (res.status == 204) {
          router.go(0);
          message.success("删除成功！");
        } else {
          message.error("删除失败！");
        }
      });
    };

    const deletefile = async (basicInfoId, id) => {
      message.loading("正在执行...", 1.5).then(async () => {
        const res = await deleteFileById(basicInfoId, id);
        if (res.status == 204) {
          router.go(0);
          message.success("删除成功");
        } else {
          message.error("删除失败");
        }
      });
    };

    const fileList = ref([]);
    const uploading = ref(false);

    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };

    const beforeUpload = (file) => {
      fileList.value = [...fileList.value, file];
      return false;
    };

    const handleUpload = async (record) => {
      message.loading("正在执行...", 1.5).then(async () => {
        // 添加文件
        const id = record.id;
        const formData = new FormData();
        // console.log(id)
        // 判断是否有同名的文件
        const existsFilenams = [];
        record.relatedMaterials.forEach((item) => {
          existsFilenams.push(item.fileName);
        });
        // console.log(existsFilenams);

        let flag = false;

        fileList.value.forEach((file) => {
          if (existsFilenams.includes(file.name)) {
            flag = true;
          }
          formData.append("formData", file);
        });
        if (flag) {
          fileList.value = [];
          return message.error("不能上传文件名一样的文件！");
        }
        // console.log(formData);
        uploading.value = true; // You can use any AJAX library you like

        formData.append("basicInfoId", id);
        const result = await addFilesById(id, formData);
        // console.log(result);
        if (result.status == 204) {
          fileList.value = [];

          uploading.value = false;
          // get();
          router.go(0);
          message.success("上传成功");
        } else {
          uploading.value = false;
          message.error("上传失败");
        }
      });
    };

    const rowClick = (record) => {
      return {
        onClick: () => {
          router.push("/see/" + record.id);
          // console.log(record)
        }, // 点击行
      };
    };

    return {
      data,
      columns,
      searchForm,
      searchInfo,
      onDelete,
      deletefile,
      fileList,
      uploading,
      handleUpload,
      handleRemove,
      beforeUpload,
      isLeader,
      rowClick,
    };
  },
});
</script>
<style lang="less">
.data-table {
  margin-top: 5px;
  .list {
    margin-left: 145px;
    width: 800px;
    .delete-icon {
      float: right;
    }
    .upload {
      float: right;
    }
  }
}
.dis {
  pointer-events: none;
  cursor: default;
  color: gray;
}
</style>