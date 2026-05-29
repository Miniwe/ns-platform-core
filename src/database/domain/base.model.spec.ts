import { BaseModelDto, BaseModelNoUpadteDto } from './base.model';

describe('BaseModel DTOs', () => {
  it('BaseModelNoUpadteDto should be defined', () => {
    expect(BaseModelNoUpadteDto).toBeDefined();
    expect(typeof BaseModelNoUpadteDto).toBe('function');
  });

  it('BaseModelDto should be defined', () => {
    expect(BaseModelDto).toBeDefined();
    expect(typeof BaseModelDto).toBe('function');
  });
});