import InDB from 'indb'

const indexes = [
  {
    name: 'createTime',
  },
  {
    name: 'title',
  },
]

const indb = new InDB({
  name: 'TODO_LIST_2',
  version: 1,
  stores: [
    {
      name: 'todo',
      keyPath: 'id',
      autoIncrement: true,
      indexes,
    },
    {
      name: 'done',
      keyPath: 'id',
      autoIncrement: true,
      indexes,
    },
  ],
})

export const todo = indb.use('todo')
export const done = indb.use('done')
