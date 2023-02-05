<template>
  <PageWrapper :title="`文章： ${info.title}`" contentBackground @back="goBack">
    <template #extra>
      <a-button type="primary" preIcon="ant-design:eye-outlined"
        >浏览：{{ info.view_count }}
      </a-button>
      <a-button type="primary" color="error" preIcon="ant-design:heart-outlined">
        点赞：{{ info.like_count }}
      </a-button>
      <a-button type="primary" color="success" preIcon="ant-design:star-outlined">
        收藏：{{ info.collect_count }}
      </a-button>
      <a-button type="primary" color="warning" preIcon="ant-design:message-outlined">
        评论：{{ info.comment_count }}
      </a-button>
    </template>
    <template #footer>
      <div style="display: flex">
        <div class="tag image">
          封面：
          <Image
            :width="60"
            :height="30"
            :src="info.cover"
            fallback="https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/1675144320527.png"
          />
        </div>
        <div class="tag" v-if="info.cateId">
          专栏：

          <Tag color="green" class="mb-2"> {{ info.cate_title }} </Tag>
        </div>
        <div class="tag">
          标签：
          <template v-for="tag in info.label_title" :key="tag">
            <Tag color="orange" class="mb-2"> {{ tag }} </Tag>
          </template>
        </div>
      </div>
    </template>
    <div v-if="info.type == '1'">
      <MarkDown v-model:value="info.content" ref="markDownRef" placeholder="这是占位文本" />
    </div>
    <div v-else>
      <Tinymce v-model="info.content" width="100%" :disabled="true" />
    </div>
  </PageWrapper>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { getPostItem } from '/@/api/content/blog';
  import { MarkDown } from '/@/components/Markdown';
  import { Tinymce } from '/@/components/Tinymce/index';
  import { Tag, Image } from 'ant-design-vue';
  export default defineComponent({
    name: 'AccountDetail',
    components: { PageWrapper, MarkDown, Tinymce, Tag, Image },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到文章ID
      const id = ref(route.params?.id);
      const currentKey = ref('detail');
      const { setTitle } = useTabs();
      const info = ref({});
      // TODO
      // 本页代码仅作演示，实际应当通过userId从接口获得文章的相关资料
      async function getInfo() {
        let data = await getPostItem(id.value);
        console.log(data, 123);
        info.value = data.items;
        setTitle(`文章：${data.items.title}`);
      }
      // 设置Tab的标题（不会影响页面标题）

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/content/post');
      }
      onMounted(async () => {
        await getInfo();
      });
      return { id, currentKey, goBack, info };
    },
  });
</script>

<style lang="less" scoped>
  .tag {
    margin-right: 30px;
    padding: 10px 0;
  }

  .image {
    display: flex;
    align-content: center;
    vertical-align: middle;
  }
</style>
