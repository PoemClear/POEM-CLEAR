<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 写文章</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'view_count'">
          {{ record.view_count }} / {{ record.like_count }} / {{ record.comment_count }} /
          {{ record.collect_count }}
        </template>
        <template v-if="column.key === 'cover'">
          <Image
            :width="60"
            :height="30"
            :src="record.cover"
            fallback="https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/1675144320527.png"
          />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:clock-circle-outlined',
                tooltip: '审核',
                color: 'warning',
                disabled: getUserInfo.roleValue == 'RegularMembers',
                popConfirm: {
                  title: '是否审核改文章',
                  placement: 'left',
                  cancelText: '不通过',
                  okText: '通过',
                  confirm: handleCheckSuccess.bind(null, record),
                  cancel: handleCheckFail.bind(null, record),
                },
              },
              {
                icon: 'clarity:info-standard-line',
                tooltip: '查看详情',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否移入回收站',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <PostDrawer @register="registerDrawer" @success="handleSuccess" />
    <viewDarwer @register="registerView" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getPostList, upDatePostRecycle, updateCheckPost } from '/@/api/content/blog';
  import { useDrawer } from '/@/components/Drawer';
  import { columns, searchFormSchema } from './post.data';
  import { Image } from 'ant-design-vue';
  import PostDrawer from './PostDrawer.vue';
  import viewDarwer from '../viewDarwer.vue';
  import { useUserStore } from '/@/store/modules/user';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, Image, PostDrawer, viewDarwer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerView, { openDrawer: openDrawerView }] = useDrawer();

      const userStore = useUserStore();
      const getUserInfo = computed(() => {
        const { roleValue } = userStore.getUserInfo || {};
        return { roleValue };
      });
      const [registerTable, { reload }] = useTable({
        title: '文章列表',
        api: getPostList,
        columns,
        pagination: { pageSize: 10 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        console.log(record);
        openDrawer(true, {
          record,
          isUpdate: true,
        });
        // go('/content/blog/write/markdown/' + record.id);
      }

      async function handleDelete(record: Recordable) {
        let isRecycle = '0';
        await upDatePostRecycle(record.id, isRecycle);
        console.log(record);
        handleSuccess();
      }

      async function handleCheckSuccess(record: Recordable) {
        let checkStatus = '2';
        await updateCheckPost(record.id, checkStatus);
        handleSuccess();
      }

      async function handleCheckFail(record: Recordable) {
        let checkStatus = '1';
        await updateCheckPost(record.id, checkStatus);
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }

      function handleView(record: Recordable) {
        openDrawerView(true, {
          record,
          isUpdate: true,
        });
        // go('/content/post/post_detail/' + record.id);
      }

      return {
        registerTable,
        registerDrawer,
        registerView,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleView,
        handleCheckSuccess,
        handleCheckFail,
        getUserInfo,
      };
    },
  });
</script>
