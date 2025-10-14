
import { defineParameterType } from '@cucumber/cucumber';

console.log('>>> Custom parameter type loaded');

defineParameterType({
  name: 'list',
  regexp: /"([^"]+?)"/,
  transformer: (input: string) => input.replace(/^\[|\]$/g, '').split(',').map(item => item.trim())
});
