<template>
  <div class="p-4">
    <div class="mb-4 flex-center">
      <ul class="menu items-stretch shadow-lg bg-base-100 horizontal rounded-box uppercase">
        <li @click="onTabChanged('my-beats-tab')" v-bind:class="[showTabId == 'my-beats-tab' ? 'bordered' : '']">
          <a> My Beats</a>
        </li>
        <li @click="onTabChanged('create-beat-tab')" v-bind:class="[showTabId == 'create-beat-tab' ? 'bordered' : '']">
          <a> Mint Beat </a>
        </li>
      </ul>
    </div>

    <div v-show="showTabId == 'my-beats-tab'">
      <MyBeats />
    </div>
    <div v-show="showTabId == 'create-beat-tab'"><MusicPad /></div>
  </div>
</template>

<script>
import * as Tone from 'tone'
// import melodymaker from '@/js/melodymaker/melodymaker.js'
import MusicPad from './MusicPad.vue'
import MyBeats from './MyBeats.vue'

export default {
  name: 'studio',
  components: {
    MusicPad,
    MyBeats
  },
  data() {
    return {
      showTabId: 'create-beat-tab',
      myAddress: ''
    }
  },
  computed: {},
  created() {},
  methods: {
    onTabChanged: function (tabId) {
      this.showTabId = tabId
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
