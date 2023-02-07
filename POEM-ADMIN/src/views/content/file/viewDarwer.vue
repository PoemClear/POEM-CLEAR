<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="文件下载"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <Image
      v-if="type == 'image'"
      :src="url"
      fallback="https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/1675144320527.png"
    />
    <video preload="auto" loop autoplay muted v-else-if="type == 'video'">
      <source :src="url" type="video/mp4" />
    </video>
    <a-button type="primary" class="my-4" @click="handleDownloadByUrl" v-else>
      文件地址下载
    </a-button>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import { Image } from 'ant-design-vue';
  export default defineComponent({
    components: { BasicModal, Image },
    setup() {
      const type = ref('');
      const url = ref('');
      const [register] = useModalInner((data) => {
        console.log(data.record.value);
        url.value = data.record.url;
        type.value = data.record.type;
        console.log(url);
      });
      function handleDownloadByUrl() {
        downloadByUrl({
          url: url.value,
          target: '_self',
        });
      }

      return {
        register,
        url,
        type,
        handleDownloadByUrl,
      };
    },
  });
</script>
