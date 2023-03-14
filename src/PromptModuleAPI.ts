import { ConfirmQuestion } from 'inquirer';
import Creator from './Creator';
import { CheckboxChoiceOptions } from 'inquirer';

/**
 * 可插拔机制
 */
class PromptModuleAPI {
  constructor(private creator: Creator) {}
  // 注入featurePrompt的choice
  injectFeature(feature: CheckboxChoiceOptions) {
    (this.creator.featurePrompt.choices as Array<any>).push(feature);
  }
  // 注入router的history模式
  injectPrompt(choice: ConfirmQuestion) {
    this.creator.injectedPrompts.push(choice);
  }

  onPromptComplete(cb: any) {
    this.creator.promptCompleteCbs.push(cb);
  }
}

export default PromptModuleAPI;
