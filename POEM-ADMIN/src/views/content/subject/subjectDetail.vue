<template>
  <PageWrapper :title="`专栏： ${info.title || '没有专题了'}`" contentBackground @back="goBack" />
  <div :class="prefixCls" v-if="info.title">
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
                <p>专栏简介：{{ info.description }}</p>
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
    <div class="md:flex" :class="`${prefixCls}-bottom`">
      <template v-for="(item, index) in info.children" :key="item.title">
        <Card
          size="small"
          :loading="loading"
          class="md:w-1/4 w-full !md:mt-0 item"
          :class="{ '!md:mr-4': index + 1 < 4, '!mt-4': index > 0 }"
          @click="handlePostDetail(item)"
        >
          <Image
            :height="130"
            :src="item.cover"
            fallback="https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/1675144320527.png"
          />
          <div :class="`${prefixCls}__card-title`">
            {{ item.title }}
          </div>
          <div class="tag" style="margin: 4px 0">
            <template v-for="tag in item.label_title" :key="tag">
              <Tag color="orange" class="mb-2"> {{ tag }} </Tag>
            </template>
          </div>
          <div :class="`${prefixCls}__card-content`">
            <span>浏览{{ item.view_count }}</span>
            <span>点赞{{ item.like_count }}</span>
            <span>收藏{{ item.collect_count }}</span>
            <span>评论{{ item.comment_count }}</span>
          </div>
        </Card>
      </template>
    </div>
    <viewDarwer @register="registerView" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { useDrawer } from '/@/components/Drawer';
  import { getSubjectItem } from '/@/api/content/subject';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { List, Card, Row, Col, Image, Avatar, Tag } from 'ant-design-vue';
  import viewDarwer from '../viewDarwer.vue';
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
      Tag,
      viewDarwer,
    },
    setup() {
      const userStore = useUserStore();
      const route = useRoute();
      const loading = ref(true);
      const go = useGo();
      const [registerView, { openDrawer: openDrawerView }] = useDrawer();
      const { setTitle } = useTabs();
      let id = ref(route.params?.id);
      const avatar = computed(() => userStore.getUserInfo.avatar);
      let info = ref({});
      // 此处可以得到文章ID
      async function getInfo() {
        let data = await getSubjectItem(id.value);
        console.log(data, 123);
        info.value = data.items;
        loading.value = false;
        setTitle(`专栏：${data.items.title}`);
      }
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/content/subject');
      }
      function handlePostDetail(record) {
        openDrawerView(true, {
          record,
          isUpdate: true,
        });
        // go('/content/post/post_detail/' + id);
      }
      onMounted(async () => {
        await getInfo();
      });
      return {
        prefixCls: 'account-center',
        prefixClsProject: 'account-center-project',
        avatar,
        registerView,
        handlePostDetail,
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

  .account-center-bottom {
    .item {
      cursor: pointer;
    }

    span {
      margin-right: 20px;
      font-size: 12px;
    }
  }
</style>
