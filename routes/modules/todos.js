const express = require('express')
const router = express.Router()
const { Todo } = require('../../models')

router.get('/new', (req, res) => {
  return res.render('new')
})
//新增todo (已更新)
router.post('/', (req, res) => {
  console.log('req.user', req.user)
  const UserId = req.user.id
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name, UserId })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})
//查看個別todo (已更新)
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})
//進到個別todo編輯頁面 (已更新)
router.get('/:id/edit', (req, res) => {
  const TodoId = req.params.id
  return Todo.findByPk(TodoId, { raw: true })
    .then((todo) => {
      console.log('todo', todo);
      res.render('edit', { todo })
    })
    .catch(error => console.log(error))
})
//送出成功編輯 (已更新)
router.put('/:id', async (req, res) => {
  try {
    const TodoId = req.params.id
    let { name, isDone } = req.body
    const todo = await Todo.findByPk(TodoId)
    if (isDone === 'on') {
      isDone = 1
    } else {
      isDone = 0
    }
    await todo.update({ name, isDone })
    return res.redirect(`/todos/${TodoId}`)
  } catch (error) {
    console.log(error)
  }
})


router.delete('/:id', (req, res) => {
  Todo.findByPk(req.params.id)
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router