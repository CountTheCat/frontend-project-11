import * as yup from 'yup'

const schema = yup.object({
  url: yup
    .string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL'),
})

export default (fields) => {
  return schema.validate(fields, { abortEarly: false })
    .then(() => ({}))
    .catch((err) => {
      const errors = {}
      err.inner.forEach((e) => {
        if (!errors[e.path]) {
          errors[e.path] = e.message
        }
      })
      return errors
    })
}
