export enum AuthMessages {
  UserCreated = 'User created',
  LoginSuccessful = 'Login successful',
  LoginFailedByData = 'Login failed due wrong data format',
  LoginFailedByUser = 'User with provided login and password not found',
  RefreshSuccessful = 'Tokens refreshed',
  TokenExpired = 'Invalid or expired refresh token',
  NoTokenPassed = 'No token passed',
}
