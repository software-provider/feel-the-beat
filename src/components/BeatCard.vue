<script>
import Utils from '@/js/utils'
import Beats from '@/js/beats'
import Battles from '@/js/battles'
import AppConstants from '@/js/app-constants'
import axios from 'axios'
export default {
  name: 'BeatCard',
  props: ['beatId', 'voteCount', 'voteBattleId'],
  data() {
    return {
      image: '',
      audio: '',
      name: '',
      description: '',
      author: ''
    }
  },
  async created() {
    let self = this

    await Beats.init()

    let tokenUri = await Beats.get(self.$props['beatId'])
    this.image = `${tokenUri}/${AppConstants.MINT_IMAGE_NAME}`
    this.audio = `${tokenUri}/${AppConstants.MINT_AUDIO_NAME}`

    let metadata = await axios.get(`${tokenUri}/metadata.json`)
    this.name = metadata.data.name
    this.description = metadata.data.description
    this.author = metadata.data.author
  },
  methods: {
    vote: function () {
      const self = this

      Battles.voteBeat(this.voteBattleId, this.beatId)
        .then((tx) => {
          console.log('voted', tx)
          alert(`Thanks for your vote!`)
          self.$root.$emit('beatVoted')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    shortAddress: function (addr) {
      return Utils.shortAddress(addr)
    }
  }
}
</script>

<template>
  <div class="card shadow-2xl">
    <figure class="px-2 pt-2">
      <img v-bind:src="image" />
      <audio controls :src="audio" class="mt-2"></audio>
    </figure>
    <div class="card-body">
      <div class="card-title">{{ name }}</div>
      <div>{{ description }}</div>

      <!-- vote -->
      <div class="mt-4" style="display: flex; justify-content: space-between; align-items: center" v-if="voteBattleId">
        <div class="avatar placeholder" :title="author">
          <div class="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
            <div class="p-1" style="word-break: break-all; text-align: center; font-size: 0.8rem" :title="author">{{ shortAddress(author) }}</div>
          </div>
        </div>
        <div>
          <button class="btn btn-secondary btn-outline" @click="vote">
            Vote
            <div class="badge ml-2 badge-outline">{{ voteCount }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>