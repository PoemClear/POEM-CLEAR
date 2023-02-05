<template>
  <div class="lg:flex">
    <Avatar :src="userinfo.avatar || headerImg" :size="72" class="!mx-auto !block" />
    <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
      <h1 class="md:text-lg text-md">{{ date }}, {{ userinfo.realName }}, 开始您一天的工作吧！</h1>
      <span class="text-secondary"> 今日晴，20℃ - 32℃！ </span>
    </div>
    <div class="flex flex-1 justify-end md:mt-0 mt-4">
      <div class="flex flex-col justify-center text-center">
        <span class="text-secondary"> 文章 </span>
        <span class="text-2xl">{{ data.postNum }}</span>
      </div>
      <div class="flex flex-col justify-center text-center md:mx-10 mx-4">
        <span class="text-secondary"> 草稿箱 </span>
        <span class="text-2xl">{{ data.draftsNum }}</span>
      </div>
      <div class="flex flex-col justify-center text-center md:mx-10 mx-4">
        <span class="text-secondary"> 评论 </span>
        <span class="text-2xl">{{ data.commentNum }}</span>
      </div>
      <div class="flex flex-col justify-center text-center md:mr-10 mr-4">
        <span class="text-secondary"> 关注 </span>
        <span class="text-2xl">{{ data.attentionNum }}</span>
      </div>
      <div class="flex flex-col justify-center text-center md:mr-10 mr-4">
        <span class="text-secondary"> 粉丝 </span>
        <span class="text-2xl">{{ data.fansNum }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, onMounted, ref } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import headerImg from '/@/assets/images/header.jpg';
  import { getDataPost } from '/@/api/data';

  export default defineComponent({
    components: { Avatar },
    setup() {
      const userStore = useUserStore();
      const userinfo = computed(() => userStore.getUserInfo);
      let date = ref('');
      let data = ref({
        postNum: 0,
        commentNum: 0,
        attentionNum: 0,
        fansNum: 0,
        draftsNum: 0,
      });
      async function getDataPostList() {
        let res = await getDataPost();
        data.value = res;
      }

      function getTimeState() {
        // 获取当前时间
        let timeNow = new Date();
        // 获取当前小时
        let hours = timeNow.getHours();
        // 设置默认文字
        let text = ``;
        // 判断当前时间段
        if (hours >= 0 && hours <= 10) {
          text = `早上好`;
        } else if (hours > 10 && hours <= 14) {
          text = `中午好`;
        } else if (hours > 14 && hours <= 18) {
          text = `下午好`;
        } else if (hours > 18 && hours <= 24) {
          text = `晚上好`;
        }
        // 返回当前时间段对应的状态
        date.value = text;
      }
      onMounted(() => {
        getDataPostList();
        getTimeState();
      });
      return {
        userinfo,
        headerImg,
        date,
        data,
      };
    },
  });
</script>
