import getTrad from '../../../utils/getTrad';

const annotationField = {
  name: 'annotation',
  type: 'text',
  intlLabel: {
    id: 'global.annotation',
    defaultMessage: 'Annotation',
  },
  description: {
    id: getTrad('modalForm.attribute.form.base.name.annotation'),
    defaultMessage: 'Please enter field remarks',
  },
  validations: {
    required: false,
  },
};

export { annotationField };
