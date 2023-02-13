<script>
import * as Tone from 'tone'
import AppConstants from '../js/app-constants'
export default {
  name: 'MusicNote',
  props: ['id', 'name', 'selected'],
  data() {
    return {
      isSelected: false,
      color: null
    }
  },
  created() {
    let self = this
    this.isSelected = this.$props['selected'] === 1
    this.color = AppConstants.MUSIC_NOTES.filter((note) => note.name === self.name)[0].color
  },
  methods: {
    onSelected() {
      this.isSelected = !this.isSelected

      this.$emit('onNoteSelected', {
        id: this.$props['id'],
        name: this.$props['name'],
        selected: this.isSelected
      })

      // create a new synth and route the output to master
      const synth = new Tone.MembraneSynth().toMaster()
      // play a note with the synth we setup
      synth.triggerAttackRelease(this.$props['name'], '8n')
    }
  }
}
</script>

<template>
  <div :id="id" class="flex-item" :style="isSelected ? { backgroundColor: color } : null" @click="onSelected()">
    {{ name }}
  </div>
</template>

<style>
</style>
