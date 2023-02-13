import axios from 'axios'
export default {
    uploadNftStorage: function (data, callback) {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3QUI4MzkxN2Q5QjIyNWZENzQ2ZDAyMjFCNTVlQTI1NkZDNEMyOUQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNDc3NzQ0MjkzNywibmFtZSI6ImhhY2thdG9tIn0.6_hyHUzf-A7hD9gSaPaTOt2BAg-PD1IaIuefqMZSY88'
        let headers = {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token
        }
        if (typeof data === 'string') {
          headers = {
            Authorization: 'Bearer ' + token
          }
        }
        axios
          .post('https://api.nft.storage/upload', data, {
            headers: headers
          })
          .then((res) => {
            console.log('uploadNftStorage', res)
            callback(res)
          })
      },
  }