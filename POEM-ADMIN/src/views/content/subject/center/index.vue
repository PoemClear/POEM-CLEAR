<template>
  <PageWrapper :title="`专题： ${info.title}`" contentBackground @back="goBack" />
  <div :class="prefixCls">
    <a-row :class="`${prefixCls}-top`">
      <a-col :span="24" :class="`${prefixCls}-col`">
        <a-row>
          <a-col :span="4">
            <div :class="`${prefixCls}-top__avatar`">
              <Image :width="260" :height="160" :src="info.cover" />
            </div>
          </a-col>
          <a-col :span="20">
            <div :class="`${prefixCls}-top__detail`">
              <p class="title">{{ info.title }}</p>
              <div>
                <p>专题简介：{{ info.description }}</p>
                <div style="display: flex">
                  <p class="count">文章数：{{ info.num }}</p>
                  <p class="count"> 关注数：{{ info.like_count }}</p>
                  <p class="count">浏览量：{{ info.view_count }}</p>
                  <p class="count">收藏量：{{ info.collect_count }}</p>
                </div>
                <div style="display: flex; align-items: center">
                  作者：
                  <Avatar :src="info.avatar" :size="20" style="margin-right: 10px" />
                  {{ info.author }}
                </div>
                <!-- <p> 这个作者很懒，什么都没留下… </p> -->
              </div>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div :class="`${prefixCls}-bottom`">
      <List :class="prefixClsProject">
        <a-row :gutter="16">
          <template v-for="item in info.children" :key="item.title">
            <a-col :span="6">
              <ListItem>
                <Card :hoverable="true" :class="`${prefixCls}__card`">
                  <Image
                    :height="130"
                    :src="item.cover"
                    fallback="https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/1675144320527.png"
                  />
                  <div :class="`${prefixCls}__card-title`">
                    {{ item.title }}
                  </div>
                  <div :class="`${prefixCls}__card-content`">
                    <span>浏览{{ item.view_count }}</span>
                    <span>点赞{{ item.like_count }}</span>
                    <span>收藏{{ item.collect_count }}</span>
                    <span>评论{{ item.comment_count }}</span>
                  </div>
                </Card>
              </ListItem>
            </a-col>
          </template>
        </a-row>
      </List>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import headerImg from '/@/assets/images/header.jpg';
  import { tags, teams, details, achieveList } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { getSubjectItem } from '/@/api/content/subject';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { List, Card, Row, Col, Image, Avatar } from 'ant-design-vue';
  export default defineComponent({
    components: {
      List,
      ListItem: List.Item,
      Card,
      [Row.name]: Row,
      [Col.name]: Col,
      Image,
      Avatar,
      PageWrapper,
    },
    setup() {
      const userStore = useUserStore();
      const route = useRoute();
      const go = useGo();
      const { setTitle } = useTabs();
      let id = ref(route.params?.id);
      const avatar = computed(() => userStore.getUserInfo.avatar || headerImg);
      let info = ref({});
      // 此处可以得到文章ID

      async function getInfo() {
        let data = await getSubjectItem(id.value);
        console.log(data, 123);
        info.value = data.items;
        setTitle(`专题：${data.items.title}`);
      }
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/content/subject');
      }
      onMounted(async () => {
        await getInfo();
      });
      return {
        prefixCls: 'account-center',
        prefixClsProject: 'account-center-project',
        avatar,
        tags,
        teams,
        details,
        achieveList,
        id,
        getInfo,
        info,
        goBack,
      };
    },
  });
</script>
<style lang="less" scoped>
  .account-center {
    &-col:not(:last-child) {
      padding: 0 10px;

      &:not(:last-child) {
        border-right: 1px dashed rgb(206 206 206 / 50%);
      }
    }

    &-top {
      padding: 10px;
      margin: 16px 16px 12px;
      background-color: @component-background;
      border-radius: 3px;

      &__detail {
        padding-left: 20px;
      }

      .title {
        font-size: 20px;
        font-weight: 500;
      }
    }

    &-bottom {
      padding: 10px;
      margin: 0 16px 16px;
      border-radius: 3px;
    }

    .count {
      margin-right: 50px;
    }
  }

  .account-center-project {
    &__card {
      width: 100%;

      .ant-card-body {
        padding: 0 0 24px;
      }

      &-title {
        margin: 5px 10px;
        font-size: 24px;
        font-weight: 500;
        color: rgb(0 0 0 / 85%);
      }

      &-content {
        margin: 5px 10px;
        // width: 100%;
        // display: flex;
        // justify-content: space-between;
      }
    }

    span {
      margin-right: 20px;
      font-size: 12px;
    }
  }
</style>
