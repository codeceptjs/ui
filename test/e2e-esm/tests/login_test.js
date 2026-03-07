Feature('Login Feature @smoke');

Scenario('login as admin @critical', ({ I }) => {
  I.amOnPage('/login');
  I.fillField('email', 'admin@example.com');
  I.fillField('password', 'secret');
  I.click('Sign In');
  I.see('Dashboard');
});

Scenario('login fails with wrong password', ({ I }) => {
  I.amOnPage('/login');
  I.fillField('email', 'admin@example.com');
  I.fillField('password', 'wrong');
  I.click('Sign In');
  I.see('Invalid credentials');
});
