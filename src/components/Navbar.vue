<template>
  <div class="navbar shadow-lg bg-neutral text-neutral-content">
    <div class="flex-none px-2 mx-2">
      <span class="text-lg font-bold"> <a class="btn btn-ghost rounded-btn" href="/#/"> Feel The Beat </a> </span>
    </div>

    <div class="flex-1 px-2 mx-2">
      <div class="items-stretch hidden lg:flex">
        <a class="btn btn-ghost rounded-btn" href="/#/studio"> Studio </a>
        <a class="btn btn-ghost rounded-btn" href="/#/arena"> Arena </a>
      </div>
    </div>

    <!-- <div class="flex-none hidden px-2 mx-2 lg:flex">
      <div class="flex items-stretch">
        <a class="btn btn-ghost btn-sm rounded-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 mr-2 stroke-current">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          Create Battle
        </a>
      </div>
    </div> -->

    <div class="flex-none">
      <div class="avatar placeholder">
        <div class="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
          <div class="p-1" style="word-break: break-all; text-align: center; font-size: 0.8rem" :title="myAddress">{{ myShortAddress }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '@/js/utils'

export default {
  name: 'Navbar',
  data() {
    return {
      myAddress: '',
      myShortAddress: ''
    }
  },
  created() {
    let self = this

    Utils.getMyAddress((myAddress) => {
      self.myAddress = myAddress
      self.myShortAddress = Utils.shortAddress(myAddress)
    })
  },
  methods: {}
}
</script>




