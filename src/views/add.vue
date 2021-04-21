<template>
  <div class="form-area">
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
      :rules="rules"
      enctype="multipart/form-data"
    >
      <a-form-item label="收到时间" name="receivedTime">
        <a-date-picker
          v-model:value="formState.receivedTime"
          show-time
          placeholder="请选择时间"
        />
      </a-form-item>
      <a-form-item label="来信来访人" name="name">
        <a-input
          v-model:value="formState.name"
          placeholder="请输入来信来访人"
        />
      </a-form-item>
      <a-form-item label="单位" name="company">
        <a-input v-model:value="formState.company" placeholder="请输入单位" />
      </a-form-item>
      <a-form-item label="身份证号" name="identityNumber">
        <a-input
          v-model:value="formState.identityNumber"
          placeholder="请输入身份证号"
        />
      </a-form-item>
      <a-form-item label="联系方式" name="tel">
        <a-input v-model:value="formState.tel" placeholder="请输入联系方式" />
      </a-form-item>
      <a-form-item label="家庭住址" name="address">
        <a-input
          v-model:value="formState.address"
          placeholder="请输入家庭住址"
        />
      </a-form-item>
      <a-form-item label="社会关系" name="socialRelationship">
        <a-input
          v-model:value="formState.socialRelationship"
          placeholder="请输入社会关系"
        />
      </a-form-item>
      <a-form-item label="主要诉求" name="mainAppeal">
        <a-textarea
          v-model:value="formState.mainAppeal"
          placeholder="请输入主要诉求"
          :rows="5"
        />
      </a-form-item>
      <a-form-item label="接访人" name="receptionist">
        <a-input
          v-model:value="formState.receptionist"
          placeholder="请输入接访人"
        />
      </a-form-item>
      <a-form-item label="处理时间" name="handledTime">
        <a-date-picker
          v-model:value="formState.handledTime"
          show-time
          placeholder="请选择时间"
        />
      </a-form-item>

      <a-form-item label="处理意见" name="opinions">
        <a-input
          v-model:value="formState.opinions"
          placeholder="请输入处理意见"
        />
      </a-form-item>
      <a-form-item label="是否终结" name="isEnd">
        <a-select v-model:value="formState.isEnd" placeholder="请输入是否终结">
          <a-select-option :value="true">已终结</a-select-option>
          <a-select-option :value="false">未终结</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="反映渠道" name="appealWaysToDisplay">
        <a-select
          v-model:value="formState.appealWaysToDisplay"
          placeholder="请输入反应渠道"
        >
          <a-select-option :value="1">来信</a-select-option>
          <a-select-option :value="2">来访</a-select-option>
          <a-select-option :value="3">上级转办</a-select-option>
          <a-select-option :value="4">政府热线</a-select-option>
          <a-select-option :value="5">其他</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="包案领导" name="leader">
        <a-input
          v-model:value="formState.leader"
          placeholder="请输入包案领导"
        />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-input v-model:value="formState.remark" placeholder="请输入备注" />
      </a-form-item>
      <a-form-item v-show="!(route.params && route.params.id)" label="附件材料">
        <a-upload
          :file-list="fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          :multiple="true"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            Select File
          </a-button>
          <!-- <a-button
            type="primary"
            :disabled="fileList.length === 0"
            :loading="uploading"
            style="margin-top: 16px"
            @click="handleUpload"
          >
            {{ uploading ? "Uploading" : "Start Upload" }}
          </a-button> -->
        </a-upload>
      </a-form-item>
    </a-form>
    <div class="submit-button">
      <a-button type="primary" @click="onSubmit" :loading="uploading">{{
        uploading ? "正在上传" : "保存并上传数据"
      }}</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </div>
  </div>
</template>
<script>
import { UploadOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getInfosById, addInfo, editInfo, addFilesById } from "@/api/info";
import Moment from "moment";
import { message } from "ant-design-vue";

export default defineComponent({
  components: {
    UploadOutlined,
  },
  setup() {
    const formRef = ref();
    const route = useRoute();
    const router = useRouter();

    // 文件上传
    const fileList = ref([]);
    const uploading = ref(false);

    let formState = ref({
      receivedTime: "",
      name: "",
      company: "",
      identityNumber: "",
      tel: "",
      address: "",
      socialRelationship: "",
      mainAppeal: "",
      receptionist: "",
      handledTime: "",
      opinions: "",
      isEnd: "",
      appealWaysToDisplay: "",
      leader: "",
      remark: "",
      relatedMaterials: null
    });

    // 验证规则
    const rules = {
      receivedTime: [{ required: true, message: "收到时间不能为空" }],
      name: [
        { required: true, trigger: "blur", message: "来信来访人不能为空" },
      ],
      // company: [{ required: true, trigger: "blur" }],
      identityNumber: [
        { required: true, trigger: "blur", message: "身份证号不能为空" },
        { len: 18, message: "身份证号只能是18位", trigger: "blur" },
      ],
      tel: [
        { required: true, trigger: "blur", message: "联系方式不能为空" },
        { max: 11, message: "联系方式不能超过11位", trigger: "blur" },
      ],
      // address: [{ required: true, trigger: "blur" }],
      // socialRelationship: [{ required: true, trigger: "blur" }],
      mainAppeal: [
        { required: true, trigger: "blur", message: "主要诉求不能为空" },
      ],
      // receptionist: [{ required: true, trigger: "blur" }],
      handledTime: [{ required: true, message: "处理时间不能为空" }],
      opinions: [{ required: true, trigger: "blur", message: "建议不能为空" }],
      isEnd: [{ required: true, message: "是否结束不能为空" }],
      appealWaysToDisplay: [{ required: true, message: "来访方式不能为空" }],
      // leader: [{ required: true, trigger: "blur" }],
      // remark: [{ required: true, trigger: "blur" }],
    };
    document.title = "添加数据";

    //发送请求获取信息
    const getInfoById = async (id) => {
      let res = await getInfosById(id);
      res = res.data;
      // console.log(res);
      // 根据上诉方式的字符串确定它的值
      const val = ["来信", "来访", "上级转办", "政府热线", "其他"].findIndex(
        (i) => i == res.appealWaysToDisplay
      );

      formState.value = res;
      formState.value.appealWaysToDisplay = val + 1;
      // console.log(formState.value);
    };

    if (route.params && route.params.id) {
      const id = route.params.id;
      // console.log(id);
      // 有id的话就是修改，获取它的信息
      getInfoById(id);
      document.title = "修改信息";
    }

    // console.log(router);

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
    // 添加方法
    const addInfos = async () => {
      message.loading("正在执行...", 1.5).then(async () => {
        // 添加信息

        formState.value.appealWays = formState.value.appealWaysToDisplay;

        // console.log("------------000");
        console.log(formState.value);
        const res = await addInfo(formState.value);
        // console.log(res);
        const id = res.data;

        // 添加文件
        const formData = new FormData();
        fileList.value.forEach((file) => {
          formData.append("formData", file);
        });
        // conssole.log(formData);
        uploading.value = true; // You can use any AJAX library you like

        formData.append("basicInfoId", id);
        const result = await addFilesById(id, formData);

        if (result.status == 204) {
          fileList.value = [];
          uploading.value = false;
          message.success("保存成功");
          router.push("/list");
        } else {
          uploading.value = false;
          message.error("保存失败");
        }
        // console.log(result);

        // console.log(result);

        // // 文件上传
        // const formData = new FormData();
        // fileList.value.forEach((file) => {
        //   formData.append("file[]", file);
        // });
        // uploading.value = true; // You can use any AJAX library you like

        // // request("https://www.mocky.io/v2/5cc8019d300000980a055e76", {
        // //   method: "post",
        // //   data: formData,
        // // })
        // //   .then(() => {
        // //     fileList.value = [];
        // //     uploading.value = false;
        // //     message.success("upload successfully.");
        // //   })
        // //   .catch(() => {
        // //     uploading.value = false;
        // //     message.error("upload failed.");
        // //   });
        // console.log(formData);

        // addInfoAndFiles(formState.value, formData)
        //   .then((res) => {
        //     console.log(res);
        //     fileList.value = [];
        //     uploading.value = false;
        //     // message.success("upload successfully.");
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     uploading.value = false;
        //     // message.error("upload failed.");
        //   });

        // // const res = await addInfo(formState.value);
        // // console.log(res);
        // // if (res.status == 201) {
        // //   message.success("添加成功！");
        // //   router.push("/list");
        // // } else {
        // //   message.error("添加失败！");
        // // }
      });
    };

    // 修改方法
    const editInfoById = async () => {
      message.loading("正在执行...", 1.5).then(async () => {
        const info = formState.value;
        let jsonInfo = [];

        Object.keys(info).forEach(function (key) {
          if (key != "id" && key != "appealWaysToDisplay") {
            // if(key == 'appealWaysToDisplay') key = 'appealWays'
            jsonInfo.push({
              op: "replace",
              path: `/${key}`,
              value: `${info[key]}`,
            });
          }
          //console.log(key, info[key]);
        });
        jsonInfo.push({
          op: "replace",
          path: `/appealWays`,
          value: `${info["appealWaysToDisplay"]}`,
        });
        // console.log(jsonInfo);

        const res = await editInfo(formState.value.id, jsonInfo);
        // console.log(res);
        if (res.status == 204) {
          message.success("修改成功！");
          router.push("/list");
        } else {
          message.error("修改失败！");
        }
      });
    };

    const onSubmit = () => {
      const rTime = Moment(formState.value.receivedTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      formState.value.receivedTime = rTime;
      const hTime = Moment(formState.value.handledTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      formState.value.handledTime = hTime;
      formRef.value
        .validate()
        .then(() => {
          console.log(formState.value);
          // formState中有Id就修改，没有就添加
          if (formState.value.id) {
            editInfoById();
          } else {
            addInfos();
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    // const handleUpload = () => {
    //   const formData = new FormData();
    //   fileList.value.forEach((file) => {
    //     formData.append("files[]", file);
    //   });
    //   uploading.value = true; // You can use any AJAX library you like

    //   request("https://www.mocky.io/v2/5cc8019d300000980a055e76", {
    //     method: "post",
    //     data: formData,
    //   })
    //     .then(() => {
    //       fileList.value = [];
    //       uploading.value = false;
    //       message.success("upload successfully.");
    //     })
    //     .catch(() => {
    //       uploading.value = false;
    //       message.error("upload failed.");
    //     });
    // };

    return {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      formState,
      onSubmit,
      rules,
      resetForm,
      formRef,
      route,
      fileList,
      uploading,
      handleRemove,
      beforeUpload,
      // handleUpload,
    };
  },
});
</script>
<style lang='less'>
.form-area {
  margin-top: 20px;
  height: 500px;
  overflow-y: auto;
  .small-item {
    width: 450px;
  }
  .submit-button {
    position: fixed;
    margin: auto;
    left: 700px;
    right: 0;
    //top: 0;
    bottom: 42px;
  }
}
</style>