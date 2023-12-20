# Remult UIKIT

remult-uikit is a React UI library for developers working with the [remult](https://github.com/remult/remult) framework, enabling developers to build full composable UI's from scratch in minutes, and minimal effort, or integrate components (forms, views) into your already existing apps.
remult-uikit uses remult configurations across your frontend to ensure consistency.

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

- currently supported: [Material-UI V5](#Material UI V5)

3. Create your remult entity

```js
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

```js
import { RemultForm } from 'remult-uikit'

const createUser = () => <RemultForm entity={User} />
```

## Supported UI libraries

#Material UI V5

```
yarn add @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/system @mui/x-data-grid @mui/x-data-grid-generator @mui/x-date-pickers

npm install @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/system @mui/x-data-grid @mui/x-data-grid-generator @mui/x-date-pickers
```
