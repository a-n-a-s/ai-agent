/*

Adds two numbers together.
@param {number} a - The first number.
@param {number} b - The second number.
@returns {number} The sum of the two numbers.
@throws {Error} If either input is not a number. */
const addNumbers = (a, b) => {
  // Input validation
  if (typeof a != Number || typeof b != Number) {
    throw new Error("Both inputs must be numbers.");
  }

  //Perform addition
  const sum = a + b;

  //Return the sum
  return sum;
};

module.exports = addNumbers;
