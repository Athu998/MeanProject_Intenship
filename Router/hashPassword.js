const express = require('express');
const bcrypt = require("bcrypt");

const hashPass = async () => {
    const password = "P@ss1word";

    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
};

hashPass();