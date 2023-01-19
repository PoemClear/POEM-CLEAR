<template>
  <PageWrapper :title="`文章： ${info.title}`" contentBackground @back="goBack">
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="专题详情" />
        <a-tab-pane key="logs" tab="文章列表" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'detail'">
        <Image :width="200" :height="200" :src="info.cover" />
        <p>专题简介：{{ info.description }}</p>
        <p
          ><span>文章数：{{ info.num }}</span
          ><span>关注数：0 </span><span>文章阅读量：2344</span><span>文章收藏量：0</span></p
        >
        <p> 作者: volit_</p>
        <p> 这个作者很懒，什么都没留下… </p>
      </template>
      <template v-if="currentKey == 'logs'">
        <a-row :gutter="16" justify="space-around">
          <a-col class="gutter-row" :span="6" v-for="(v, i) in info.children" :key="i">
            <a-card>
              {{ v.title }}
            </a-card>
          </a-col>
        </a-row>
      </template>
    </div>
  </PageWrapper>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Tabs, Image, Card } from 'ant-design-vue';
  import { getSubjectItem } from '/@/api/subject';
  export default defineComponent({
    name: 'AccountDetail',
    components: { PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane, Image, ACard: Card },
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
        let data = await getSubjectItem(id.value);
        console.log(data, 123);
        info.value = data.items;
        setTitle(`文章：${data.items.title}`);
      }
      // 设置Tab的标题（不会影响页面标题）

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/blog/post');
      }
      onMounted(async () => {
        await getInfo();
      });
      return { id, currentKey, goBack, info };
    },
  });
</script>

<style scoped>
  span {
    margin-right: 30px;
  }
</style>
