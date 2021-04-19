
<template>
  <div class="clearfix">
    <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
      <a-button>
        <upload-outlined></upload-outlined>
        Select File
      </a-button>
    </a-upload>
    <a-button
      type="primary"
      :disabled="fileList.length === 0"
      :loading="uploading"
      style="margin-top: 16px"
      @click="handleUpload"
    >
      {{ uploading ? 'Uploading' : 'Start Upload' }}
    </a-button>
  </div>
</template>
<script>
import request from 'umi-request';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: {
    UploadOutlined,
  },

  setup() {
    const fileList = ref([]);
    const uploading = ref(false);

    const handleRemove = file => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };

    const beforeUpload = file => {
      fileList.value = [...fileList.value, file];
      return false;
    };

    const handleUpload = () => {
      let formData = new FormData();
      fileList.value.forEach(file => {
        formData.append('formData', file);
      });
      uploading.value = true; // You can use any AJAX library you like

      formData.append('basicInfoId', '539c08a2-766b-45f8-a6df-228b3daee8bd')

      request('http://192.168.0.104:5000/api/xinfangBasicInformations/'+'539c08a2-766b-45f8-a6df-228b3daee8bd'+'/xinfangRelatedMaterials', {
        method: 'post',
        data: formData,
      })
        .then((res) => {
          console.log(res)
          fileList.value = [];
          uploading.value = false;
          message.success('upload successfully.');
        })
        .catch(() => {
          uploading.value = false;
          message.error('upload failed.');
        });
    };

    return {
      fileList,
      uploading,
      handleRemove,
      beforeUpload,
      handleUpload,
    };
  },
});
</script>