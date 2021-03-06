<template>
  <div class="wechat">
    <v-header></v-header>
    <div class="item-wrapper" ref="itemScroll">
      <ul>
        <li class="item" v-for="msg in msgs">
          <div class="img-wrapper">
            <img :src="msg.img" width="48" height="48">
          </div>
          <div class="content-wrapper">
            <span class="name">{{ msg.name }}</span><br>
            <span class="msg">{{ msg.msg }}</span>
          </div>
          <div class="time">{{ msg.time | formatDate }}</div>
        </li>
      </ul>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import Header from 'components/header/header.vue'
import Footer from 'components/footer/footer.vue'

import { formatDate } from '../../common/js/date.js'
import BScroll from 'better-scroll'
import { Indicator } from 'mint-ui'

const ERR_NO = 0

export default {
  name: 'wechat',
  activated () {
    this.init()
  },
  data () {
    return {
      msgs: [],
      refresh: false
    }
  },
  components: {
    'v-header': Header,
    'v-footer': Footer
  },
  created () {
    this.$http.get('/api/wechat').then((response) => {
      response = response.body
      if (response.errno === ERR_NO) {
        this.msgs = response.data
        this.$nextTick(() => {
          this.itemScroll = new BScroll(this.$refs.itemScroll, {
            click: true,
            probeType: 3
          })
          this.itemScroll.on('scroll', (pos) => {
            if (!this.refresh && pos.y >= 50) {
              this.refresh = true
              Indicator.open({
                text: '刷新中...',
                spinnerType: 'triple-bounce'
              })
              setTimeout(() => {
                this.addMsgs()
              }, 1000)
            }
          })
        })
      }
    })
  },
  filters: {
    formatDate (time) {
      let date = new Date()
      date.setTime(time)
      return formatDate(date, 'hh:mm')
    }
  },
  methods: {
    init () {
      if (this.itemScroll) {
        this.itemScroll.refresh()
      }
    },
    addMsgs () {
      this.$http.get('/api/news').then((response) => {
        response = response.body
        if (response.errno === ERR_NO) {
          let news = response.data
          let index = -1
          while (true) {
            index = Math.floor(Math.random() * news.length)
            if (index >= 0 && index < news.length) {
              break
            }
          }
          let msg = news[index]
          msg.time = new Date().getTime()
          this.msgs.unshift(msg)
          this.closeIndicator()
        }
      })
    },
    refreshScroll () {
      this.$nextTick(() => {
        if (this.itemScroll) {
          this.itemScroll.refresh()
        }
      })
    },
    closeIndicator () {
      this.refresh = false
      Indicator.close()
      this.refreshScroll()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .wechat
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    height: 100%
    .item-wrapper
      overflow: hidden
      position: absolute
      top: 48px
      bottom: 57px
      width: 100%
      .item
        display: flex
        height: 70px
        border-bottom: 1px solid rgba(0, 0, 0, 0.12)
        &:last-child
          border-bottom: none
        .img-wrapper
          flex: 0 0 70px
          height: 70px
          line-height: 70px
          text-align: center
          img
            margin-top: 11px
        .content-wrapper
          flex: 1
          padding-top: 14px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          .name
            margin-top: 8px
            height: 22px
            line-height: 22px
            font-size: 16px
          .msg
            margin-bottom: 8px
            height: 22px
            line-height: 22px
            font-size: 14px
            color: #767575
        .time
          flex: 0 0 50px
          width: 50px
          font-size: 12px
          text-align: center
          padding-top: 7px
</style>
