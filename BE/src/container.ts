import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

let container = new Container();

const { lazyInject } = getDecorators(container);
export { lazyInject };

export default container;
