<template>
  <div>
    <BasicTable @register="registerTable">
      <template #headerTop>
        <!-- <a-alert type="info" show-icon>
          <template #message>
            <template v-if="checkedKeys.length > 0">
              <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
              <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
            </template>
            <template v-else>
              <span>未选中任何项目</span>
            </template>
          </template>
        </a-alert> -->
      </template>
      <template #toolbar>
        <a-button
          type="primary"
          @click="handleCreate"
          :disabled="getUserInfo.roleValue == 'RegularMembers'"
        >
          新增公告
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'image_url'">
          <Image :width="80" :height="40" :src="record.image_url" />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                disabled: getUserInfo.roleValue == 'RegularMembers',
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                disabled: getUserInfo.roleValue == 'RegularMembers',
                popConfirm: {
                  title: '是否确认删除',
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
  import { defineComponent, ref, computed } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getNoticeList ,delNotice} from '/@/api/notice';
  import { useDrawer } from '/@/components/Drawer';
  import BannerDrawer from './BannerDrawer.vue';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { columns, searchFormSchema } from './banner.data';
  import { Image } from 'ant-design-vue';

  import { useUserStore } from '/@/store/modules/user';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, BannerDrawer, TableAction, Image }, // AAlert: Alert
    setup() {
      const checkedKeys = ref<Array<string | number>>([]);
      const [registerDrawer, { openDrawer }] = useDrawer();
      const { hasPermission } = usePermission();
      const permissionStore = usePermissionStore();
      const userStore = useUserStore();
      const getUserInfo = computed(() => {
        const { roleValue } = userStore.getUserInfo || {};
        return { roleValue };
      });
      const [registerTable, { reload }] = useTable({
        title: '公告列表',
        api: getNoticeList,
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
        // rowKey: 'id',
        // rowSelection: {
        //   type: 'checkbox',
        //   selectedRowKeys: checkedKeys,
        //   onChange: onSelectChange,
        // },
        actionColumn: {
          width: 80,
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
        // console.log(record);
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        // await DelRole(record.id);
        await delNotice(record.id);
        console.log(record);
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }
      function onSelectChange(selectedRowKeys: (string | number)[]) {
        console.log(selectedRowKeys, 123);
        checkedKeys.value = selectedRowKeys;
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
        checkedKeys,
        onSelectChange,
        getUserInfo,
      };
    },
  });
</script>
