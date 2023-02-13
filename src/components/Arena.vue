<template>
  <div class="p-4">
    <div class="alert col-span-1 xl:col-span-2 bg-base-500 mb-5">
      <div class="flex-1">
        <div class="mx-3">
          <div class="text-2xl">ARENA</div>
          <div class="text-1xl">Battle, vote and get rewarded</div>
        </div>
      </div>
      <div class="flex-none"><CreateBattle /></div>
    </div>

    <div class="card lg:card-side bordered mb-2" v-for="battle in battles" :key="battle.id">
      <figure>
        <img :src="battle.image" style="width: 450px" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">
          {{ battle.name }}
          <div class="ml-1 badge badge-secondary badge-outline">Reward {{ toEther(battle.reward) }} ETH</div>
        </h2>
        <div>
          {{ battle.description }}
        </div>

        <div class="mt-5 text-sm">
          <em>From {{ toDateString(battle.startTime) }} to {{ toDateString(battle.endTime) }}</em>
        </div>
        <div class="card-actions">
          <a class="btn btn-primary" :href="'/#/arena/' + battle.id">Explore Beats!</a>
          <label for="join-battle-modal" class="btn btn-outline modal-button" @click="selectBattle(battle)" v-show="canJoinBattle(battle)">Join Battle</label>
          <label for="reward-modal" class="btn btn-warning modal-button" @click="getWinningBeat(battle)" v-show="canClaimReward(battle)">Claim reward</label>
        </div>
      </div>
    </div>

    <!-- JOIN BATTLE MODAL -->
    <div>
      <input type="checkbox" id="join-battle-modal" class="modal-toggle" />
      <div class="modal" id="join-battle-modal">
        <div class="modal-box">
          <div>
            <div class="form-control mb-5">
              <h1 class="mb-2 text-3xl font-bold">{{ selectedBattle.name }}</h1>
              <div>{{ selectedBattle.description }}</div>
            </div>

            <div class="form-control mb-2">
              <select class="select select-bordered" v-on:change="onBeatChanged($event)">
                <option disabled="disabled" selected="selected">Choose your beat to join in the battle</option>
                <option v-for="beat in myBeats" :key="beat.name" :value="beat.id">{{ beat.name }}</option>
              </select>
            </div>

            <div>
              <div class="mb-2" style="border: 1px solid #e5e7eb; border-radius: 5px">
                <div class="form-control mb-2 p-2" style="align-items: center">
                  <img id="image" :src="selectedMyBeat.image" />
                </div>
                <div class="form-control mb-2" style="align-items: center">
                  <audio id="audio" controls class="mb-2" :src="selectedMyBeat.audio"></audio>
                </div>
              </div>

              <div class="form-control mb-2">
                <input readonly type="text" placeholder="name" class="input input-bordered" v-model="selectedMyBeat.name" />
              </div>
              <div class="form-control mb-2">
                <textarea readonly class="textarea h-24 textarea-bordered" placeholder="description" v-model="selectedMyBeat.description"></textarea>
              </div>
            </div>
            <div class="modal-action">
              <label for="join-battle-modal" class="btn btn-primary" @click="joinBattle">Join</label>
              <label for="join-battle-modal" class="btn">Close</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reward Modal -->
    <div>
      <input type="checkbox" id="reward-modal" class="modal-toggle" />
      <div class="modal" id="reward-modal">
        <div class="modal-box">
          <div>
            <div class="mb-2 text-3xl font-bold">Reward</div>

            <div class="mb-2" v-if="selectedWinningBeat">
              <div class="mb-4">Congratulations!</div>
              <div class="mb-2">
                <div>
                  Winner <b>{{ selectedWinningBeat.author }}</b>
                </div>
                <div>
                  with the beat <b>"{{ selectedWinningBeat.name }}"</b>
                </div>
              </div>

              <div class="mb-2" style="border: 1px solid #e5e7eb; border-radius: 5px">
                <div class="form-control mb-2 p-2" style="align-items: center">
                  <img id="image" :src="selectedWinningBeat.image" />
                </div>
                <div class="form-control mb-2" style="align-items: center">
                  <audio id="audio" controls class="mb-2" :src="selectedWinningBeat.audio"></audio>
                </div>
              </div>
              <div class="mt-4 mb-4">
                If you are owner, please claim your reward
                <span
                  ><b>{{ selectedBattle.reward ? toEther(selectedBattle.reward) : 0 }} ETH</b></span
                >
              </div>
            </div>

            <div class="mb-2" v-if="!selectedWinningBeat">No Result</div>

            <div class="modal-action">
              <label for="reward-modal" class="btn btn-warning" v-if="selectedWinningBeat" @click="claimReward">Claim</label>
              <label for="reward-modal" class="btn">Close</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateBattle from './CreateBattle.vue'
import AppConstants from '@/js/app-constants'
import Battles from '@/js/battles'
import Beats from '@/js/beats'
import Utils from '@/js/utils'
import axios from 'axios'
export default {
  name: 'arena',
  components: { CreateBattle },
  data() {
    return {
      myAddress: '',
      battleCount: 0,
      battles: [],
      myBeats: [],
      selectedMyBeat: {},
      selectedBattle: {},
      selectedWinningBeat: null
    }
  },
  computed: {},
  async created() {
    let self = this

    // get battles
    await Battles.init()
    await this.loadBattles()

    this.$root.$on('battleCreated', async () => {
      await self.loadBattles()
    })

    // get my beats
    await Beats.init()
    Utils.getMyAddress(async (myAddress) => {
      self.myAddress = myAddress

      // get owner beatIds
      let tokensRs = await Beats.getTokensOfOwner(self.myAddress)
      tokensRs.forEach(async (tokenIdRs) => {
        let tokenId = tokenIdRs.toNumber()

        Beats.getBeatInfo(tokenId, (err, beatInfo) => {
          if (!err) self.myBeats.push(beatInfo)
        })
      })
    })
  },
  methods: {
    toEther: function (value) {
      const etherValue = web3.fromWei(value, 'ether')
      return etherValue.toNumber()
    },
    toDateString: function (timestampt) {
      return Utils.toDateString(timestampt)
    },
    selectBattle: function (battle) {
      this.selectedBattle = battle
    },
    canJoinBattle: function (battle) {
      const nowTimestampt = parseInt(new Date().getTime() / 1000)
      return battle.startTime <= nowTimestampt && battle.endTime >= nowTimestampt
    },
    canClaimReward: function (battle) {
      const nowTimestampt = parseInt(new Date().getTime() / 1000)
      return nowTimestampt > battle.endTime
    },
    joinBattle: function () {
      const self = this

      Battles.join(self.selectedBattle.id, self.selectedMyBeat.id)
        .then((tx) => {
          console.log('join', tx)
          alert(`Congratulations! Your beat '${self.selectedMyBeat.name}' has been joined in '${self.selectedBattle.name}'`)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    claimReward: function () {
      Battles.claimReward(this.selectedBattle.id)
        .then((tx) => {
          console.log('claimReward', tx)
          alert(`You have claimed reward successfully`)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onBeatChanged: function (event) {
      this.selectedMyBeat = this.myBeats.filter((b) => {
        return b.id == event.target.value
      })[0]
    },
    loadBattles: async function () {
      this.battles = []
      this.battleCount = await Battles.getBattleCount()
      for (let i = 1; i <= this.battleCount; i++) {
        let battleInfo = await Battles.getBattle(i)
        this.battles.push(battleInfo)

        battleInfo.beatIds.forEach((beatId) => {
          Battles.getVoteInfo(battleInfo.id, beatId).then((rs) => {
            console.log('getVoteInfo', rs)
          })
        })
      }
    },
    getWinningBeat: async function (battle) {
      const self = this
      self.selectedBattle = battle
      self.selectedWinningBeat = null
      let winningBeatId = await Battles.getWinningBeat(battle.id)
      Beats.getBeatInfo(winningBeatId.toNumber(), (err, winningBeatInfo) => {
        if (!err) self.selectedWinningBeat = winningBeatInfo
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
