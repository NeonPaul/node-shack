import express from 'express'
import models from '../../models'

const router = express.Router()

router.get('/', (req, res) => {
  models.Post
      .forge()
      .orderBy('time', 'DESC')
      .fetchPage({
        pageSize: 50,
        withRelated: ['author', 'reactions', 'reactions.user', 'reactions.type']
      }).then(posts => {
        res.json(posts)
      })
})

export default router
