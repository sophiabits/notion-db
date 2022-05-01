# notion-db

## Getting started

```sh
$ yarn add notion-db
```

```ts
import { Connection } from 'notion-db';

const connection = await Connection.withToken(process.env.NOTION_TOKEN);
const notes = connection.database('notes');

const data = await notes.find({
  status: { $eq: 'in-progress' },
});
console.log(data.map((note) => note.title))
```
