import { FieldMetadata, Validators } from 'remult';

export const isRequired = <T>(field: FieldMetadata<any, T>) => {
  return (
    field.options.validate &&
    (field.options.validate === Validators.required ||
      (field.options.validate?.length &&
        typeof field.options.validate === 'object' &&
        !!field.options.validate.find((v) => v === Validators.required)))
  );
};

export const isRequiredAndEmpty = <T>(val: any, field: FieldMetadata<any, T>) =>
  isRequired(field) && (val === null || val === undefined || val === '');

export const getFieldState = <T>(val: any, field: FieldMetadata<any, T>) => {
  console.log(field.key, 'val', val);
  if (isRequiredAndEmpty(val, field)) {
    return { [field.key]: 'This field is required' };
  }
};
