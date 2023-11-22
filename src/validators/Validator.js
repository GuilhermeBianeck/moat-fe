import Difficulty from '../constants/Difficulty.js';

class Validator {
    constructor() {
        throw "This class should not be initialised!";
    }

    static validateDifficulty = (difficulty) => {
        console.log("Validating difficulty!");
        if (difficulty == null || difficulty == undefined || difficulty == "")
            return false;

        if (difficulty < Difficulty.MIN_DIFFICULTY || difficulty > Difficulty.MAX_DIFFICULTY)
            return false;
        else
            return true;
    }

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