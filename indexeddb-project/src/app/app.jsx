import 'antd/dist/antd.css?no-css-module'
import css from './app.less'

import { Component, Store } from 'nautil'
import { todo, done } from './indb'
import { observe, inject, pipe } from 'nautil/operators'
import { Each } from 'nautil/components'
import { getProxied, formatDate, sortArray } from 'ts-fns'

import { Button, Modal, Form, Input, Checkbox } from 'antd'

const store = new Store({
  todo: [],
  done: [],
})

async function addTodo(record) {
  const id = await todo.put(record)
  store.state.todo.push({ ...record, id })
}

async function finishTodo(record) {
  const data = getProxied(record)
  const { id } = data
  await done.put(data)
  await todo.delete(id)
  store.state.todo.forEach((item, i) => {
    if (item.id === id) {
      store.state.todo.splice(i, 1)
    }
  })
  store.state.done.unshift(data)
}

async function reactiveTodo(record) {
  const data = getProxied(record)
  const { id } = data
  await done.delete(id)
  await todo.put(data)
  store.state.done.forEach((item, i) => {
    if (item.id === id) {
      store.state.done.splice(i, 1)
    }
  })
  store.state.todo.unshift(data)
}

async function loadTodo() {
  const allTodo = await todo.all()
  const allDone = await done.all()
  store.state.todo = allTodo
  store.state.done = allDone
}

const Item = (props) => {
  const { onClick, isDone, ...item } = props
  const classNames = [css.item]

  if (isDone) {
    classNames.push(css.itemDone)
  }

  return (
    <div className={classNames.join(' ')} onClick={onClick}>
      <Checkbox defaultChecked={isDone} />
      <span className={css.itemTitle}>{item.title}</span>
      <span className={css.itemTime}>{formatDate(item.createTime, 'YYYY-MM-DD HH:mm')}</span>
    </div>
  )
}

export class App extends Component {
  state = {
    modalVisible: false,
    todo: '',
  }

  onMounted() {
    loadTodo()
  }

  addRecord = () => {
    this.setState({ modalVisible: true })
  }

  handleOk = async () => {
    const { todo } = this.state
    const record = {
      createTime: Date.now(),
      title: todo,
    }
    await addTodo(record)
    this.handleCancel()
  }

  handleCancel = () =>{
    this.setState({ modalVisible: false })
  }

  handleInput = (e) => {
    const value = e.target.value
    this.setState({ todo: value })
  }

  render() {
    const { state } = this.attrs
    const { todo, done } = state
    const todos = sortArray(todo, 'createTime', true)
    const dones = sortArray(done, 'createTime', true)

    return (
      <div className={css.container}>
        <header>
          <h1>TODO List</h1>
          <div>
            <Button type="primary" icon="plus" onClick={this.addRecord}>Add</Button>
          </div>
        </header>
        <main>
          <section className={css.list}>
            <Each of={todos}>
              {(item) => <Item key={item.id} {...item} onClick={() => finishTodo(item)} />}
            </Each>
            <Each of={dones}>
              {(item) => <Item key={item.id} {...item} isDone onClick={() => reactiveTodo(item)} />}
            </Each>
          </section>
        </main>
        <footer>
          <div>IndexedDB</div>
        </footer>
        <Modal
          title="Add Todo"
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <Form.Item>
              <Input.TextArea value={this.state.todo} onChange={this.handleInput} rows={4} placeholder="Type what you want to do..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default pipe([
  inject('state', store.state),
  observe(store),
])(App)
