<template>
  <PageWrapper :title="`文章： ${info.title}`" contentBackground @back="goBack">
    <div style="padding: 20px; display: flex">
      <div style="margin-right: 40px">
        <Image :width="300" :height="180" :src="info.cover" />
      </div>
      <div>
        <p>专题简介：{{ info.description }}</p>
        <p>
          <span class="count">文章数：{{ info.num }}</span>
          <span class="count"> 关注数：{{ info.like_count }}</span>
          <span class="count">文章浏览量：{{ info.view_count }}</span>
          <span class="count">文章收藏量：{{ info.collect_count }}</span>
        </p>
        <div style="display: flex; align-items: center">
          作者:
          <Avatar :src="info.avatar" :size="24" />
          <Button type="link" primary>{{ info.author }}</Button>
        </div>
        <p> 这个作者很懒，什么都没留下… </p>
      </div>
    </div>
    <div> </div>
    <!-- <a-row :gutter="16" justify="space-around">
      <a-col class="gutter-row" :span="6" v-for="(v, i) in info.children" :key="i">
        <a-card>
          {{ v.title }}
        </a-card>
      </a-col>
    </a-row> -->
  </PageWrapper>
  <!-- <a-row :gutter="16" justify="space-around">
    <a-col class="gutter-row" :span="6" v-for="(v, i) in info.children" :key="i">
      <a-card>
        {{ v.title }}
      </a-card>
    </a-col>
  </a-row> -->
  <List :class="prefixCls" style="padding: 20px">
    <a-row :gutter="16">
      <template v-for="item in info.children" :key="item.title">
        <a-col :span="5">
          <ListItem>
            <Card :hoverable="true" :class="`${prefixCls}__card`">
              <Image :width="100" :height="60" :src="item.cover" />
              <div :class="`${prefixCls}__card-title`">
                {{ item.title }}
              </div>
              <div :class="`${prefixCls}__card-content`">
                <!-- {{ item.content }} -->
              </div>
            </Card>
          </ListItem>
        </a-col>
      </template>
    </a-row>
  </List>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Avatar, Image, Button, List, Card, Row, Col } from 'ant-design-vue';
  import { getSubjectItem } from '/@/api/content/subject';
  export default defineComponent({
    name: 'AccountDetail',
    components: {
      PageWrapper,
      Image,
      Avatar,
      Button,
      List,
      ListItem: List.Item,
      Card,
      [Row.name]: Row,
      [Col.name]: Col,
    },
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
      return { id, currentKey, goBack, info, prefixCls: 'account-center-project' };
    },
  });
</script>

<style scoped>
  .count {
    margin-right: 30px;
  }
</style>
