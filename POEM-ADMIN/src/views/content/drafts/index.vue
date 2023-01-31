<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
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
    <!-- <Modal2 @register="register2" @goto="handleCreate" /> -->
    <PostDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getPostList, upDatePostRecycle } from '/@/api/content/blog';
  import { useDrawer } from '/@/components/Drawer';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { columns, searchFormSchema } from './post.data';
  import { useModal } from '/@/components/Modal';
  import { Image } from 'ant-design-vue';
  import PostDrawer from './PostDrawer.vue';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, Image, PostDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { hasPermission } = usePermission();
      const [register2, { openModal: openModal2 }] = useModal();
      const searchInfo = {
        drafts: 1,
      };
      const permissionStore = usePermissionStore();
      const [registerTable, { reload }] = useTable({
        title: '草稿箱列表',
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

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        hasPermission,
        permissionStore,
        openModal2,
        register2,
        searchInfo,
      };
    },
  });
</script>
