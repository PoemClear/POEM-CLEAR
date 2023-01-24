<template>
  <BasicModal @register="register" title="请选择编辑器" :showOkBtn="false" :showCancelBtn="false">
    <a-button type="primary" @click="tinymce" class="mr-2"> 富文本编辑器 </a-button>
    <a-button type="primary" @click="markdown"> Markdown编辑器 </a-button>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useGo } from '/@/hooks/web/usePage';
  export default defineComponent({
    components: { BasicModal },
    setup() {
      const [register] = useModalInner();
      const go = useGo();
      function tinymce() {
        go('/blog/write/tinymce/tinymce');
      }
      function markdown() {
        go('/blog/write/markdown/markdown');
      }
      return {
        register,
        tinymce,
        markdown,
      };
    },
  });
</script>
