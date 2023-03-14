import PromptModuleAPI from '../PromptModuleAPI';

export default (pmInstance: PromptModuleAPI) =>
  pmInstance.injectFeature({
    name: 'Babel',
    value: 'babel',
    short: 'Babel',
    checked: true
  });
