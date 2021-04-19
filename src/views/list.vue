<template>
  <div class="data-table">
    <a-form layout="inline" :model="formState">
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
          <a-list size="small" bordered :data-source="record.relatedMaterials">
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
                  >{{ item.fileName }}</a
                >
                <a
                  @click="deletefile(item.xinfangBasicInformationId, item.id)"
                  class="delete-icon"
                  ><DeleteOutlined /></a
              ></a-list-item>
            </template>
          </a-list>

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
            <a-button
              type="primary"
              :disabled="fileList.length === 0"
              :loading="uploading"
              style="margin-top: 16px"
              @click="handleUpload(record.id,record)"
            >
              {{ uploading ? "正在上传" : "点击上传" }}
            </a-button>
          </a-upload>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
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
const columns = [
  {
    title: "序号",
    width: 60,
    customRender: ({ index }) => `${index + 1}`,
    fixed: "left",
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

export default defineComponent({
  components: {
    DeleteOutlined,
  },
  setup() {
    const router = useRouter();
    const fileList = ref([]);
    const uploading = ref(false);
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
      console.log("------------------");
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
          item.receivedTime = Moment(item.receivedTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          item.handledTime = Moment(item.handledTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          _res.push(Object.assign({}, item, { key: index, index: index + 1 }));
          return _res;
        })
      );
      console.log(results);

      console.log(_res);
      data.value = _res;
      console.log(data.value);
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
        router.go(0)
      } else {
        message.error("删除失败！");
      }
    };

    const deletefile = async (basicInfoId, id) => {
      const res = await deleteFileById(basicInfoId, id);
      if (res.status == 204) {
        message.success("删除成功");
        router.go(0)
      } else {
        message.error("删除失败");
      }
    };
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

    const handleUpload = async (id, record) => {
      // 添加文件
      const formData = new FormData();
      // console.log(id)
      
      const existsFilenams = [];
      record.relatedMaterials.forEach((item) => {
        existsFilenams.push(item.fileName);
      })
      // console.log(existsFilenams);

      let flag = false;

      fileList.value.forEach((file) => {
        if(existsFilenams.includes(file.name)){
          flag = true;
        }
        formData.append("formData", file);
      });
      if(flag){
        return message.error('不能上传文件名一样的文件！')
      }
      console.log(formData);
      uploading.value = true; // You can use any AJAX library you like

      formData.append("basicInfoId", id);
      const result = await addFilesById(id, formData);
      console.log(result);
      if (result.status == 204) {
        fileList.value = [];
        uploading.value = false;
        message.success("上传成功");
        router.go(0)
      } else {
        uploading.value = false;
        message.error("上传失败");
      }
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
    .delete-icon {
      float: right;
    }
    .upload {
      float: right;
    }
  }
}
</style>