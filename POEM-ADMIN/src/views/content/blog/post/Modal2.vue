<template>
  <BasicModal @register="register" title="请选择编辑器" :showOkBtn="false" :showCancelBtn="false">
    <a-button type="primary" @click="goTo('tinymce')" class="mr-2"> 富文本编辑器 </a-button>
    <a-button type="primary" @click="goTo('markdown')"> Markdown编辑器 </a-button>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  export default defineComponent({
    emits: ['goto'],
    components: { BasicModal },
    setup(_, { emit }) {
      const [register] = useModalInner();
      function goTo(type: string) {
        emit('goto', type);
      }
      return {
        register,
        goTo,
      };
    },
  });
</script>
