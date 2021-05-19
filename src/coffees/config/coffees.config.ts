import { registerAs } from '@nestjs/config';

// registerAs is necessary, lets register namespace as 'coffees'
export default registerAs('coffees', () => ({
  foo: 'bar',
}));
