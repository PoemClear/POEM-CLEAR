<template>
  <div ref="wrapRef"></div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import {
    defineComponent,
    ref,
    unref,
    nextTick,
    computed,
    watch,
    onBeforeUnmount,
    onDeactivated,
  } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  import { useLocale } from '/@/locales/useLocale';
  import { useModalContext } from '../../Modal';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { getTheme } from './getTheme';
  import { getToken } from '/@/utils/auth';
  type Lang = 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' | undefined;
  import { useGlobSetting } from '/@/hooks/setting';
  const { uploadUrl = '/upload' } = useGlobSetting();
  export default defineComponent({
    inheritAttrs: false,
    props: {
      height: { type: Number, default: 500 },
      value: { type: String, default: '' },
    },
    emits: ['change', 'get', 'update:value'],
    setup(props, { attrs, emit }) {
      const wrapRef = ref<ElRef>(null);
      const vditorRef = ref(null) as Ref<Nullable<Vditor>>;
      const initedRef = ref(false);

      const modalFn = useModalContext();

      const { getLocale } = useLocale();
      const { getDarkMode } = useRootSetting();
      const valueRef = ref(props.value || '');
      console.log(getDarkMode);
      watch(
        [() => getDarkMode.value, () => initedRef.value],
        ([val, inited]) => {
          if (!inited) {
            return;
          }
          instance
            .getVditor()
            ?.setTheme(getTheme(val) as any, getTheme(val, 'content'), getTheme(val, 'code'));
        },
        {
          immediate: true,
          flush: 'post',
        },
      );

      watch(
        () => props.value,
        (v) => {
          if (v !== valueRef.value) {
            instance.getVditor()?.setValue(v);
          }
          valueRef.value = v;
        },
      );

      const getCurrentLang = computed((): 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' => {
        let lang: Lang;
        switch (unref(getLocale)) {
          case 'en':
            lang = 'en_US';
            break;
          case 'ja':
            lang = 'ja_JP';
            break;
          case 'ko':
            lang = 'ko_KR';
            break;
          default:
            lang = 'zh_CN';
        }
        return lang;
      });
      function init() {
        const wrapEl = unref(wrapRef) as HTMLElement;
        if (!wrapEl) return;
        const bindValue = { ...attrs, ...props };
        const insEditor = new Vditor(wrapEl, {
          // 设置外观主题
          theme: getTheme(getDarkMode.value) as any,
          // 语言
          lang: unref(getCurrentLang),
          // 评论
          // comment: {
          //   enable: true,
          //   add: (id: string, text: string, commentsData: ICommentsData[]) => {
          //     console.log(id, text, commentsData);
          //   },
          //   remove: (ids: string[]) => {
          //     console.log(ids);
          //   },
          //   adjustTop: (commentsData: ICommentsData[]) => {
          //     console.log(commentsData);
          //   },
          // },
          // 显示字数
          counter: {
            enable: true,
          },
          // 模式
          mode: 'ir',
          // 输入区域为空时的提示。默认值
          placeholder: '请输入内容',
          // 全屏尺寸
          fullscreen: {
            index: 520,
          },
          // 预览
          preview: {
            theme: {
              // 设置内容主题
              current: getTheme(getDarkMode.value, 'content'),
            },
            hljs: {
              // 设置代码块主题
              /**启用行号 */
              lineNumber: true,
              style: getTheme(getDarkMode.value, 'code'),
            },
            actions: [],
            markdown: {
              toc: true,
              fixTermTypo: true,
            },
          },
          input: (v) => {
            valueRef.value = v;
            emit('update:value', v);
            emit('change', v);
          },
          after: () => {
            nextTick(() => {
              modalFn?.redoModalHeight?.();
              insEditor.setValue(valueRef.value);
              vditorRef.value = insEditor;
              initedRef.value = true;
              emit('get', instance);
            });
          },
          blur: () => {
            //unref(vditorRef)?.setValue(props.value);
          },
          getHTML: (val) => {
            console.log(val);
          },
          ...bindValue,
          cache: {
            enable: false,
          },
          upload: {
            url: uploadUrl,
            max: 1024 * 1024 * 1000,
            fieldName: 'file',
            // accept: 'image/*',
            multiple: false,
            token: 'authorization',
            headers: {
              authorization: getToken(),
            },
            // ,
            // success(editor: HTMLPreElement, msg: string) {
            //   console.log(editor, msg);
            // },
          },
          resize: {
            enable: true,
          },
          outline: {
            enable: true,
            position: 'left',
          },
        });
      }

      const instance = {
        getVditor: (): Vditor => vditorRef.value!,
      };

      function destroy() {
        const vditorInstance = unref(vditorRef);
        if (!vditorInstance) return;
        try {
          vditorInstance?.destroy?.();
        } catch (error) {}
        vditorRef.value = null;
        initedRef.value = false;
      }

      onMountedOrActivated(init);

      onBeforeUnmount(destroy);
      onDeactivated(destroy);
      return {
        wrapRef,
        ...instance,
      };
    },
  });
</script>
