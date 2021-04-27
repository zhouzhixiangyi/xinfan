<template>
  <div class="form-area">
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="formRef"
      enctype="multipart/form-data"
      :rules="rules"
    >
      <a-form-item label="收到时间" name="receivedTime">
        <a-date-picker
          v-model:value="formState.receivedTime"
          show-time
          
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="来信来访人" name="name">
        <a-input
          v-model:value="formState.name"
         
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="来访人人数" name="personCount">
        <a-input
          v-model:value="formState.personCount"
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="是否重复访" name="isRepeated">
        <a-select
          v-model:value="formState.isRepeated"
          :disabled="true"
          
        >
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="单位" name="company">
        <a-input
          v-model:value="formState.company"
          
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="身份证号" name="identityNumber" :disabled="true">
        <a-input
          v-model:value="formState.identityNumber"
          
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="联系方式" name="tel">
        <a-input
          v-model:value="formState.tel"
          
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="家庭住址" name="address">
        <a-input
          v-model:value="formState.address"
          
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="社会关系" name="socialRelationship">
        <a-input
          v-model:value="formState.socialRelationship"
          
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="主要诉求" name="mainAppeal">
        <a-textarea
          v-model:value="formState.mainAppeal"
         
          :rows="5"
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="接访人" name="receptionist">
        <a-input
          v-model:value="formState.receptionist"
         
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="处理时间" name="handledTime">
        <a-date-picker
          v-model:value="formState.handledTime"
          show-time
     
          :disabled="true"
        />
      </a-form-item>

      <a-form-item label="处理意见" name="opinions">
           <a-textarea
          v-model:value="formState.opinions"
          placeholder="请输入处理意见"
          :rows="5"
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="是否终结" name="isEnd">
        <a-select
          v-model:value="formState.isEnd"
          :disabled="true"
        >
          <a-select-option :value="true">已终结</a-select-option>
          <a-select-option :value="false">未终结</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="反映渠道" name="appealWaysToDisplay">
        <a-select
          v-model:value="formState.appealWaysToDisplay"
          :disabled="true"
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
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-input
          v-model:value="formState.remark"
          :disabled="true"
        />
      </a-form-item>
      <!-- <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit" :loading="uploading">{{
        uploading ? "正在上传" : "保存并上传数据"
      }}</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item> -->
    </a-form>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { getInfosById } from "@/api/info";
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    let formState = ref({
      receivedTime: "",
      name: "",
      personCount: 0,
      isRepeated: false,
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
      relatedMaterials: null,
    });

    const route = useRoute();
    const router = useRouter();
    console.log(router);

    document.title = "查看信息";
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
    }
    return {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
      formState,
    };
  },
});
</script>
<style lang='less'>
.form-area {
  margin-top: 20px;
  height: calc(100vh - 220px);
  overflow-y: auto;
  .small-item {
    width: 450px;
  }
}
</style>