<template>
  <div>
    <div class="flex flex-col w-full">
      <div class="divider">NEW</div>
      <div class="grid grid-cols-5 gap-4">
        <div>
          <div class="card shadow-2xl">
            <figure class="px-2 pt-2">
              <img src="https://picsum.photos/id/1005/400/250" />
            </figure>
            <div class="card-body">
              <div class="card-title">shadow, center, padding</div>
              <div>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</div>
            </div>
          </div>
        </div>
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
      </div>
      <div class="divider">TOP</div>
      <div class="grid grid-cols-5 gap-4">
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
        <div style="background-color: black">1</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data() {
    return {
      newBeats: [],
      topBeats: []
    }
  },
  created() {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
  display: block;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.card-body {
  padding: 0.5rem;
}
.card-title {
  margin-bottom: 0.5rem;
}
</style>
