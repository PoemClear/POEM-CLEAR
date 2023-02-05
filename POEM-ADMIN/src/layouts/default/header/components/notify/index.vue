<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList :list="item.list" v-if="item.key != 3" @title-click="onNoticeClick" />
              <NoticeList :list="item.list" v-else />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
    <Modal2 @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import Modal2 from './Modal2.vue';
  import { ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getNoticeMessageList, noticeRead } from '/@/api/notice';
  import { useModal } from '/@/components/Modal';
  import { useUserStore } from '/@/store/modules/user';
  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList, Modal2 },
    setup() {
      const [register, { openModal }] = useModal();
      const userStore = useUserStore();
      const getUserInfo = computed(() => {
        const { roleValue, id } = userStore.getUserInfo || {};
        return { roleValue, id };
      });
      const { prefixCls } = useDesign('header-notify');
      const listData = ref([]);
      const count = ref(0);
      // const count = computed(() => {
      //   let count = 0;
      //   for (let i = 0; i < listData.value.length; i++) {
      //     count += listData[i].list.length;
      //   }
      //   return count;
      // });

      async function onNoticeClick(record: ListItem) {
        // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
        record.titleDelete = !record.titleDelete;
        let data = {
          noticeId: record.id,
          userId: getUserInfo.value.id,
        };
        await noticeRead(data);

        getNoticeListData();
        openModal(false, { data: record });
      }
      async function getNoticeListData() {
        let res = await getNoticeMessageList();
        listData.value = res.items || [];
        count.value = res.count || 0;
      }
      getNoticeListData();

      return {
        prefixCls,
        listData,
        onNoticeClick,
        count,
        numberStyle: {},
        register,
        openModal,
        getUserInfo,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      width: 400px;
    }

    .ant-tabs-content {
      width: 400px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
