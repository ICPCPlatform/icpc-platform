// create a function for updateMaterialBlock action
import { encryptSession } from '@/lib/session';
import { updateMaterialBlock } from '../_editBlock';
import { updateMaterial } from '../_updateMaterial';

describe('vaildation testing', () => {
  it('should return true for valid data', () => {
    const data = {
      title: 'Test Title',
      description: 'Test Description',
      url : 'https://example.com',
    };
    
    const valid_user = encryptSession({
      userId: '123',
      username: 'testuser',
      role: 'admin',
    });
    updateMaterial(data); 



})
