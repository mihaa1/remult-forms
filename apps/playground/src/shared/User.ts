// src/shared/Task.ts

import { Entity, Fields, Validators } from 'remult';

@Entity('users', {
  allowApiCrud: true,
})
export class User {
  @Fields.cuid()
  id = '';

  @Fields.string<User>({
    caption: 'First Name',
    // validate: [Validators.required],
    validate: (row) => {
      if (row.firstName.length < 5) {
        return 'First Name must be at least 5 characters long';
      }
    },
  })
  firstName = '';

  @Fields.string({
    caption: 'Last Name',
  })
  lastName = '';

  @Fields.string<User>({
    caption: 'Email',
    validate: [Validators.required],
  })
  email = '';

  @Fields.integer({
    caption: 'Age',
  })
  age?: number;

  @Fields.boolean()
  completed = false;

  @Fields.createdAt()
  createdAt?: Date;
}
