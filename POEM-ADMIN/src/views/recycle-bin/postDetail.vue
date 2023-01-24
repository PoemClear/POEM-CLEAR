<template>
  <PageWrapper
    :title="`文章： ${info.title}`"
    :content="`${info.description}`"
    contentBackground
    @back="goBack"
  >
    <template #extra>
      <a-button type="primary" danger> 禁用账号 </a-button>
      <a-button type="primary"> 修改密码 </a-button>
    </template>
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="文章资料" />
        <a-tab-pane key="logs" tab="操作日志" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'detail'">
        <div v-for="i in 10" :key="i">这是文章{{ info.title }}资料Tab</div>
      </template>
      <template v-if="currentKey == 'logs'">
        <div v-for="i in 10" :key="i">这是文章{{ info.title }}操作日志Tab</div>
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
  import { Tabs } from 'ant-design-vue';
  import { getPostItem } from '/@/api/blog';
  export default defineComponent({
    name: 'AccountDetail',
    components: { PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane },
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
        go('/blog/post');
      }
      onMounted(async () => {
        await getInfo();
      });
      return { id, currentKey, goBack, info };
    },
  });
</script>

<style></style>
