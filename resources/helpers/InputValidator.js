export function check(input, required) {
  let isInputValid = true;
  const errors = {};
  Object.keys(required).map(key => {
    const value = input[key];
    const setting = required[key];
    let name = typeof setting === 'string' ? setting : key;
    let errorMessage;
    if (typeof setting === 'object') {
      name = setting.name;
      if (setting.email) {
        const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          value,
        );
        if (!isValidEmail) {
          errorMessage = `${name} is not a valid email.`;
        }
      }
      if (
        value &&
        setting.min &&
        value.length < setting.min &&
        value.length !== 0
      ) {
        const min = setting.min;
        errorMessage = `${name} must be ${min} character${min > 0 && 's'}.`;
      } else if (!value || (setting.min && value.length < setting.min)) {
        errorMessage = `Please fill in your ${name.toLowerCase()}.`;
      }
    }
    if (!setting.min) {
      if (value == null || value === '') {
        errorMessage = `${name} is required.`;
      }
    }
    if (errorMessage) {
      isInputValid = false;
    }
    errors[key] = errorMessage;
  });

  return {errors, required, isInputValid};
}
