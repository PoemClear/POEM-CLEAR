<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 添加专题</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover'">
          <Image :width="40" :height="40" :src="record.cover" />
        </template>
        <template v-if="column.key === 'num'">
          <a-button type="link" :color="record.isEnd == 0 ? 'info' : 'success'">
            {{ record.num }}篇 / {{ record.isEnd == 0 ? '未完结' : '已完结' }}</a-button
          >
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:clock-circle-outlined',
                tooltip: '审核',
                color: 'warning',
                popConfirm: {
                  title: '是否审核改专题',
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
    <BannerDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getSubjectList, updateCheckSubject, upDateSubjectRecycle } from '/@/api/subject';
  import { useDrawer } from '/@/components/Drawer';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { columns, searchFormSchema } from './post.data';
  import { Image } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import BannerDrawer from './BannerDrawer.vue';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, Image, BannerDrawer },
    setup() {
      const go = useGo();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { hasPermission } = usePermission();
      const permissionStore = usePermissionStore();
      const [registerTable, { reload }] = useTable({
        title: '专题列表',
        api: getSubjectList,
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
      }

      async function handleDelete(record: Recordable) {
        let isRecycle = '0';
        await upDateSubjectRecycle(record.id, isRecycle);
        console.log(record);
        handleSuccess();
      }

      async function handleCheckSuccess(record: Recordable) {
        console.log(record);
        let checkStatus = '2';
        await updateCheckSubject(record.id, checkStatus);
        handleSuccess();
      }

      async function handleCheckFail(record: Recordable) {
        console.log(record);
        let checkStatus = '1';
        await updateCheckSubject(record.id, checkStatus);
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }

      function handleView(record: Recordable) {
        go('/subject/subject_detail/' + record.id);
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
        handleView,
        handleCheckSuccess,
        handleCheckFail,
      };
    },
  });
</script>
