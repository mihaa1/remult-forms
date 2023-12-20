<div align="center">
  <h1>Remult-uikit</h1>
  <p>Consistent composabe UI components for <a href=https://github.com/remult/remult>Remult</a></p>
    <a href="https://raw.githubusercontent.com/remult/remult/master/LICENSE" rel="nofollow">
    <img alt="GitHub license" src="https://img.shields.io/badge/license-MIT-blue.svg">
  </a>
</div>

<hr/>

# Remult-uikit

remult-uikit is a React UI library for developers working with the [remult](https://github.com/remult/remult) framework, enabling developers to build full composable UI's from scratch in minutes, and minimal effort, or integrate components (forms, views) into your already existing apps.
Remult-uikit uses remult configurations across your frontend to ensure consistency.

Building on top of remult, remult-uikit offers:

- better, consistent user experience on the frontend
- consistency for data handling - display, validation
- declarative way of building UI's

## Quick start

1.

```
yarn add remult remult-uikit

npm add remult remult-uikit
```

2. Install your preferred UI lib

- currently supported: <a href='#supported-mui-v5'>Material-UI V5</a>

3. Create your remult entity

```ts
@Entity<User>('users', {
  @Fields.uuid()
  id = ''

  @Fields.string({
    validate: [Validators.required, Validators.uniqueOnBackend],
  })
  email = ''

  @Fields.string()
  name = ''
})

```

4. In your react code:

```ts
import { RemultForm } from 'remult-uikit'

const createUser = () => <RemultForm entity={User} />
```

## Supported UI libraries

### Material-UI V5

```
yarn add @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/system @mui/x-data-grid @mui/x-data-grid-generator @mui/x-date-pickers

npm install @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/system @mui/x-data-grid @mui/x-data-grid-generator @mui/x-date-pickers
```
