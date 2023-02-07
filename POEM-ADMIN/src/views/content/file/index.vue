<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'originalname'">
          <a :href="record.originalname">{{ record.originalname }}</a>
        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:cloud-download-outlined',
                onClick: handleView.bind(null, record),
              },
              // {
              //   icon: 'ant-design:delete-outlined',
              //   color: 'error',
              //   // popConfirm: {
              //   //   title: '是否移入回收站',
              //   //   placement: 'left',
              //   //   // confirm: handleDelete.bind(null, record),
              //   // },
              // },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <viewDarwer @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getFileList } from '/@/api/system';
  import { columns, searchFormSchema } from './post.data';
  import { useModal } from '/@/components/Modal';
  import viewDarwer from './viewDarwer.vue';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, viewDarwer },
    setup() {
      const [register, { openModal }] = useModal();

      const [registerTable, { reload }] = useTable({
        title: '文件列表',
        api: getFileList,
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

      function handleSuccess() {
        reload();
      }

      function handleView(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
        // go('/content/post/post_detail/' + record.id);
      }
      return {
        registerTable,
        handleSuccess,
        register,
        handleView,
        useModal,
      };
    },
  });
</script>
