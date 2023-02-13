<template>
  <div class="p-4">
    <div class="mb-8" v-if="battleInfo">
      <div class="text-3xl font-bold">
        {{ battleInfo.name }}

        <div class="badge badge-secondary badge-outline">Reward {{ battleInfo.reward ? toEther(battleInfo.reward) : 0 }} ETH</div>
      </div>
      <div class="font-light text-sm">
        <em>From {{ toDateString(battleInfo.startTime) }} to {{ toDateString(battleInfo.endTime) }}</em>
      </div>
      <div class="mt-2">{{ battleInfo.description }}</div>
    </div>

    <div class="flex flex-col w-full">
      <div class="grid grid-cols-5 gap-4">
        <BeatCard v-for="(beat, index) in beats" :key="index" :beatId="beat.id" :voteCount="beat.voteCount" :voteBattleId="battleInfo.id" />
      </div>
    </div>
  </div>
</template>

<script>
import Battles from '@/js/battles'
import BeatCard from './BeatCard.vue'
import Utils from '@/js/utils'

export default {
  name: 'battles',
  components: { BeatCard },
  data() {
    return {
      beats: [],
      battleInfo: {}
    }
  },
  async created() {
    this.$root.$on('beatVoted', async () => {
      await this.loadBeats()
    })

    await Battles.init()
    await this.loadBeats()
  },
  methods: {
    toEther: function (value) {
      const etherValue = web3.fromWei(value, 'ether')
      return etherValue.toNumber()
    },
    toDateString: function (timestampt) {
      return Utils.toDateString(timestampt)
    },
    loadBeats: async function () {
      let battleId = this.$route.params.battleId
      this.battleInfo = await Battles.getBattle(battleId)

      this.beats = []
      this.battleInfo.beatIds.forEach(async (rs) => {
        let beatId = rs.toNumber()
        let voteInfoRs = await Battles.getVoteInfo(battleId, beatId)
        let voteInfo = { count: voteInfoRs[0].toNumber(), voterAddresses: voteInfoRs[1] }
        this.beats.push({ id: beatId, voteCount: voteInfo.count })
      })
    }
  }
}
</script>

