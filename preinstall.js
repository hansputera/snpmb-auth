import isCI from 'is-ci';
import husky from 'husky';

if (!isCI) {
  husky.install();
}
