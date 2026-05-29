import 'reflect-metadata';
import { RESOLVE_RESOURCE_KEY } from '../constants';
import { ResolveResource } from './resolve-resource.decorator';

describe('ResolveResource', () => {
  class TestController {
    @ResolveResource('users')
    static handler() {}
  }

  it('должен выставлять metadata с именем ресурса', () => {
    const value = Reflect.getMetadata(RESOLVE_RESOURCE_KEY, TestController.handler);
    expect(value).toBe('users');
  });
});