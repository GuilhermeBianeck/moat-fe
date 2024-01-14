import Difficulty from '../constants/Difficulty.js';

/**
 * A class containing various validation methods for an assortment of Application objects.
 */
class Validator {
    constructor() {
        throw "This class should not be initialised!";
    }

    /**
     * A function to validate a selected Difficulty.
     * @param difficulty The Difficulty object to validate.
     * @return A boolean object with 'true' for valid or 'false' for invalid.
     */
    static validateDifficulty = (difficulty) => {
        console.log("Validating difficulty!");
        if (difficulty === null || difficulty === undefined || difficulty === "")
            return false;

        if (difficulty < Difficulty.MIN_DIFFICULTY || difficulty > Difficulty.MAX_DIFFICULTY)
            return false;
        else
            return true;
    }

    /**
     * A function to validate a supplied Nickname.
     * @parm nickname A String representing the Nickname to validate.
     * @return A boolean object with 'true' for valid or 'false' for invalid.
     */ 
    static validateNickname = (nickname) => {
        console.log("Validating nickname!");

        if (nickname === undefined || nickname === null || nickname === "") {
            return false;
        }

        let pattern = /^[A-Z0-9]{5,10}$/;
        let result = pattern.test(nickname);

        if (result)
            return true;
        else
            return false;
    }
}

export default Validator;