<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="openModal2"> 写文章</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'cover'">
          <Image :width="80" :height="40" :src="record.cover"/>
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
    <Modal2 @register="register2"/>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';

import {BasicTable, useTable, TableAction} from '/@/components/Table';
import {getPostList, upDatePostRecycle} from '/@/api/blog';

import {usePermissionStore} from '/@/store/modules/permission';
import {usePermission} from '/@/hooks/web/usePermission';
import {columns, searchFormSchema} from './post.data';
import {useModal} from '/@/components/Modal';
import {Image} from 'ant-design-vue';
import {useGo} from '/@/hooks/web/usePage';
import Modal2 from './Modal2.vue';

export default defineComponent({
  name: 'RoleManagement',
  components: {BasicTable, TableAction, Image, Modal2},
  setup() {
    const go = useGo();
    // const [registerDrawer, { openDrawer }] = useDrawer();
    const {hasPermission} = usePermission();
    const [register2, {openModal: openModal2}] = useModal();
    const permissionStore = usePermissionStore();
    const [registerTable, {reload}] = useTable({
      title: '文章列表',
      api: getPostList,
      columns,
      pagination: {pageSize: 8},
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
      go('/blog/write');
      // openDrawer(true, {
      //   isUpdate: false,
      // });
    }

    function handleEdit(record: Recordable) {
      console.log(record);
      // openDrawer(true, {
      //   record,
      //   isUpdate: true,
      // });
    }

    async function handleDelete(record: Recordable) {
      let isRecycle = '0'
      await upDatePostRecycle(record.id, isRecycle);
      console.log(record);
      handleSuccess();
    }

    function handleSuccess() {
      reload();
    }

    function handleView(record: Recordable) {
      go('/blog/post_detail/' + record.id);
    }

    return {
      registerTable,
      // registerDrawer,
      handleCreate,
      handleEdit,
      handleDelete,
      // handleSuccess,
      hasPermission,
      permissionStore,
      handleView,
      openModal2,
      register2,
    };
  },
});
</script>
