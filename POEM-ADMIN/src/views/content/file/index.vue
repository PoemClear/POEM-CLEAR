<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'url'">
          <Image
            :width="60"
            :height="30"
            v-if="record.type == 'image'"
            :src="record.url"
            fallback="https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/1675144320527.png"
          />
          <video
            :width="80"
            :height="40"
            controls
            v-else-if="record.type == 'video'"
            style="margin: 0 auto"
          >
            <source :src="record.url" type="video/mp4" />
          </video>
          <a :href="record.url" v-else target="_blank" rel="noopener noreferrer">文件下载</a>
        </template>

        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              // {
              //   icon: 'clarity:note-edit-line',
              //   // onClick: handleEdit.bind(null, record),
              // },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                // popConfirm: {
                //   title: '是否移入回收站',
                //   placement: 'left',
                //   // confirm: handleDelete.bind(null, record),
                // },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getFileList } from '/@/api/system';
  import { columns, searchFormSchema } from './post.data';
  import { Image } from 'ant-design-vue';

  export default defineComponent({
    name: 'RoleManagement',
    components: { BasicTable, TableAction, Image },
    setup() {
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

      return {
        registerTable,
        handleSuccess,
      };
    },
  });
</script>
