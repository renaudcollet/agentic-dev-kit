import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  ...pluginVueA11y.configs['flat/recommended'],
  {
    rules: {
      // A label linked by id is enough; nesting the input is not required.
      'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
    },
  },
)
