<template>
  <!-- showFooter -->
  <BasicDrawer v-bind="$attrs" @register="register" width="70%">
    <div id="preview"></div
  ></BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Vditor from 'vditor';
  import VditorPreview from 'vditor/dist/method.min';
  VditorPreview.mermaidRender(document);
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { getPostItem } from '/@/api/content/blog';
  export default defineComponent({
    components: { BasicDrawer },
    setup() {
      const content = ref('');
      const [register] = useDrawerInner(async (data) => {
        let result = await getPostItem(data.record.id);
        content.value = result.items.content;
        initRender(content.value);
      });

      function initRender(markdown) {
        Vditor.preview(document.getElementById('preview'), markdown, {
          speech: {
            enable: true,
          },
          anchor: 0,
          outline: {
            enable: true,
            position: 'left',
          },
          lazyLoadImage: 'https://ld246.com/images/img-loading.svg',
          // after() {
          //   if (window.innerWidth <= 768) {
          //     return;
          //   }
          //   const outlineElement = document.getElementById('outline');
          //   Vditor.outlineRender(document.getElementById('preview'), outlineElement);
          //   if (outlineElement.innerText.trim() !== '') {
          //     outlineElement.style.display = 'block';
          //     initOutline();
          //   }
          // },
        });
      }

      return { register };
    },
  });
</script>
