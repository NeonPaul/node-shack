const Busboy = require('busboy')

module.exports = (request) => {
    const data = [];

    var busboy = new Busboy({ headers: request.headers })
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const chunks = []

      file.on('data', data => {
        chunks.push(data)
      })

      file.on('end', () => {
        data.push({
          name: fieldname,
          value: new File(chunks, filename, {
            type: mimetype
          })
        })
      })
    })

    busboy.on('field', (name, value) => {
      data.push({name, value})
    })

    const promise = new Promise(resolve => {
      busboy.on('finish', () => {
        resolve(data)
      })
    })

    request.pipe(busboy)

    return promise
  }
