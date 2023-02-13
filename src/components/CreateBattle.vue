<template>
  <div class="p-2">
    <label for="create-battle-modal" class="btn modal-button">Create Battle</label>

    <!-- Modal -->
    <input type="checkbox" id="create-battle-modal" class="modal-toggle" v-model="showModal" />
    <div class="modal">
      <div class="modal-box">
        <div>
          <h1 class="mb-5 text-3xl font-bold">Create Battle</h1>
          <div class="form-control mb-2">
            <label>Name</label>
            <input placeholder="name" class="input input-bordered" v-model="name" required />
          </div>
          <div class="form-control mb-2">
            <label>Description</label>
            <textarea placeholder="description" class="textarea h-24 textarea-bordered" v-model="description" required />
          </div>

          <div class="flex-between mb-2">
            <div class="form-control">
              <label>Start time</label>
              <input placeholder="start time" class="input input-bordered" v-model="startTime" type="date" />
            </div>
            <div class="form-control">
              <label>End time</label>
              <input placeholder="end time" class="input input-bordered" v-model="endTime" type="date" />
            </div>
          </div>
          <div class="form-control mb-2">
            <label>Image</label>
            <input type="file" @change="onImageFileUpload" title="upload image" />
          </div>

          <div class="form-control mb-2 mt-4">
            <label>Reward (ETH)</label>
            <input placeholder="Reward" class="input input-bordered" v-model="reward" type="number" />
          </div>

          <div class="modal-action">
            <button class="btn btn-primary" @click="createBattle">Create</button>
            <label for="create-battle-modal" class="btn">Close</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Battles from '@/js/battles'

export default {
  name: 'create-battle',
  data() {
    return {
      showModal: false,
      name: '',
      description: '',
      startTime: this.getFutureDate(0),
      endTime: this.getFutureDate(30),
      imageFile: null,
      reward: 1
    }
  },
  methods: {
    getFutureDate: function (days) {
      let futureDate = new Date()
      futureDate.setDate(new Date().getDate() + days)
      return futureDate.toISOString().slice(0, 10)
    },
    onImageFileUpload(event) {
      this.imageFile = event.target.files[0]
    },
    createBattle: async function () {
      let startTimestamp = new Date(this.startTime) / 1000
      let endTimestamp = new Date(this.endTime) / 1000
      if (this.reward <= 0 || !this.name || startTimestamp > endTimestamp || endTimestamp <= new Date() / 1000) {
        alert('please input information correctly')
        return
      }

      const self = this
      await Battles.init()

      Battles.createBattle(this.reward, this.name, this.description, startTimestamp, endTimestamp, this.imageFile, (err, rs) => {
        if (!err) {
          console.log('createBattle', rs)
          self.showModal = false
          self.$root.$emit('battleCreated')
        }
      })
    }
  }
}
</script>

