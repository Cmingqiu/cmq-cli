import chalk from 'chalk';
import { Answers } from 'inquirer';
import PromptModuleAPI from '../PromptModuleAPI';

/**
 * 向router选项中注入
 */
export default (pmInstance: PromptModuleAPI) => {
  pmInstance.injectFeature({
    name: 'Router',
    value: 'router',
    short: 'Router',
    checked: true
  });

  pmInstance.injectPrompt({
    type: 'confirm' as const,
    name: 'historyMode',
    when: (answer: Answers) => answer?.feature?.includes('router'),
    message: `Use history mode for router? ${chalk.yellow(
      `(Requires proper server setup for index fallback in production)`
    )}`
  });

  pmInstance.onPromptComplete((answer: Answers, options: any) => {
    if (answer?.feature?.includes('router')) {
      options.plugins['@vue/cli-plugin-router'] = {
        history: answer.historyMode
      };
    }
  });
};
