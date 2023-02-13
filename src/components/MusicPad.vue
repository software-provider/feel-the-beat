<script>
import * as Tone from 'tone'
import MusicNote from './MusicNote.vue'
import AppConstants from '@/js/app-constants'
import Beats from '@/js/beats'
import Utils from '@/js/utils'

export default {
  name: 'MusicPad',
  props: [],
  components: {
    MusicNote
  },
  data() {
    return {
      notesList: AppConstants.MUSIC_NOTES,
      noteGrid: {
        colCount: 16,
        rowCount: 0,
        data: []
      },
      mintData: {
        name: '',
        description: ''
      }
    }
  },
  created() {
    this.makeNoteGrid()
  },
  methods: {
    mint: async function () {
      const self = this

      await Beats.init()

      const imageBlob = await (await fetch(document.getElementById('image').src)).blob()
      const imageFile = new File([imageBlob], AppConstants.MINT_IMAGE_NAME, {
        type: imageBlob.type
      })

      const audioBlob = await (await fetch(document.getElementById('audio').src)).blob()
      const audioFile = new File([audioBlob], AppConstants.MINT_AUDIO_NAME, {
        type: audioBlob.type
      })

      // mint
      if (!this.mintData.name || !imageFile || !audioFile) {
        alert('please input the information correctly')
        return
      }

      Utils.getMyAddress((myAddress) => {
        const metadata = {
          name: this.mintData.name,
          description: this.mintData.description,
          author: myAddress,
          created: new Date() / 1000
          // noteGrid: this.noteGrid
        }
        console.log('metadata', metadata)
        Beats.mint(imageFile, audioFile, metadata, function (err, res) {
          if (!err) {
            console.log('mint', res)

            alert('Your beat has been minted successfully')
            self.$root.$emit('beatMinted')
          }
        })
      })
    },
    prepareMint: async function () {
      if (this.hasNoteGridData()) {
        this.play(false)
        let canvas = Beats.drawImageCanvas(document.getElementById('canvas'), this.noteGrid)

        // canvas.drawImage(document.getElementById('image'), 0, 0, 280, 320)
        let image = document.getElementById('image')
        var dataURL = canvas.toDataURL('image/png')
        image.src = dataURL
        image.width = 320
        image.height = 280
      }
    },
    reset() {
      this.noteGrid = {
        colCount: 0,
        rowCount: 0,
        data: []
      }
      let self = this
      setTimeout(function () {
        self.makeNoteGrid()
      }, 100)
    },
    stop() {
      Tone.Transport.cancel()
      Tone.Transport.stop()
    },
    play(isRepeat) {
      let self = this
      const dest = Tone.context.createMediaStreamDestination()

      // setup recorder
      const chunks = []
      const recorder = new MediaRecorder(dest.stream)
      recorder.ondataavailable = (evt) => chunks.push(evt.data)
      recorder.onstop = (evt) => {
        let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })

        let src = URL.createObjectURL(blob)

        let audio = document.getElementById('audio')
        audio.src = src

        // // download
        // const anchor = document.createElement('a')
        // anchor.download = 'recording.webm'
        // anchor.href = src
        // anchor.click()
      }

      let isRecored = false
      let loop = 0
      const synths = this.makeSynths(this.noteGrid.colCount, dest)
      const repeat = (time) => {
        if (loop === 0 && !isRecored) recorder.start()

        // highlight
        let tempBackColors = []
        for (let r = 0; r < this.noteGrid.rowCount; r++) {
          tempBackColors[`${r}-${loop}`] = document.getElementById(`${r}-${loop}`).style.backgroundColor
          document.getElementById(`${r}-${loop}`).style.backgroundColor = '#c7edff'
        }

        this.noteGrid.data.forEach((row, index) => {
          let synth = synths[index]
          let note = row[loop]

          if (note.selected == 1) {
            synth.triggerAttackRelease(note.name, '8n', time)
          }
        })

        // turn off highlight
        setTimeout(
          (colors, l) => {
            for (let r = 0; r < this.noteGrid.rowCount; r++) {
              document.getElementById(`${r}-${l}`).style.backgroundColor = colors[`${r}-${l}`]
            }
          },
          100,
          tempBackColors,
          loop
        )

        loop = (loop + 1) % this.noteGrid.colCount

        if (loop === 0 && !isRecored) {
          setTimeout(function () {
            recorder.stop()
            if (!isRepeat) self.stop()
          }, 300)

          isRecored = true
        }
      }

      Tone.Transport.bpm.value = 120
      Tone.Transport.scheduleRepeat(repeat, '8n')

      Tone.Transport.start()
    },
    onParentNoteSelected(data) {
      let rowIndex = parseInt(data.id.split('-')[0])
      let colIndex = parseInt(data.id.split('-')[1])
      this.noteGrid.data[rowIndex][colIndex].selected = data.selected
    },
    makeSynths(count, dest) {
      // declare array to store synths
      const synths = []

      for (let i = 0; i < count; i++) {
        let synth = new Tone.Synth({
          oscillator: {
            type: 'square8'
          }
        })
          .connect(dest)
          .toMaster()

        synths.push(synth)
      }

      return synths
    },
    makeNoteGrid() {
      this.noteGrid = {
        colCount: 16,
        rowCount: 0,
        data: []
      }
      this.noteGrid.rowCount = AppConstants.MUSIC_NOTES.length
      for (let r = 0; r < AppConstants.MUSIC_NOTES.length; r++) {
        let note = AppConstants.MUSIC_NOTES[r]
        // declare the subarray
        const row = []
        // each subarray contains multiple objects that have an assigned note
        // and a boolean to flag whether they are "activated"
        // each element in the subarray corresponds to one eigth note
        for (let c = 0; c < this.noteGrid.colCount; c++) {
          row.push({
            id: `${r}-${c}`,
            name: note.name,
            selected: !note.selected ? 0 : 1
          })
        }
        this.noteGrid.data.push(row)
      }
    },
    hasNoteGridData() {
      let rs = false
      for (let r = 0; r < this.noteGrid.rowCount; r++) {
        for (let c = 0; c < this.noteGrid.colCount; c++) {
          if (this.noteGrid.data[r][c].selected) {
            rs = true
          }
        }
      }

      return rs
    }
  }
}
</script>

<template>
  <div>
    <div class="card bordered shadow">
      <div class="card-body">
        <div class="flex-container p-4">
          <div v-for="c in noteGrid.colCount" :key="c">
            <MusicNote
              v-for="r in noteGrid.rowCount"
              :key="noteGrid.data[r - 1][c - 1].id"
              :id="noteGrid.data[r - 1][c - 1].id"
              :name="noteGrid.data[r - 1][c - 1].name"
              :selected="noteGrid.data[r - 1][c - 1].selected"
              @click="onSelected()"
              @onNoteSelected="onParentNoteSelected"
            >
            </MusicNote>
          </div>
        </div>
        <div class="justify-end flex-center">
          <div>
            <button class="btn" @click="play(true)">Play</button>
            <button class="btn" @click="stop">Stop</button>
            <button class="btn" @click="reset">Reset</button>
            <label for="mint-modal" class="btn btn-primary modal-button" @click="prepareMint">Mint</label>
          </div>
        </div>
      </div>
    </div>

    <input type="checkbox" id="mint-modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <div>
          <div class="mb-2" style="border: 1px solid #e5e7eb; border-radius: 5px">
            <div class="form-control mb-2 p-2" style="align-items: center">
              <div visibility="hidden" style="height: 0">
                <canvas id="canvas" height="280" width="320"></canvas>
              </div>
              <img id="image" />
            </div>
            <div class="form-control mb-2" style="align-items: center">
              <audio id="audio" controls class="mb-2"></audio>
            </div>
          </div>

          <div class="form-control mb-2">
            <input type="text" placeholder="name" class="input input-bordered" v-model="mintData.name" />
          </div>
          <div class="form-control mb-2">
            <textarea class="textarea h-24 textarea-bordered" placeholder="description" v-model="mintData.description"></textarea>
          </div>
        </div>
        <div class="modal-action">
          <label for="mint-modal" class="btn btn-primary" @click="mint">Mint</label>
          <label for="mint-modal" class="btn">Close</label>
        </div>
      </div>
    </div>
  </div>
</template>
