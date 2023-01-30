<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'author'">
          {{ record.author.username }}
        </template>
        <template v-if="column.key === 'view_count'">
          {{ record.view_count }} / {{ record.like_count }} / {{ record.comment_count }} /
          {{ record.collect_count }}
        </template>
        <template v-if="column.key === 'cover'">
          <Image :width="80" :height="40" :src="record.cover" />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                tooltip: '查看详情',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                popConfirm: {
                  title: '是否还原该文章',
                  placement: 'left',
                  confirm: handleEdit.bind(null, record),
                },
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否删除该文章，删除后不可找回',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <Modal2 @register="register2" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { recycleBinList } from '/@/api/recycle-bin';
  import { upDatePostRecycle, delPost } from '/@/api/content/blog';
  import { upDateSubjectRecycle, delSubjectPost } from '/@/api/content/subject';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { columns, searchFormSchema } from './post.data';
  import { useModal } from '/@/components/Modal';
  import { Image } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import Modal2 from './Modal2.vue';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, Image, Modal2 },
    setup() {
      const go = useGo();
      // const [registerDrawer, { openDrawer }] = useDrawer();
      const searchInfo = { isRecycle: '0' };
      const { hasPermission } = usePermission();
      const [register2, { openModal: openModal2 }] = useModal();
      const permissionStore = usePermissionStore();
      const [registerTable, { reload }] = useTable({
        title: '【回收站】文章列表',
        api: recycleBinList,
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

      async function handleEdit(record: Recordable) {
        let isRecycle = '1';
        if (record.subjectCateId) {
          await upDateSubjectRecycle(record.id, isRecycle);
        } else {
          await upDatePostRecycle(record.id, isRecycle);
        }

        console.log(record);
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }
      async function handleDelete(record: Recordable) {
        if (record.subjectCateId) {
          await delSubjectPost(record.id);
        } else {
          await delPost(record.id);
        }

        reload();
      }
      function handleView(record: Recordable) {
        go('/blog/post_detail/' + record.id);
      }
      return {
        registerTable,
        handleEdit,
        // handleSuccess,
        hasPermission,
        permissionStore,
        handleView,
        openModal2,
        register2,
        searchInfo,
        handleDelete,
      };
    },
  });
</script>
