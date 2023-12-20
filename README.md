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

### Note

In order to enjoy the full features remult-uikit offers, you would need to add some boilerplate
to the remult types, as remult does not yet supports everything
(see more about customizing the remult types [here](https://remult.dev/docs/custom-options.html#augmenting-userinfo-interface))

Add an index.d.ts file to your project (make sure typescript sees this file through tsconfig.json)

```ts
declare module 'remult' {
  export interface FieldOptions<entityType, valueType> {
    required?: boolean
    hideOnCreate?: boolean
    select?: {
      options: { id: string | number; label: string }[]
      multiple?: boolean
      type?: 'select' | 'checkbox' | 'radiobox'
    }
  }
}
```

Now you can define everything you need in the entities files and it will be reflected in the frontend

## Supported UI libraries

### Material-UI V5

```
yarn add @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/system @mui/x-data-grid @mui/x-data-grid-generator @mui/x-date-pickers

npm install @emotion/react @emotion/styled @mui/icons-material @mui/material @mui/system @mui/x-data-grid @mui/x-data-grid-generator @mui/x-date-pickers
```

## Examples

```ts
import { Allow, Entity, Fields, Relations, Validators, remult } from 'remult'

@Entity<Organization>('organization')
export class Organization {
  @Fields.uuid()
  id = ''

  @Fields.string()
  name = ''
}

@Entity<User>('users', { caption: 'User' })
export class User {
  @Fields.uuid()
  id = ''

  @Fields.string({
    validate: [Validators.required, Validators.uniqueOnBackend],
    required: true,
  })
  email = ''

  @Fields.boolean({
    includeInApi: false,
  })
  isDisabled = false

  // Relation - if shows in form - will be automatically loaded and displayed as select component
  @Fields.string()
  organizationId = ''
  @Relations.toOne<User, Organization>(() => Organization, {
    field: 'organizationId',
  })
  organization?: Organization

  @Fields.string<User>({
    validate: (v) => {
      if (v.firstName.length < 3) {
        throw new Error('First name must be at least 3 characters long')
      }
    },
  })
  name = ''

  // By default, this will render a list of checkboxes
  @Fields.json<User>({
    validate: (row) => {
      if (row) {
        throw new Error('Need to select at least 1')
      }
    },
    select: {
      options: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((d) => ({
        id: d,
        label: d.toUpperCase(),
      })),
      multiple: true,
      // Add type to show this as a select component
      // type: 'select'
    },
    caption: 'Available Days',
  })
  availableDays = []

  // By default, this will render a radio group
  @Fields.integer<User>({
    select: {
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => ({
        id: d,
        label: d.toString() + ':00 HR',
      })),
      // Add type to show this as a select component
      // type: 'select',
    },
    caption: 'Working Hours Start',
  })
  workingHoursStart = 0

  // Hidden by default
  @Fields.createdAt()
  createdAt?: Date

  // Hidden by default
  @Fields.updatedAt()
  updatedAt?: Date
}
```
