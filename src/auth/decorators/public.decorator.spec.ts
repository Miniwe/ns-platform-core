import 'reflect-metadata';
import { IS_PUBLIC_KEY } from '../constants';
import { Public } from './public.decorator';

describe('Public', () => {
  class TestController {
    @Public()
    static open() {}
  }

  it('должен выставлять isPublic metadata', () => {
    const value = Reflect.getMetadata(IS_PUBLIC_KEY, TestController.open);
    expect(value).toBe(true);
  });
});