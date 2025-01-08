const er = 'ERROR : ' //Error message prefix 

const msgErr = {
    errPayloadRequired: `${er}Payload is required`,
    errPayloadIncorrect: `${er}Incorrect payload`,
    errParamsIncorrect: `${er}Incorrect parameters`,
    errCredentialsIncorrect: `${er}Incorrect credentials`,
    errToken: `${er}Server token error`,
    errApiInternal: `${er}Internal server error`,
    errGeneral: (error) => `${er}${error}`,
    errConsole: (msg,error) => {
        console.error(`--- ${er} : ${msg} ---`);
        if(error)
            console.error(`${error}`);
    }
};

module.exports = {msgErr};