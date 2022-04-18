<template>
  <transition name="fade" appear>
    <div class="footer">
      <div>
        <div class="author">
          <div>©2022</div>
          <template v-for="(item, index) in author" :key="index">
            <a style="margin-left: 5px" v-if="index > 0">&</a>
            <a style="margin-left: 5px" :href="item.url" target="_blank">{{ item.name }}</a>
          </template>
        </div>
        <div class="info">
          <template v-for="(item, index) in info" :key="index">
            <div v-html="item"></div>
          </template>
          <img style="margin: 5px 5px 0px -2px" alt="GitHub Repo stars" :src="lastUpdate" />
        </div>
        <div>
          累计访问量
          <a href="#">{{pv_count}}</a>
        </div>
        <div>
          Powered by
          <a href="https://github.com/blacktunes/voices-button-cli">voices-button-cli</a>
          {{
            " | "
          }}
          <a href="https://github.com/blacktunes/hiiro-button">hiiro-button</a>
        </div>
      </div>
      <div class="text-right">
        <div class="git">
          <IBtn class="btn" :url="githubUrl" :img="githubPng" />
          <a :href="githubUrl" target="_blank">{{ t(INFO_I18N.toGithub) }}</a>
        </div>
        <div>{{ t(INFO_I18N.notOfficial) }}</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import Setting from '@/../setting/setting.json'
import githubPng from '@/assets/image/github-fill.png'
import { INFO_I18N } from '@/assets/script/type'
import IBtn from '@/components/common/IconBtn.vue'
import { useI18n } from 'vue-i18n'
// 获取实例
import { getCurrentInstance ,ref} from 'vue'
// 获取接口
import _APIS from "@/api";
// import _public from "@/src/public/public";

const FOOTER: {
  author?: {
    name: string;
    url?: string;
  }[];
  info?: string[];
  githubUrl?: string;
} = Setting['footer']
const pv_count = ref(0);
const { t } = useI18n()
console.log(window._hmt, '_hmt2')
const author = FOOTER && FOOTER.author ? FOOTER.author : []
const info = FOOTER && FOOTER.info ? FOOTER.info : []
const githubUrl = FOOTER && FOOTER.githubUrl ? FOOTER.githubUrl : undefined

const lastUpdate = `https://img.shields.io/date/${(process.env.VUE_APP_LAST_UPDATE.substring(0, process.env.VUE_APP_LAST_UPDATE.length - 3))}?label=last%20update&style=social`

let param = {
  access_token: '121.cdb2e9ad761fe85985af85ce79ba9bd1.YC7QkSgvvtsvZTMq5reZYGXrwHku2smM1BRNid8.8yWupQ',
  site_id: 17860040,
  method: 'overview/getCommonTrackRpt',
  start_date: 20220415,
  end_date: 20250415
}
  // 获取接口数据
  _APIS.getData(param)
  .then(res=>{
     console.log(res,'res')
  },err=>{
      // _public.errorToast(this,err)
  })
</script>

<style lang="stylus" scoped>
.footer
  display flex
  justify-content space-between
  flex-wrap wrap
  padding 5px
  background-color #ebebeb
  font-size 12px
  color #333

  .author
    display flex
    align-items center

  .info
    margin-top 5px
    line-height 18px

  .text-right
    text-align right

    .git
      display flex
      align-items center

      a
        margin 0

      .btn
        margin 0 5px

@media only screen and (max-width 600px)
  .footer
    flex-direction column

    .text-right
      text-align left

      .git
        display flex
        align-items center

        .btn
          order 10

@media (prefers-color-scheme dark)
  .footer
    background-color #ddd
</style>
