import * as yup from 'yup'
import i18next from 'i18next'

yup.setLocale({
  string: {
    url: i18next.t('errors.url'),
  },
  mixed: {
    required: i18next.t('errors.required'),
  },
})

const schema = yup.object({
  url: yup
    .string()
    .required()
    .url(),
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
