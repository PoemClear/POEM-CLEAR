<template>
  <div>
    <!-- <p>
      当前拥有的code列表: <a> {{ permissionStore.getPermCodeList }} </a>
    </p> -->
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('subject_list:view')">
          添加专题</a-button
        >
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'view_count'">
          {{ record.view_count }} / {{ record.like_count }} / {{ record.comment_count }} /
          {{ record.collect_count }}
        </template>
        <template v-if="column.key === 'author'">
          {{ record.username }}
        </template>
        <template v-if="column.key === 'cover'">
          <Image
            :width="60"
            :height="30"
            :src="record.cover"
            fallback="https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/1675144320527.png"
          />
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
                auth: RoleEnum.SUPER,
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
  import { defineComponent, computed } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    getSubjectList,
    updateCheckSubject,
    upDateSubjectRecycle,
  } from '../../../../api/content/subject';
  import { useDrawer } from '/@/components/Drawer';
  import { usePermissionStore } from '/@/store/modules/permission';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { columns, searchFormSchema } from './post.data';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { Image } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useAppStore } from '/@/store/modules/app';
  import BannerDrawer from './BannerDrawer.vue';
  import { PermissionModeEnum } from '/@/enums/appEnum';
  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, Image, BannerDrawer },
    setup() {
      const appStore = useAppStore();
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
      const isBackPermissionMode = computed(
        () => appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK,
      );

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        let isRecycle = '0';
        await upDateSubjectRecycle(record.id, isRecycle);
        handleSuccess();
      }

      async function handleCheckSuccess(record: Recordable) {
        let checkStatus = '2';
        await updateCheckSubject(record.id, checkStatus);
        handleSuccess();
      }

      async function handleCheckFail(record: Recordable) {
        let checkStatus = '1';
        await updateCheckSubject(record.id, checkStatus);
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }

      function handleView(record: Recordable) {
        go('/content/subject/subject_detail/' + record.id);
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
        isBackPermissionMode,
        RoleEnum,
      };
    },
  });
</script>
