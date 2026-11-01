# Sauce Demo Login Test Plan

## Application Overview

Swag Labs (https://www.saucedemo.com) is a demo e-commerce site. Its entry point is a single login form with a **Username** textbox, a **Password** textbox (`type="password"`, masked) and a **Login** button. A hint panel on the page lists the accepted usernames (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) and the shared password `secret_sauce`.

Validation happens on submit. Failures show an `alert` inside the form. It contains a **Dismiss error** button and text prefixed with `Epic sadface:`, and the URL stays at `/`. A successful login redirects to `/inventory.html`, which shows the "Products" page: 6 items, a sort dropdown and a cart button.

Locator notes from exploration: the elements expose `data-test` attributes (`username`, `password`, `login-button`). Role-based locators also work (`getByRole('textbox', { name: 'Username' })`, `getByRole('button', { name: 'Login' })`).

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts` (does not exist yet; it should only navigate to `https://www.saucedemo.com/`)

**Preconditions (all scenarios):** a fresh browser context, with no cookies or storage. The login page is loaded at `https://www.saucedemo.com/`. The Username and Password fields are empty and no error is shown.

#### 1.1. standard-user-logs-in-successfully

**File:** `tests/login/standard-user-logs-in-successfully.spec.ts`

**Preconditions:** the shared preconditions above. `standard_user` is a valid, unlocked account.

**Steps:**
  1. Type `standard_user` into the Username field
    - expect: the Username field has the value `standard_user`
  2. Type `secret_sauce` into the Password field
    - expect: the Password field is masked (`type="password"`)
  3. Click the Login button
    - expect: the URL changes to `https://www.saucedemo.com/inventory.html`
    - expect: the "Products" title is visible
    - expect: the "Sort products" dropdown is visible, with "Name (A to Z)" selected
    - expect: 6 inventory items are listed
    - expect: the cart button is visible (cart is empty)
    - expect: no error message is shown

#### 1.2. locked-out-user-sees-error

**File:** `tests/login/locked-out-user-sees-error.spec.ts`

**Preconditions:** the shared preconditions above. `locked_out_user` is a known account that has been locked out.

**Steps:**
  1. Type `locked_out_user` into the Username field
  2. Type `secret_sauce` into the Password field
  3. Click the Login button
    - expect: an error alert is visible with the text `Epic sadface: Sorry, this user has been locked out.`
    - expect: the URL remains `https://www.saucedemo.com/`
    - expect: the login form is still visible, with the Username and Password values retained
    - expect: the inventory page is not shown

#### 1.3. empty-username-shows-required-error

**File:** `tests/login/empty-username-shows-required-error.spec.ts`

**Preconditions:** the shared preconditions above.

**Steps:**
  1. Leave both the Username and Password fields empty
    - expect: both fields are empty
  2. Click the Login button
    - expect: an error alert is visible with the text `Epic sadface: Username is required`
    - expect: the URL remains `https://www.saucedemo.com/`
    - expect: a "Dismiss error" button is visible inside the alert
    - expect: the inventory page is not shown

#### 1.4. empty-password-shows-required-error

**File:** `tests/login/empty-password-shows-required-error.spec.ts`

**Preconditions:** the shared preconditions above.

**Steps:**
  1. Type `standard_user` into the Username field
    - expect: the Username field has the value `standard_user`
  2. Leave the Password field empty
    - expect: the Password field is empty
  3. Click the Login button
    - expect: an error alert is visible with the text `Epic sadface: Password is required`
    - expect: the URL remains `https://www.saucedemo.com/`
    - expect: the Username field still has the value `standard_user`
    - expect: the inventory page is not shown

#### 1.5. invalid-credentials-show-mismatch-error

**File:** `tests/login/invalid-credentials-show-mismatch-error.spec.ts`

**Preconditions:** the shared preconditions above. `foo` / `bar` is not a registered user.

**Steps:**
  1. Type `foo` into the Username field
    - expect: the Username field has the value `foo`
  2. Type `bar` into the Password field
    - expect: the Password field is masked
  3. Click the Login button
    - expect: an error alert is visible with the text `Epic sadface: Username and password do not match any user in this service`
    - expect: the URL remains `https://www.saucedemo.com/`
    - expect: the inventory page is not shown

## Observations and Notes for Generation

- Error messages share the `Epic sadface:` prefix. Assert on the full text for each scenario, or use the alert role plus a regexp.
- The error alert includes a "Dismiss error" button, so its accessible text also contains that button's name. When asserting the message text, prefer `toContainText` or `toBeVisible` over an exact `toHaveText`.
- Validation order: the username is checked first, then the password, then credentials against the user list, then the locked-out status. With an empty username, "Username is required" wins even if a password is entered. This was not tested separately.
- Out of scope for this plan, but worth later scenarios: the dismiss-error button, the other user types (`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`), logout, and direct navigation to `/inventory.html` when unauthenticated.
